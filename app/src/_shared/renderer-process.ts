export enum RendererProcessEventType {
  SEND_MESSAGE = "SEND_MESSAGE",
  FETCH_MESSAGES = "FETCH_MESSAGES",
  FETCH_CHAT = "FETCH_CHAT",
  DELETE_CHAT_MESSAGE = "DELETE_CHAT_MESSAGE",
}

export type GetChatMessagesRendererProcessEventPayload = NonNullable<unknown>;
export type GetChatRendererProcessEventPayload = NonNullable<unknown>;
export type SendChatMessageRendererProcessEventPayload = {
  content: string;
};
export type DeleteChatMessageRendererProcessEventPayload = {
  id: string;
};

export const ENABLED_RENDERER_PROCESS_EVENTS = [
  RendererProcessEventType.SEND_MESSAGE,
  RendererProcessEventType.FETCH_MESSAGES,
  RendererProcessEventType.FETCH_CHAT,
  RendererProcessEventType.DELETE_CHAT_MESSAGE,
];

export type RendererProcessEventsPayloads =
  | SendChatMessageRendererProcessEventPayload
  | GetChatRendererProcessEventPayload
  | GetChatMessagesRendererProcessEventPayload
  | DeleteChatMessageRendererProcessEventPayload;
