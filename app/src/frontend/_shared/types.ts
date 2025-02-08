export enum MessageType {
  SENT = "sent",
  RECEIVED = "received",
}

export type Message = {
  content: string;
  type: MessageType;
};

export interface IComponent {
  render(): void;
}
