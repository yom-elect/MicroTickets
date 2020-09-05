import { Listener, OrderCreatedEvent, Subjects } from "@microtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export const QUEUE_GROUP_NAME = "tickets-service";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { ticket, id } = data;

    // Find ticket that the order is reserving
    const sticket = await Ticket.findById(ticket.id);

    // If no ticket, throw error
    if (!sticket) throw new Error("Ticket not found!");

    // Mark the ticket as being reserved by setting its orderId property
    sticket.set({ orderId: id });

    // Save the ticket
    await sticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: sticket.id,
      price: sticket.price,
      title: sticket.title,
      userId: sticket.userId,
      orderId: sticket.orderId!,
      version: sticket.version,
    });
    // ack the message
    msg.ack();
  }
}
