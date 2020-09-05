import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from "@microtickets/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [
    body("token").notEmpty().withMessage("No token provided"),
    body("orderId").notEmpty().withMessage("No Order Id for payment found"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new NotFoundError();
      }
      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("Cannot Pay for a Cancelled Order ");
      }

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token,
      });

      const payment = Payment.build({
        orderId,
        stripeId: charge.id,
      });

      await payment.save();
      await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });

      res.status(201).send({
        success: true,
        data: payment.id,
      });
    } catch (err) {
      res.send({
        success: false,
        err: err.message,
      });
    }
  }
);

export { router as CreateChargeRouter };
