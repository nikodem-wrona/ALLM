import { MessagesRepository } from "./Messages.repository";
import { RepositoryDependencies } from "./types";

export enum RepositoriesKeys {
  MESSAGES_REPOSITORY = "messagesRepository",
}

export type RepositoriesMap = Record<RepositoriesKeys, MessagesRepository>;

export const createRepositoriesMap = (
  deps: RepositoryDependencies
): RepositoriesMap => {
  return {
    [RepositoriesKeys.MESSAGES_REPOSITORY]: new MessagesRepository(deps),
  };
};
