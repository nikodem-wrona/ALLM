import { EventEmitter } from "node:events";
import { MainProcessEventType, MainProcessEventsPayloads } from "../_shared";

class InternalEventEmitter {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public on(
    event: MainProcessEventType,
    listener: (payload: {
      type: MainProcessEventType;
      payload: MainProcessEventsPayloads;
    }) => void
  ): void {
    this.eventEmitter.on(event, listener);
  }

  public emit<
    Event extends MainProcessEventType,
    Payload extends MainProcessEventsPayloads
  >(
    event: Event,
    payload: {
      type: Event;
      payload: Payload;
    }
  ): void {
    this.eventEmitter.emit(event, payload);
  }
}

export const internalEventEmitter = new InternalEventEmitter();
