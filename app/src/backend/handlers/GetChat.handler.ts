import { DEFAULT_CHAT_ID } from "../_shared/consts";
import { MainProcessEventType } from "../_shared/types";
import { internalEventEmitter } from "../InternalEventEmitter";
import { SQLiteClient } from "../SQLiteClient";

type GetChatMessagesHandlerDependencies = {
  database: SQLiteClient;
};

export class GetChatHandler {
  constructor(private dependencies: GetChatMessagesHandlerDependencies) {}

  public async handle(): Promise<void> {
    const GET_CHAT_DETAILS_QUERY = `
      SELECT 
        name, 
        provider 
      FROM 
        chats
      WHERE 
        id = ?;
    `;

    const GET_TOKENS_BURNED_QUERY = `
        SELECT 
            SUM(mm.total_token_cost) as total_token_cost
        FROM 
            messages m 
        JOIN 
            message_metadata mm on mm.message_id = m.id 
        WHERE 
            chat_id = ?
        ORDER BY 
            m.created_at
    `;

    const [chat] = await this.dependencies.database.executeQuery(
      GET_CHAT_DETAILS_QUERY,
      [DEFAULT_CHAT_ID]
    );

    const [{ total_token_cost }] =
      await this.dependencies.database.executeQuery(GET_TOKENS_BURNED_QUERY, [
        DEFAULT_CHAT_ID,
      ]);

    const OPEN_AI_COST_PER_TOKEN = 0.15 / 1000000;

    internalEventEmitter.emit(MainProcessEventType.CHAT_FETCHED, {
      type: MainProcessEventType.CHAT_FETCHED,
      payload: {
        name: chat.name,
        provider: chat.provider,
        totalTokenCost: total_token_cost,
        estimatedCostInUSD: total_token_cost * OPEN_AI_COST_PER_TOKEN,
      },
    });
  }
}
