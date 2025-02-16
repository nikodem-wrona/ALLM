import { RepositoryDependencies } from "./types";

export class MessagesRepository {
  constructor(private readonly dependencies: RepositoryDependencies) {}

  public async deleteMessageById(id: string): Promise<void> {
    const DELETE_MESSAGE_METADATA_QUERY = `
      DELETE FROM message_metadata WHERE message_id = ?;
    `;

    const DELETE_MESSAGE_QUERY = `
      DELETE FROM messages WHERE id = ?;
    `;

    await this.dependencies.database.executeQuery(
      DELETE_MESSAGE_METADATA_QUERY,
      [id]
    );
    await this.dependencies.database.executeQuery(DELETE_MESSAGE_QUERY, [id]);
  }
}
