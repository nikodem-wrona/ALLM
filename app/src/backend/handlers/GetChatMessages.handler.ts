import { DEFAULT_CHAT_ID } from "../_shared/consts";
import { MainProcessEventType } from "../_shared/types";
import { internalEventEmitter } from "../InternalEventEmitter";
import { SQLiteClient } from "../SQLiteClient";

type GetChatMessagesHandlerDependencies = {
  database: SQLiteClient;
};

export class GetChatMessagesHandler {
  constructor(private dependencies: GetChatMessagesHandlerDependencies) {}

  public async handle(): Promise<void> {
    const query = `
      SELECT 
        content, 
        role, 
        created_at,
        message_metadata.total_token_cost as total_token_cost
      FROM 
        messages 
      JOIN
        message_metadata ON message_metadata.message_id = messages.id
      WHERE 
        chat_id = ? 
      ORDER BY 
        created_at ASC;
    `;

    const messages = await this.dependencies.database.executeQuery(query, [
      DEFAULT_CHAT_ID,
    ]);

    internalEventEmitter.emit(MainProcessEventType.MESSAGES_FETCHED, {
      type: MainProcessEventType.MESSAGES_FETCHED,
      payload: {
        messages: messages.map(
          ({
            content,
            role,
            total_token_cost,
            created_at,
          }: {
            content: string;
            role: "user" | "assistant" | "developer";
            total_token_cost: number;
            created_at: string;
          }) => ({
            content,
            type: role === "user" ? "sent" : "received",
            totalTokenCost: total_token_cost,
            createdAt: created_at,
          })
        ),
      },
    });
  }
}
