export enum MessageType {
  SENT = "sent",
  RECEIVED = "received",
}

export type Message = {
  content: string;
  type: MessageType;
  totalTokenCost: number;
  createdAt: string;
};

export type Chat = {
  name: string;
  totalTokenCost: number;
  estimatedCostInUSD: number;
  provider: string;
};

export interface IComponent {
  render(): void;
}
