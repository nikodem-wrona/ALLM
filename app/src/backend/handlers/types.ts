import { Database } from "../Database";
import { OpenAiClient } from "../llm";
import { RepositoriesMap } from "../repositories";

export type HandlerDependencies = {
  database: Database;
  repositories: RepositoriesMap;
  openAiClient: OpenAiClient;
};
