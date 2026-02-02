import VectorStore from "./vectorStore.js";
import LocalLLM from "./llm.js";
import config from "./config.js";

/**
 * RAG (Retrieval Augmented Generation) System
 */
export class RAGSystem {
  constructor() {
    this.vectorStore = new VectorStore(config.vectorDb.persistDirectory);
    this.llm = new LocalLLM();
  }

  /**
   * Initialize RAG system - check if Ollama is running
   */
  async initialize() {
    const isAvailable = await this.llm.isAvailable();
    if (!isAvailable) {
      throw new Error(
        "Ollama is not running. Please start Ollama: ollama serve"
      );
    }

    const models = await this.llm.listModels();
    const hasMistral = models.some((m) => m.name.includes("mistral"));

    if (!hasMistral) {
      throw new Error(
        "Mistral model not found. Please pull it: ollama pull mistral"
      );
    }

    console.log("✓ RAG System initialized successfully");
    console.log(`✓ Vector Store: ${this.vectorStore.count()} documents`);
    console.log(`✓ LLM Model: ${this.llm.model}`);
  }

  /**
   * Add documents to the knowledge base
   */
  async addDocuments(documents) {
    console.log(`Adding ${documents.length} documents to knowledge base...`);

    const metadataArray = documents.map((doc, i) => ({
      source: doc.source || `document_${i}`,
      title: doc.title || "",
    }));

    const ids = await this.vectorStore.addDocuments(
      documents.map((d) => d.content),
      metadataArray
    );

    console.log(`✓ Added ${ids.length} documents`);
    return ids;
  }

  /**
   * Query the RAG system
   */
  async query(question) {
    console.log(`\n📝 Question: ${question}`);

    // Retrieve relevant documents
    const retrievedDocs = await this.vectorStore.search(
      question,
      config.rag.topK
    );

    console.log(`\n🔍 Retrieved ${retrievedDocs.length} relevant documents:`);
    retrievedDocs.forEach((doc, i) => {
      console.log(`  ${i + 1}. (Score: ${(doc.score * 100).toFixed(1)}%)`);
      console.log(`     ${doc.text.substring(0, 100)}...`);
    });

    // Generate answer using LLM with retrieved context
    console.log("\n⏳ Generating answer...\n");
    const answer = await this.llm.generateWithContext(question, retrievedDocs);

    return {
      question,
      answer: answer.trim(),
      sources: retrievedDocs.map((doc) => ({
        text: doc.text,
        score: doc.score,
        metadata: doc.metadata,
      })),
    };
  }

  /**
   * Chunk a long document
   */
  chunkDocument(text, chunkSize = config.app.maxChunkSize, overlap = config.app.chunkOverlap) {
    const chunks = [];
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= chunkSize) {
        currentChunk += sentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Clear all documents
   */
  clear() {
    this.vectorStore.clear();
    console.log("✓ Knowledge base cleared");
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      documentCount: this.vectorStore.count(),
      model: this.llm.model,
      vectorStoreLocation: config.vectorDb.persistDirectory,
    };
  }
}

export default RAGSystem;
