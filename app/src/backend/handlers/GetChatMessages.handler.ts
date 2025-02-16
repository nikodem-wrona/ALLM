import { DEFAULT_CHAT_ID } from "../_shared/consts";
import {
  ChatMessagesFetchedMainProcessEventPayload,
  GetChatMessagesRendererProcessEventPayload,
  MainProcessEventType,
  Message,
  MessageType,
} from "../../_shared";
import { internalEventEmitter } from "../InternalEventEmitter";
import { HandlerDependencies } from "./types";

export class GetChatMessagesHandler {
  constructor(private dependencies: HandlerDependencies) {}

  public async handle(
    _: GetChatMessagesRendererProcessEventPayload
  ): Promise<void> {
    const query = `
      SELECT 
        messages.id as id,
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

    const results = await this.dependencies.database.executeQuery(query, [
      DEFAULT_CHAT_ID,
    ]);

    const messages: Message[] = results.map(
      ({
        id,
        content,
        role,
        total_token_cost,
        created_at,
      }: {
        id: string;
        content: string;
        role: "user" | "assistant" | "developer";
        total_token_cost: number;
        created_at: string;
      }): Message => ({
        id,
        content,
        type: role === "user" ? MessageType.SENT : MessageType.RECEIVED,
        totalTokenCost: total_token_cost,
        createdAt: created_at,
      })
    );

    internalEventEmitter.emit<
      MainProcessEventType.MESSAGES_FETCHED,
      ChatMessagesFetchedMainProcessEventPayload
    >(MainProcessEventType.MESSAGES_FETCHED, {
      type: MainProcessEventType.MESSAGES_FETCHED,
      payload: {
        messages,
      },
    });
  }
}
