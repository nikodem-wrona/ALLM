import {
  ENABLED_MAIN_PROCESS_EVENTS,
  MainProcessEventType,
  MainProcessEventsPayloads,
  RendererProcessEventType,
  RendererProcessEventsPayloads,
} from "../_shared";

import { AppConfigManager } from "./AppConfigManager";

import { internalEventEmitter } from "./InternalEventEmitter";
import { OpenAiClient } from "./llm";
import { Database } from "./Database";
import { createHandlersMap, THandlersMap } from "./handlers";
import { createRepositoriesMap } from "./repositories";

export class Server {
  private handlersMap: THandlersMap;

  async start() {
    const configManager = new AppConfigManager();
    configManager.loadConfig();

    const database = new Database();

    await database.connect();
    await database.initSchema();

    const repositories = createRepositoriesMap({
      database,
    });

    const openAiClient = new OpenAiClient({
      apiKey: configManager.config.providers.openai.apiKey,
    });

    this.handlersMap = createHandlersMap({
      openAiClient,
      database,
      repositories,
    });
  }

  listenToInternalEvents(
    electronIPCMessageSender: (payload: {
      type: MainProcessEventType;
      payload: MainProcessEventsPayloads;
    }) => void
  ) {
    ENABLED_MAIN_PROCESS_EVENTS.forEach((event) => {
      internalEventEmitter.on(
        event,
        ({
          payload,
        }: {
          type: MainProcessEventType;
          payload: MainProcessEventsPayloads;
        }) => {
          electronIPCMessageSender({
            type: event,
            payload,
          });
        }
      );
    });
  }

  handleEvent(event: {
    type: RendererProcessEventType;
    payload: RendererProcessEventsPayloads;
  }) {
    const handler = this.handlersMap[event.type];

    if (!handler) {
      throw new Error(`Handler for event ${event.type} not found`);
    }

    handler.handle(event.payload as any);
  }
}
