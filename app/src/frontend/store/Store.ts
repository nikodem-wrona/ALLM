import { BehaviorSubject } from "rxjs";
import { Message, Chat } from "../_shared/types";
import { IPCEventHandler } from "./IPCEventHandler";

export type AppState = {
  chat: Chat | null;
  messages: Message[];
};

const initialState: AppState = {
  messages: [],
  chat: null,
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

  setChat(chat: AppState["chat"]) {
    const currentState = this.state$.getValue();
    const updatedState = {
      ...currentState,
      chat,
    };

    this.state$.next(updatedState);
  }

  subscribeForMessages(callback: (messages: Message[]) => void) {
    this.state$.subscribe((state) => {
      callback(state.messages);
    });
  }

  subscribeForChat(callback: (chat: AppState["chat"]) => void) {
    this.state$.subscribe((state) => {
      callback(state.chat);
    });
  }
}

export const appStore = new Store();
