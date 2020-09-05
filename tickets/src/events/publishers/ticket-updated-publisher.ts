import { Publisher, Subjects, TicketUpdatedEvent } from "@microtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
