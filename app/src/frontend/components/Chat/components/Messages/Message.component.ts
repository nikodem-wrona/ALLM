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

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    messageContainerElement.appendChild(messageElement);

    const messageContentElement = document.createElement("div");
    messageContentElement.classList.add("message-content");
    messageContentElement.textContent = this.props.message.content;

    if (this.props.message.type === MessageType.SENT) {
      messageContainerElement.classList.add("sent");
      messageContentElement.classList.add("sent");
    } else {
      messageContainerElement.classList.add("received");
    }

    const metadataElement = document.createElement("div");
    metadataElement.classList.add("metadata");

    const totalTokensCostElement = document.createElement("span");
    totalTokensCostElement.classList.add("total-token-cost");
    totalTokensCostElement.textContent = `TC: ${this.props.message.totalTokenCost}`;

    const timestampElement = document.createElement("span");
    timestampElement.classList.add("timestamp");

    const formattedDate = new Date(this.props.message.createdAt);
    const day = formattedDate.toLocaleDateString();
    const hour = formattedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    timestampElement.textContent = `${day} ${hour}`;

    parentElement.appendChild(messageContainerElement);
    messageElement.appendChild(messageContentElement);
    messageElement.appendChild(metadataElement);

    metadataElement.appendChild(timestampElement);
    metadataElement.appendChild(totalTokensCostElement);
  }
}
