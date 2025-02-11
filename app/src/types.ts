import "electron";
import {
  MainProcessEventType,
  MainProcessEventsPayloads,
  RendererProcessEventType,
  RendererProcessEventsPayloads,
} from "./_shared";

declare global {
  interface Window {
    electron: {
      sendEvent: <
        Event extends RendererProcessEventType,
        Payload extends RendererProcessEventsPayloads
      >(event: {
        type: Event;
        payload: Payload;
      }) => void;
      onEvent: (
        callback: <
          Event extends MainProcessEventType,
          Payload extends MainProcessEventsPayloads
        >(event: {
          type: Event;
          payload: Payload;
        }) => void
      ) => void;
    };
  }
}
