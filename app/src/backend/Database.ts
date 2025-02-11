import { Database as SQLiteClient } from "sqlite3";
import { DEFAULT_CHAT_ID } from "./_shared/consts";

export class Database {
  private db: SQLiteClient | null = null;
  private databaseFile: string;

  constructor() {
    const currentUser = process.env.USER;
    this.databaseFile = `/Users/${currentUser}/.config/allm/allm.db`;
  }

  async initSchema(): Promise<void> {
    const CREATE_CHATS_QUERY = `
      CREATE TABLE IF NOT EXISTS chats (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        provider TEXT NOT NULL
      );
    `;

    const CREATE_MESSAGES_QUERY = `
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY NOT NULL,
        chat_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chats (id)
      );  
    `;

    const CREATE_MESSAGE_METADATA_QUERY = `
      CREATE TABLE IF NOT EXISTS message_metadata (
        id TEXT PRIMARY KEY NOT NULL,
        message_id TEXT NOT NULL,
        total_token_cost NUMBER NOT NULL,
        FOREIGN KEY (message_id) REFERENCES messages (id)
      );
    `;

    await this.executeQuery(CREATE_CHATS_QUERY);
    await this.executeQuery(CREATE_MESSAGES_QUERY);
    await this.executeQuery(CREATE_MESSAGE_METADATA_QUERY);

    const existingDefaultChat = await this.executeQuery(
      "SELECT * FROM chats WHERE id = ?",
      [DEFAULT_CHAT_ID]
    );

    if (existingDefaultChat.length > 0) {
      return;
    }

    const INSERT_CHAT_QUERY = `
      INSERT INTO chats (id, name, created_at, provider) VALUES (?, ?, ?, ?);
    `;

    await this.executeQuery(INSERT_CHAT_QUERY, [
      DEFAULT_CHAT_ID,
      "Open AI Default Chat",
      new Date().toISOString(),
      "openai",
    ]);
  }

  async connect(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sqlite3Verbose = require("sqlite3").verbose();

    this.db = new sqlite3Verbose.Database(this.databaseFile, (err: Error) => {
      if (err) {
        console.error("Error connecting to the database:", err.message);
      }
    });
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(new Error("Database not connected"));
      }
      this.db.all(query, params, (err: Error, rows: any) => {
        if (err) {
          console.error("Error executing query:", err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  closeConnection(): void {
    if (this.db) {
      this.db.close((err: Error) => {
        if (err) {
          console.error("Error closing the database connection:", err.message);
        } else {
          console.log("Database connection closed.");
        }
      });
    }
  }
}
