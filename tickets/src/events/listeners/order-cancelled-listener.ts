import { Listener, OrderCancelledEvent, Subjects } from "@microtickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "./order-created-listener";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const { ticket } = data;

    const sticket = await Ticket.findById(ticket.id);

    if (!sticket) throw new Error("Ticket not found");

    sticket.set({ orderId: undefined });
    await sticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: sticket.id,
      orderId: sticket.orderId,
      userId: sticket.userId,
      price: sticket.price,
      title: sticket.title,
      version: sticket.version,
    });

    msg.ack();
  }
}
