import { Subjects, Publisher, PaymentCreatedEvent } from "@microtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
