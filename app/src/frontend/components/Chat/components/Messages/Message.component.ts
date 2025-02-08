import { Message, MessageType, IComponent } from "../../../../_shared/types";

type MessageComponentProps = {
  message: Message;
};

export class MessageComponent implements IComponent {
  private parentElementSelector: string;
  private readonly props: MessageComponentProps;
  constructor(parentElementSelector: string, props: MessageComponentProps) {
    this.parentElementSelector = parentElementSelector;
    this.props = props;
  }

  render(): void {
    const parentElement = document.querySelector(this.parentElementSelector);

    const messageContainerElement = document.createElement("li");
    messageContainerElement.classList.add("message-container");
    messageContainerElement.textContent = this.props.message.content;

    if (this.props.message.type === MessageType.SENT) {
      messageContainerElement.classList.add("sent");
    } else {
      messageContainerElement.classList.add("received");
    }

    parentElement.appendChild(messageContainerElement);
  }
}
