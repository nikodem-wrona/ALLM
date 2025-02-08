import { IComponent } from "../../../../_shared/types";

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

    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputContainerElement.appendChild(inputElement);

    const sendButtonElement = document.createElement("button");
    const sendButtonElementId = "send-button";

    sendButtonElement.id = sendButtonElementId;

    sendButtonElement.onclick = () => {
      window.electron.sendEvent({
        type: "SEND_MESSAGE",
        payload: {
          content: inputElement.value,
        },
      });

      inputElement.value = "";
    };

    sendButtonElement.textContent = "Send";
    inputContainerElement.appendChild(sendButtonElement);
  }
}
