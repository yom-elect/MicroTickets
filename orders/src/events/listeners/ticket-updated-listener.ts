import { Listener, TicketUpdatedEvent, Subjects } from "@microtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { QUEUE_GROUP_NAME } from "./queue-group";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { title, price, id, version } = data;

    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not Found");
    }
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
