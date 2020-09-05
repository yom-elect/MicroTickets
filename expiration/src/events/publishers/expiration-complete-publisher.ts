import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@microtickets/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
