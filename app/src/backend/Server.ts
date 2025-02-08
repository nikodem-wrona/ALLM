import {
  IHandler,
  MainProcessEventType,
  RendererEventType,
} from "./_shared/types";
import { AppConfigManager } from "./AppConfigManager";
import { GetChatMessagesHandler, SendMessageHandler } from "./handlers";
import { internalEventEmitter } from "./InternalEventEmitter";
import { OpenAiClient } from "./llm";
import { SQLiteClient } from "./SQLiteClient";

const EVENTS_TO_LISTEN = [
  MainProcessEventType.MESSAGE_RECEIVED,
  MainProcessEventType.MESSAGES_FETCHED,
];

export class Server {
  private handlersMap = new Map<RendererEventType, IHandler>();

  async start() {
    const configManager = new AppConfigManager();
    configManager.loadConfig();

    const database = new SQLiteClient();

    await database.connect();
    await database.initSchema();

    const openAiClient = new OpenAiClient({
      apiKey: configManager.config.providers.openai.apiKey,
    });

    this.handlersMap.set(
      RendererEventType.SEND_MESSAGE,
      new SendMessageHandler({
        openAiClient,
        database,
      })
    );

    this.handlersMap.set(
      RendererEventType.FETCH_MESSAGES,
      new GetChatMessagesHandler({
        database,
      })
    );
  }

  listenToInternalEvents(
    electronIPCMessageSender: (payload: {
      type: MainProcessEventType;
      payload: any;
    }) => void
  ) {
    EVENTS_TO_LISTEN.forEach((event) => {
      internalEventEmitter.on(event, ({ payload }: { payload: any }) => {
        electronIPCMessageSender({
          type: event,
          payload,
        });
      });
    });
  }

  handleEvent(event: { type: RendererEventType; payload: any }) {
    switch (event.type) {
      case RendererEventType.SEND_MESSAGE:
        this.handlersMap
          .get(RendererEventType.SEND_MESSAGE)
          .handle(event.payload);
        break;
      case RendererEventType.FETCH_MESSAGES:
        this.handlersMap
          .get(RendererEventType.FETCH_MESSAGES)
          .handle(event.payload);
        break;
    }
  }
}
