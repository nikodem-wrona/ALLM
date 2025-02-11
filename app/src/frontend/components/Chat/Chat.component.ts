import { IComponent } from "../../../_shared/types";

import {
  ChatHeaderComponent,
  InputComponent,
  MessagesComponent,
} from "./components";

const CHAT_COMPONENT_ID = "chat";

export class Chat implements IComponent {
  render(): void {
    const parentElement = document.querySelector("#app");
    const chatElement = document.createElement("div");
    chatElement.id = CHAT_COMPONENT_ID;
    chatElement.classList.add(CHAT_COMPONENT_ID);

    parentElement.appendChild(chatElement);

    const chatHeaderElement = new ChatHeaderComponent(`#${CHAT_COMPONENT_ID}`);
    chatHeaderElement.render();
    chatHeaderElement.fetchChat();

    const messagesComponent = new MessagesComponent(CHAT_COMPONENT_ID);
    messagesComponent.render();

    const inputComponent = new InputComponent(CHAT_COMPONENT_ID);
    inputComponent.render();

    messagesComponent.fetchMessages();
  }
}
