import { RendererProcessEventsPayloads } from "../../_shared";

export interface IHandler {
  handle(payload: RendererProcessEventsPayloads): Promise<void>;
}
