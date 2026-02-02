import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  // Ollama local LLM settings
  ollama: {
    baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    model: process.env.OLLAMA_MODEL || "mistral",
    temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || "0.7"),
    topK: parseInt(process.env.OLLAMA_TOP_K || "40"),
    topP: parseFloat(process.env.OLLAMA_TOP_P || "0.9"),
  },

  // Vector database settings
  vectorDb: {
    type: "chromadb", // local vector database
    persistDirectory: "./vector_store",
  },

  // Embedding model settings
  embeddings: {
    modelName: "Xenova/all-MiniLM-L6-v2", // HuggingFace model for embeddings
    pythonScript: "./embeddings_server.py", // Python script for embeddings
  },

  // Application settings
  app: {
    port: process.env.PORT || 3000,
    maxChunkSize: parseInt(process.env.MAX_CHUNK_SIZE || "500"),
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || "100"),
  },

  // RAG settings
  rag: {
    topK: parseInt(process.env.RAG_TOP_K || "3"), // retrieve top 3 documents
    minSimilarity: parseFloat(process.env.MIN_SIMILARITY || "0.5"),
  },
};

export default config;
