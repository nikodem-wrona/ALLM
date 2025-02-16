import {
  ChatFetchedMainProcessEventPayload,
  ChatMessageDeletedMainProcessEventPayload,
  ChatMessagesFetchedMainProcessEventPayload,
  GetChatRendererProcessEventPayload,
  MainProcessEventType,
  MessageReceivedMainProcessEventPayload,
  MessageType,
  RendererProcessEventType,
} from "../../_shared";
import { appStore } from "./Store";

export class IPCEventHandler {
  constructor() {
    const handlersMap = {
      [MainProcessEventType.MESSAGE_RECEIVED]: (
        p: MessageReceivedMainProcessEventPayload
      ) => this.handleMessageReceived(p),
      [MainProcessEventType.MESSAGES_FETCHED]: (
        p: ChatMessagesFetchedMainProcessEventPayload
      ) => this.handleMessagesFetched(p),

      [MainProcessEventType.CHAT_FETCHED]: (
        p: ChatFetchedMainProcessEventPayload
      ) => this.handleChatFetched(p),
      [MainProcessEventType.CHAT_MESSAGE_DELETED]: (
        p: ChatMessageDeletedMainProcessEventPayload
      ) => this.handleChatMessageDeleted(p),
    };

    window.electron.onEvent((event) => {
      const { payload, type } = event;

      const handler = handlersMap[type];

      if (handler) {
        handler(payload as any);
      }
    });
  }

  private handleMessageReceived(
    payload: MessageReceivedMainProcessEventPayload
  ) {
    appStore.addMessage({
      id: payload.id,
      content: payload.content,
      type: payload.type,
      totalTokenCost: payload.totalTokenCost,
      createdAt: payload.createdAt,
    });

    window.electron.sendEvent<
      RendererProcessEventType.FETCH_CHAT,
      GetChatRendererProcessEventPayload
    >({
      type: RendererProcessEventType.FETCH_CHAT,
      payload: {},
    });
  }

  private handleMessagesFetched(
    payload: ChatMessagesFetchedMainProcessEventPayload
  ) {
    appStore.setMessages(
      payload.messages.map(
        ({ id, content, type, totalTokenCost, createdAt }) => ({
          id,
          content,
          type: type as MessageType,
          totalTokenCost: totalTokenCost,
          createdAt,
        })
      )
    );
  }

  private handleChatFetched(payload: ChatFetchedMainProcessEventPayload) {
    appStore.setChat({
      name: payload.name,
      provider: payload.provider,
      totalTokenCost: payload.totalTokenCost,
      estimatedCostInUSD: payload.estimatedCostInUSD,
    });
  }

  private handleChatMessageDeleted(
    payload: ChatMessageDeletedMainProcessEventPayload
  ) {
    appStore.deleteChatMessage({
      messageId: payload.id,
      chatId: payload.chatId,
    });
  }
}
