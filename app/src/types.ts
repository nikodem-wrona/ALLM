import "electron";

declare global {
  type EventType = "SEND_MESSAGE" | "FETCH_MESSAGES";
  interface Window {
    electron: {
      sendEvent: (event: {
        type: EventType;
        payload: Record<string, unknown>;
      }) => void;
      onEvent: (
        callback: (event: { type: string; payload: any }) => void
      ) => void;
    };
  }
}
