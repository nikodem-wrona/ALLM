import OpenAI from "openai";

export class OpenAiClient {
  private client: OpenAI;

  constructor(config: { apiKey: string }) {
    const apiKey = config.apiKey;
    this.client = new OpenAI({
      apiKey,
    });
  }

  public async createCompletion(payload: {
    model: "gpt-4o" | "gpt-4o-mini";
    messages: Array<{
      role: "developer" | "user" | "assistant";
      content: string;
    }>;
  }): Promise<{
    message: { role: "developer" | "user" | "assistant"; content: string };
    totalTokenCost: number;
  }> {
    const { model, messages } = payload;

    const response = await this.client.chat.completions.create({
      model,
      messages,
      store: true, // TODO: Check if this is needed
    });

    return {
      message: {
        role: response.choices[0].message.role,
        content: response.choices[0].message.content,
      },
      totalTokenCost: response.usage.total_tokens,
    };
  }
}
