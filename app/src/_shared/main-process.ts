import { Message, Provider } from "./types";

export enum MainProcessEventType {
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",
  MESSAGES_FETCHED = "MESSAGES_FETCHED",
  CHAT_FETCHED = "CHAT_FETCHED",
  CHAT_MESSAGE_DELETED = "CHAT_MESSAGE_DELETED",
}

export const ENABLED_MAIN_PROCESS_EVENTS = [
  MainProcessEventType.CHAT_FETCHED,
  MainProcessEventType.MESSAGES_FETCHED,
  MainProcessEventType.MESSAGE_RECEIVED,
  MainProcessEventType.CHAT_MESSAGE_DELETED,
  MainProcessEventType.CHAT_MESSAGE_DELETED,
];

export type ChatFetchedMainProcessEventPayload = {
  name: string;
  provider: Provider;
  totalTokenCost: number;
  estimatedCostInUSD: number;
};

export type ChatMessageDeletedMainProcessEventPayload = {
  id: string;
  chatId: string;
};

export type ChatMessagesFetchedMainProcessEventPayload = {
  messages: Message[];
};

export type MessageReceivedMainProcessEventPayload = Message;

export type MainProcessEventsPayloads =
  | ChatFetchedMainProcessEventPayload
  | ChatMessagesFetchedMainProcessEventPayload
  | MessageReceivedMainProcessEventPayload
  | ChatMessageDeletedMainProcessEventPayload;
