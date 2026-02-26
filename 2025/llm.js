import axios from "axios";
import config from "./config.js";

/**
 * Local LLM client for Ollama Mistral
 */
export class LocalLLM {
  constructor() {
    this.baseURL = config.ollama.baseURL;
    this.model = config.ollama.model;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 300000, // 5 min timeout for long responses
    });
  }

  /**
   * Check if Ollama is running
   */
  async isAvailable() {
    try {
      const response = await this.client.get("/api/tags");
      return response.status === 200;
    } catch (error) {
      console.error("Ollama is not available:", error.message);
      return false;
    }
  }

  /**
   * Generate text with streaming
   */
  async generateStream(prompt, onChunk) {
    try {
      const response = await this.client.post(
        "/api/generate",
        {
          model: this.model,
          prompt: prompt,
          stream: true,
          temperature: config.ollama.temperature,
          top_k: config.ollama.topK,
          top_p: config.ollama.topP,
        },
        {
          responseType: "stream",
        }
      );

      return new Promise((resolve, reject) => {
        let fullResponse = "";

        response.data.on("data", (chunk) => {
          const lines = chunk.toString().split("\n");

          lines.forEach((line) => {
            if (line.trim()) {
              try {
                const json = JSON.parse(line);
                if (json.response) {
                  fullResponse += json.response;
                  if (onChunk) onChunk(json.response);
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          });
        });

        response.data.on("end", () => {
          resolve(fullResponse);
        });

        response.data.on("error", reject);
      });
    } catch (error) {
      throw new Error(`LLM generation failed: ${error.message}`);
    }
  }

  /**
   * Generate text without streaming (simple mode)
   */
  async generate(prompt) {
    let result = "";
    await this.generateStream(prompt, (chunk) => {
      result += chunk;
    });
    return result;
  }

  /**
   * RAG-style generation with context
   */
  async generateWithContext(question, context) {
    const prompt = this.buildRAGPrompt(question, context);
    return await this.generate(prompt);
  }

  /**
   * Build RAG prompt with context
   */
  buildRAGPrompt(question, context) {
    const contextStr = context
      .map((item, i) => `[Document ${i + 1}]\n${item.text}`)
      .join("\n\n");

    return `You are a helpful assistant. Use the following documents to answer the question.

CONTEXT:
${contextStr}

QUESTION: ${question}

ANSWER:`;
  }

  /**
   * Get available models
   */
  async listModels() {
    try {
      const response = await this.client.get("/api/tags");
      return response.data.models || [];
    } catch (error) {
      throw new Error(`Failed to list models: ${error.message}`);
    }
  }
}

export default LocalLLM;
