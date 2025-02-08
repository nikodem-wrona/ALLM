import { BehaviorSubject } from "rxjs";
import { Message } from "../_shared/types";
import { IPCEventHandler } from "./IPCEventHandler";

export type AppState = {
  messages: Message[];
};

const initialState: AppState = {
  messages: [],
};

class Store {
  private state$ = new BehaviorSubject<AppState>(initialState);

  constructor() {
    new IPCEventHandler();
  }

  addMessage(message: Message) {
    const currentState = this.state$.getValue();
    const updatedState = {
      ...currentState,
      messages: [...currentState.messages, message],
    };

    this.state$.next(updatedState);
  }

  setMessages(messages: Message[]) {
    const currentState = this.state$.getValue();
    const updatedState = {
      ...currentState,
      messages,
    };

    this.state$.next(updatedState);
  }

  subscribeForMessages(callback: (messages: Message[]) => void) {
    this.state$.subscribe((state) => {
      callback(state.messages);
    });
  }
}

export const appStore = new Store();
