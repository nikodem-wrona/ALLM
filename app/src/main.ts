import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

import { Server } from "./backend/Server";
import { MainProcessEventsPayloads, MainProcessEventType } from "./_shared";

const server = new Server();

server.start().then(() => {
  if (started) {
    app.quit();
  }

  const createWindow = () => {
    const mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
      );
    }

    mainWindow.webContents.openDevTools();

    const electronIPCMessageSender = (event: {
      type: MainProcessEventType;
      payload: MainProcessEventsPayloads;
    }) => {
      mainWindow.webContents.send("onEvent", event);
    };

    server.listenToInternalEvents(electronIPCMessageSender);

    ipcMain.on("sendEvent", (_, event) => {
      server.handleEvent(event);
    });
  };

  app.on("ready", () => createWindow());

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
