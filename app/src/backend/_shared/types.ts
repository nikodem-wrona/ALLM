export enum RendererEventType {
  SEND_MESSAGE = "SEND_MESSAGE",
  FETCH_MESSAGES = "FETCH_MESSAGES",
}

export enum MainProcessEventType {
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
  MESSAGES_FETCHED = "MESSAGES_FETCHED",
}

export interface IHandler {
  handle(payload: any): Promise<void>;
}
