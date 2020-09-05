import { Publisher, Subjects, TicketCreatedEvent } from "@microtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
