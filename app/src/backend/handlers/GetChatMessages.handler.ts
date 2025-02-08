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
      SELECT content, role, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC;
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
          }: {
            content: string;
            role: "user" | "assistant" | "developer";
          }) => ({
            content,
            type: role === "user" ? "sent" : "received",
          })
        ),
      },
    });
  }
}
