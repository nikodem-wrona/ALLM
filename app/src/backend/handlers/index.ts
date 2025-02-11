import { RendererProcessEventType } from "../../_shared";
import { GetChatHandler } from "./GetChat.handler";
import { GetChatMessagesHandler } from "./GetChatMessages.handler";
import { SendMessageHandler } from "./SendChatMessage.handler";
import { HandlerDependencies } from "./types";
export * from "./types";

export type THandlersMap = Record<
  RendererProcessEventType,
  SendMessageHandler | GetChatMessagesHandler | GetChatHandler
>;

export const createHandlersMap = (
  dependencies: HandlerDependencies
): THandlersMap => {
  return {
    [RendererProcessEventType.SEND_MESSAGE]: new SendMessageHandler(
      dependencies
    ),
    [RendererProcessEventType.FETCH_MESSAGES]: new GetChatMessagesHandler(
      dependencies
    ),
    [RendererProcessEventType.FETCH_CHAT]: new GetChatHandler(dependencies),
  };
};
