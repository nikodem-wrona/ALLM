import { EventEmitter } from "node:events";

class InternalEventEmitter {
  private eventEmitter: EventEmitter;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  public on(event: string, listener: (payload: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  public emit(event: string, payload: any): void {
    this.eventEmitter.emit(event, payload);
  }
}

export const internalEventEmitter = new InternalEventEmitter();
