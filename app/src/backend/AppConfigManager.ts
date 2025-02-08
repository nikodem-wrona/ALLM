import { readFileSync } from "fs";

export type AppConfig = {
  windowSize: {
    width: number;
    height: number;
  };
  providers: {
    openai: {
      apiKey: string;
    };
  };
};

export class AppConfigManager {
  private configFilePath: string;
  private appConfig: AppConfig;

  public loadConfig() {
    const currentUser = process.env.USER;
    this.configFilePath = `/Users/${currentUser}/.config/allm/config.json`;

    try {
      const config = JSON.parse(readFileSync(this.configFilePath, "utf8"));
      this.appConfig = config;
    } catch (err) {
      throw new Error("Error loading config file");
    }
  }

  get config() {
    return this.appConfig;
  }
}
