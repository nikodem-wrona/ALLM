import { DEFAULT_CHAT_ID } from "../_shared/consts";
import {
  ChatMessageDeletedMainProcessEventPayload,
  DeleteChatMessageRendererProcessEventPayload,
  MainProcessEventType,
} from "../../_shared";
import { internalEventEmitter } from "../InternalEventEmitter";
import { HandlerDependencies } from "./types";

export class DeleteChatMessageHandler {
  constructor(private dependencies: HandlerDependencies) {}

  public async handle({
    id,
  }: DeleteChatMessageRendererProcessEventPayload): Promise<void> {
    const {
      repositories: { messagesRepository },
    } = this.dependencies;

    await messagesRepository.deleteMessageById(id);

    internalEventEmitter.emit<
      MainProcessEventType.CHAT_MESSAGE_DELETED,
      ChatMessageDeletedMainProcessEventPayload
    >(MainProcessEventType.CHAT_MESSAGE_DELETED, {
      type: MainProcessEventType.CHAT_MESSAGE_DELETED,
      payload: {
        id,
        chatId: DEFAULT_CHAT_ID,
      },
    });
  }
}
