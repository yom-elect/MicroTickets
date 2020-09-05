import { Publisher, OrderCreatedEvent, Subjects } from "@microtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
