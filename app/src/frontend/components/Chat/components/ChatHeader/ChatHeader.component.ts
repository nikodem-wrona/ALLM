import { appStore } from "../../../../store/Store";
import {
  Chat,
  IComponent,
  GetChatMessagesRendererProcessEventPayload,
  RendererProcessEventType,
} from "../../../../../_shared";

export class ChatHeaderComponent implements IComponent {
  private parentElementSelector: string;
  private chat: Chat;

  constructor(parentElementSelector: string) {
    this.parentElementSelector = parentElementSelector;
    appStore.subscribeForChat(this.handleUpdateChat.bind(this));
  }

  public fetchChat(): void {
    window.electron.sendEvent<
      RendererProcessEventType.FETCH_CHAT,
      GetChatMessagesRendererProcessEventPayload
    >({
      type: RendererProcessEventType.FETCH_CHAT,
      payload: {},
    });
  }

  private handleUpdateChat(chat: Chat): void {
    this.chat = chat;
    this.renderChat();
  }

  private renderChat(): void {
    const chatTitleElement = document.querySelector(".chat-title");

    if (!chatTitleElement) {
      return;
    }

    chatTitleElement.textContent = this.chat.name;

    const numberOfTokensElement = document.querySelector(".number-of-tokens");
    numberOfTokensElement.textContent = `Tokens burned: ${
      this.chat.totalTokenCost || 0
    }`;

    const estimatedCostInUSDElement = document.querySelector(
      ".estimated-cost-in-usd"
    );

    const roundedEstimatedCostInUSD = this.chat.estimatedCostInUSD.toFixed(5);
    estimatedCostInUSDElement.textContent = `Estimated cost in USD: ${roundedEstimatedCostInUSD}`;
  }

  render(): void {
    const parentElement = document.querySelector(this.parentElementSelector);
    const chatHeaderElement = document.createElement("div");
    parentElement.appendChild(chatHeaderElement);

    chatHeaderElement.classList.add("chat-header");

    const titleElement = document.createElement("h1");
    titleElement.classList.add("chat-title");

    const numberOfTokensElement = document.createElement("div");
    numberOfTokensElement.classList.add("number-of-tokens");

    const estimatedCostInUSDElement = document.createElement("div");
    estimatedCostInUSDElement.classList.add("estimated-cost-in-usd");

    const statisticsContainerElement = document.createElement("div");
    statisticsContainerElement.classList.add("statistics-container");

    chatHeaderElement.appendChild(titleElement);
    chatHeaderElement.appendChild(statisticsContainerElement);

    statisticsContainerElement.appendChild(numberOfTokensElement);
    statisticsContainerElement.appendChild(estimatedCostInUSDElement);
  }
}
