import { Database } from "../Database";
import { OpenAiClient } from "../llm";

export type HandlerDependencies = {
  database: Database;
  openAiClient: OpenAiClient;
};
