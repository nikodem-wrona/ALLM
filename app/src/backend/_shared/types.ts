export enum RendererEventType {
  SEND_MESSAGE = "SEND_MESSAGE",
  FETCH_MESSAGES = "FETCH_MESSAGES",
  FETCH_CHAT = "FETCH_CHAT",
}

export enum MainProcessEventType {
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
  MESSAGES_FETCHED = "MESSAGES_FETCHED",
  CHAT_FETCHED = "CHAT_FETCHED",
}

export interface IHandler {
  handle(payload: any): Promise<void>;
}
