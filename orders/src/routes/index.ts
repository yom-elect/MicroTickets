import express, { Request, Response } from "express";
import { requireAuth } from "@microtickets/common";
import { Order } from "../models/orders";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate("ticket");

  res.send({
    message: "All orders for User",
    data: orders,
  });
});

export { router as indexOrderRouter };
