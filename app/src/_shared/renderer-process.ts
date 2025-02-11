export enum RendererProcessEventType {
  SEND_MESSAGE = "SEND_MESSAGE",
  FETCH_MESSAGES = "FETCH_MESSAGES",
  FETCH_CHAT = "FETCH_CHAT",
}

export type GetChatMessagesRendererProcessEventPayload = NonNullable<unknown>;
export type GetChatRendererProcessEventPayload = NonNullable<unknown>;
export type SendChatMessageRendererProcessEventPayload = {
  content: string;
};

export const ENABLED_RENDERER_PROCESS_EVENTS = [
  RendererProcessEventType.SEND_MESSAGE,
  RendererProcessEventType.FETCH_MESSAGES,
  RendererProcessEventType.FETCH_CHAT,
];

export type RendererProcessEventsPayloads =
  | SendChatMessageRendererProcessEventPayload
  | GetChatRendererProcessEventPayload
  | GetChatMessagesRendererProcessEventPayload;
