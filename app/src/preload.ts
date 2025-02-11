// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import {
  MainProcessEventsPayloads,
  MainProcessEventType,
  RendererProcessEventsPayloads,
  RendererProcessEventType,
} from "./_shared";

contextBridge.exposeInMainWorld("electron", {
  sendEvent: <
    Event extends RendererProcessEventType,
    Payload extends RendererProcessEventsPayloads
  >(event: {
    type: RendererProcessEventType;
    payload: {
      type: Event;
      payload: Payload;
    };
  }) => {
    ipcRenderer.send("sendEvent", event);
  },
  onEvent: <
    Event extends MainProcessEventType,
    Payload extends MainProcessEventsPayloads
  >(
    callback: (payload: { type: Event; payload: Payload }) => void
  ) =>
    ipcRenderer.on("onEvent", (_event, payload) => {
      callback(payload);
    }),
});
