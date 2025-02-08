import { MessageType } from "../_shared/types";
import { appStore } from "./Store";

type EventTypes = "MESSAGE_RECEIVED" | "MESSAGES_FETCHED";

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
      }
    });
  }

  private handleMessageReceived(payload: {
    content: string;
    type: MessageType;
  }) {
    appStore.addMessage({
      content: payload.content,
      type: payload.type,
    });
  }

  private handleMessagesFetched(payload: {
    messages: { content: string; type: string }[];
  }) {
    appStore.setMessages(
      payload.messages.map(({ content, type }) => ({
        content,
        type: type as MessageType,
      }))
    );
  }
}
