import { Publisher, OrderCancelledEvent, Subjects } from "@microtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
