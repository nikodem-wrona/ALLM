import { v4 } from "uuid";

import { DEFAULT_CHAT_ID } from "../_shared/consts";
import {
  MainProcessEventType,
  MessageReceivedMainProcessEventPayload,
  MessageType,
  SendChatMessageRendererProcessEventPayload,
} from "../../_shared";
import { internalEventEmitter } from "../InternalEventEmitter";
import { HandlerDependencies } from "./types";

export class SendMessageHandler {
  constructor(private dependencies: HandlerDependencies) {}

  private async saveMessage(
    content: string,
    role: "user" | "assistant" | "developer",
    totalTokenCost: number
  ): Promise<{
    createdAt: string;
  }> {
    const messageId = v4();
    const messageMetadataId = v4();

    const SAVE_MESSAGE_QUERY = `
      INSERT INTO messages (id, content, created_at, role, chat_id)
      VALUES (?, ?, ?, ?, ?);
    `;

    const SAVE_MESSAGE_METADATA_QUERY = `
      INSERT INTO message_metadata (id, message_id, total_token_cost)
      VALUES (?, ?, ?);
    `;

    const createdAt = new Date().toISOString();

    await this.dependencies.database.executeQuery(SAVE_MESSAGE_QUERY, [
      messageId,
      content,
      createdAt,
      role,
      DEFAULT_CHAT_ID,
    ]);

    await this.dependencies.database.executeQuery(SAVE_MESSAGE_METADATA_QUERY, [
      messageMetadataId,
      messageId,
      totalTokenCost,
    ]);

    return {
      createdAt,
    };
  }

  private getPreviousMessages(): Promise<
    Array<{ content: string; role: "user" | "assistant" | "developer" }>
  > {
    const query = `
      SELECT 
        content, 
        role,
        message_metadata.total_token_cost as total_token_cost
      FROM 
        messages 
      JOIN
        message_metadata 
      ON 
        message_metadata.message_id = messages.id  
      WHERE 
        chat_id = ? 
      ORDER BY 
        created_at DESC;
    `;

    return this.dependencies.database.executeQuery(query, [DEFAULT_CHAT_ID]);
  }

  public async handle({
    content,
  }: SendChatMessageRendererProcessEventPayload): Promise<void> {
    const previousMessages = await this.getPreviousMessages();

    const { createdAt: senderMessageCreatedAt } = await this.saveMessage(
      content,
      "user",
      0
    );

    internalEventEmitter.emit<
      MainProcessEventType.MESSAGE_RECEIVED,
      MessageReceivedMainProcessEventPayload
    >(MainProcessEventType.MESSAGE_RECEIVED, {
      type: MainProcessEventType.MESSAGE_RECEIVED,
      payload: {
        content: content,
        type: MessageType.SENT,
        totalTokenCost: 0,
        createdAt: senderMessageCreatedAt,
      },
    });

    const messages: Array<{
      content: string;
      role: "user" | "assistant" | "developer";
    }> = [
      ...previousMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content,
      },
    ];

    const response = await this.dependencies.openAiClient.createCompletion({
      model: "gpt-4o-mini",
      messages,
    });

    const { message, totalTokenCost } = response;

    const { createdAt } = await this.saveMessage(
      message.content,
      message.role,
      totalTokenCost
    );

    internalEventEmitter.emit<
      MainProcessEventType.MESSAGE_RECEIVED,
      MessageReceivedMainProcessEventPayload
    >(MainProcessEventType.MESSAGE_RECEIVED, {
      type: MainProcessEventType.MESSAGE_RECEIVED,
      payload: {
        content: message.content,
        type: MessageType.RECEIVED,
        totalTokenCost,
        createdAt,
      },
    });
  }
}
