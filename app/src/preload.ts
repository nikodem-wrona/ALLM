// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  sendEvent: (event: { type: any; payload: Record<string, unknown> }) => {
    ipcRenderer.send("sendEvent", event);
  },
  onEvent: (callback: (payload: any) => void) =>
    ipcRenderer.on("onEvent", (_event, payload) => {
      callback(payload);
    }),
});
