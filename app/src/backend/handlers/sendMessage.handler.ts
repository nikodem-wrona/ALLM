import { DEFAULT_CHAT_ID } from "../_shared/consts";
import { MainProcessEventType } from "../_shared/types";
import { internalEventEmitter } from "../InternalEventEmitter";
import { OpenAiClient } from "../llm";
import { SQLiteClient } from "../SQLiteClient";
import { v4 } from "uuid";

type SendMessageHandlerPayload = {
  content: string;
};

type SendMessageHandlerDependencies = {
  openAiClient: OpenAiClient;
  database: SQLiteClient;
};

export class SendMessageHandler {
  constructor(private dependencies: SendMessageHandlerDependencies) {}

  private async saveMessage(
    content: string,
    role: "user" | "assistant" | "developer",
    totalTokenCost: number
  ): Promise<void> {
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

    await this.dependencies.database.executeQuery(SAVE_MESSAGE_QUERY, [
      messageId,
      content,
      new Date().toISOString(),
      role,
      DEFAULT_CHAT_ID,
    ]);

    await this.dependencies.database.executeQuery(SAVE_MESSAGE_METADATA_QUERY, [
      messageMetadataId,
      messageId,
      totalTokenCost,
    ]);
  }

  private getPreviousMessages(): Promise<
    Array<{ content: string; role: "user" | "assistant" | "developer" }>
  > {
    const query = `
      SELECT content, role FROM messages WHERE chat_id = ? ORDER BY created_at DESC;
    `;

    return this.dependencies.database.executeQuery(query, [DEFAULT_CHAT_ID]);
  }

  public async handle({ content }: SendMessageHandlerPayload): Promise<void> {
    const previousMessages = await this.getPreviousMessages();

    await this.saveMessage(content, "user", 0);

    internalEventEmitter.emit(MainProcessEventType.MESSAGE_RECEIVED, {
      type: MainProcessEventType.MESSAGE_RECEIVED,
      payload: {
        content: content,
        type: "sent",
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

    await this.saveMessage(message.content, message.role, totalTokenCost);

    internalEventEmitter.emit(MainProcessEventType.MESSAGE_RECEIVED, {
      type: MainProcessEventType.MESSAGE_RECEIVED,
      payload: {
        content: message.content,
        type: "received",
      },
    });
  }
}
