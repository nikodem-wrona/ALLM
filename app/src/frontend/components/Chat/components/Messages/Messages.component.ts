import { appStore } from "../../../../store/Store";
import {
  Message,
  IComponent,
  RendererProcessEventType,
  GetChatMessagesRendererProcessEventPayload,
} from "../../../../../_shared";
import { MessageComponent } from "./Message.component";

export class MessagesComponent implements IComponent {
  private parentElementId: string;
  private messages: Message[] = [];

  constructor(parentElementId: string) {
    this.parentElementId = parentElementId;
    appStore.subscribeForMessages(this.handleUpdateMessages.bind(this));
  }

  private handleUpdateMessages(messages: Message[]): void {
    this.messages = messages;
    this.renderMessages();

    // scroll to the bottom of the message list
    const messageListElement = document.querySelector(
      `#${this.parentElementId} .message-list`
    );

    if (!messageListElement) {
      return;
    }

    messageListElement.scrollTop = messageListElement.scrollHeight;
  }

  public fetchMessages(): void {
    window.electron.sendEvent<
      RendererProcessEventType.FETCH_MESSAGES,
      GetChatMessagesRendererProcessEventPayload
    >({
      type: RendererProcessEventType.FETCH_MESSAGES,
      payload: {},
    });
  }

  renderMessages(): void {
    const messageListElement = document.querySelector(
      `#${this.parentElementId} .message-list`
    );

    if (!messageListElement) {
      return;
    }

    messageListElement.innerHTML = "";

    this.messages.forEach((message) => {
      const messageComponent = new MessageComponent(
        `#${this.parentElementId} .message-list`,
        {
          message,
        }
      );
      messageComponent.render();
    });
  }

  render(): void {
    const parentElement = document.querySelector(`#${this.parentElementId}`);

    const messageListContainerElement = document.createElement("div");
    messageListContainerElement.classList.add("message-list-container");
    parentElement.appendChild(messageListContainerElement);

    const messageListElement = document.createElement("ul");
    messageListElement.classList.add("message-list");
    messageListContainerElement.appendChild(messageListElement);

    this.renderMessages();
  }
}
