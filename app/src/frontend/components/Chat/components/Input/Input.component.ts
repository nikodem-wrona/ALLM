import {
  IComponent,
  RendererProcessEventType,
  SendChatMessageRendererProcessEventPayload,
} from "../../../../../_shared";

export class InputComponent implements IComponent {
  private parentElementId: string;

  constructor(parentElementId: string) {
    this.parentElementId = parentElementId;
  }

  render(): void {
    const parentElement = document.querySelector(`#${this.parentElementId}`);

    const inputContainerElement = document.createElement("div");
    inputContainerElement.classList.add("input-container");
    parentElement.appendChild(inputContainerElement);

    const inputItemsContainerElement = document.createElement("div");
    inputItemsContainerElement.classList.add("input-items-container");
    inputContainerElement.appendChild(inputItemsContainerElement);

    const inputFirstRowElement = document.createElement("div");
    inputFirstRowElement.classList.add("input-first-row");
    inputItemsContainerElement.appendChild(inputFirstRowElement);

    const inputElement = document.createElement("textarea");
    inputElement.rows = 1;
    inputFirstRowElement.appendChild(inputElement);

    const inputSecondRowElement = document.createElement("div");
    inputSecondRowElement.classList.add("input-second-row");
    inputItemsContainerElement.appendChild(inputSecondRowElement);

    inputElement.addEventListener("input", () => {
      if (!inputElement.value) {
        inputElement.rows = 1;
      }

      if (
        inputElement.clientHeight < inputElement.scrollHeight &&
        inputElement.rows < 10
      ) {
        inputElement.rows += 1;
      }
    });

    inputElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendButtonElement.click();
      }
    });

    const sendButtonElement = document.createElement("button");
    const sendButtonElementId = "send-button";

    sendButtonElement.id = sendButtonElementId;

    sendButtonElement.onclick = () => {
      if (!inputElement.value) {
        return;
      }

      window.electron.sendEvent<
        RendererProcessEventType.SEND_MESSAGE,
        SendChatMessageRendererProcessEventPayload
      >({
        type: RendererProcessEventType.SEND_MESSAGE,
        payload: {
          content: inputElement.value,
        },
      });

      inputElement.value = "";
    };

    sendButtonElement.textContent = "Send";
    inputSecondRowElement.appendChild(sendButtonElement);
  }
}
