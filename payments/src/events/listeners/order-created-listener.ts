import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@microtickets/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { id, status, version, ticket, userId } = data;
    const order = Order.build({
      id,
      price: ticket.price,
      status,
      version,
      userId,
    });

    await order.save();

    msg.ack();
  }
}
