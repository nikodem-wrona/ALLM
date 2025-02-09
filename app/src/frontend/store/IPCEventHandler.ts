import { MessageType } from "../_shared/types";
import { appStore } from "./Store";

type EventTypes = "MESSAGE_RECEIVED" | "MESSAGES_FETCHED" | "CHAT_FETCHED";

export class IPCEventHandler {
  constructor() {
    window.electron.onEvent((event: { type: EventTypes; payload: any }) => {
      switch (event.type) {
        case "MESSAGE_RECEIVED":
          this.handleMessageReceived(event.payload);
          break;
        case "MESSAGES_FETCHED":
          this.handleMessagesFetched(event.payload);
          break;
        case "CHAT_FETCHED":
          this.handleChatFetched(event.payload);
          break;
      }
    });
  }

  private handleMessageReceived(payload: {
    content: string;
    type: MessageType;
    totalTokenCost: number;
    createdAt: string;
  }) {
    appStore.addMessage({
      content: payload.content,
      type: payload.type,
      totalTokenCost: payload.totalTokenCost,
      createdAt: payload.createdAt,
    });

    window.electron.sendEvent({
      type: "FETCH_CHAT",
      payload: {},
    });
  }

  private handleMessagesFetched(payload: {
    messages: {
      content: string;
      type: string;
      totalTokenCost: number;
      createdAt: string;
    }[];
  }) {
    appStore.setMessages(
      payload.messages.map(({ content, type, totalTokenCost, createdAt }) => ({
        content,
        type: type as MessageType,
        totalTokenCost: totalTokenCost,
        createdAt,
      }))
    );
  }

  private handleChatFetched(payload: {
    name: string;
    provider: string;
    totalTokenCost: number;
    estimatedCostInUSD: number;
  }) {
    appStore.setChat({
      name: payload.name,
      provider: payload.provider,
      totalTokenCost: payload.totalTokenCost,
      estimatedCostInUSD: payload.estimatedCostInUSD,
    });
  }
}
