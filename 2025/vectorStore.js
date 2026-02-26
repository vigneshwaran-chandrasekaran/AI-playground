import fs from "fs";
import path from "path";
import { spawn } from "child_process";

/**
 * Simple in-memory vector database
 * Stores documents and their embeddings
 */
export class VectorStore {
  constructor(persistPath = "./vector_store") {
    this.persistPath = persistPath;
    this.documents = [];
    this.embeddings = [];
    this.metadata = [];

    // Ensure directory exists
    if (!fs.existsSync(this.persistPath)) {
      fs.mkdirSync(this.persistPath, { recursive: true });
    }

    this.loadFromDisk();
  }

  /**
   * Save document with embedding
   */
  async addDocument(text, metadata = {}) {
    const embedding = await this.generateEmbedding(text);

    this.documents.push(text);
    this.embeddings.push(embedding);
    this.metadata.push({
      id: this.documents.length - 1,
      ...metadata,
      timestamp: new Date().toISOString(),
    });

    this.saveToDisk();
    return this.documents.length - 1;
  }

  /**
   * Add multiple documents
   */
  async addDocuments(texts, metadataArray = []) {
    const ids = [];
    for (let i = 0; i < texts.length; i++) {
      const id = await this.addDocument(
        texts[i],
        metadataArray[i] || { source: `document_${i}` }
      );
      ids.push(id);
    }
    return ids;
  }

  /**
   * Search similar documents
   */
  async search(queryText, topK = 3) {
    const queryEmbedding = await this.generateEmbedding(queryText);
    const similarities = this.calculateSimilarities(
      queryEmbedding,
      this.embeddings
    );

    // Get top K results
    const results = similarities
      .map((score, idx) => ({
        score,
        id: idx,
        text: this.documents[idx],
        metadata: this.metadata[idx],
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return results;
  }

  /**
   * Generate embedding using Python subprocess
   */
  async generateEmbedding(text) {
    return new Promise((resolve, reject) => {
      const python = spawn("python3", ["./embeddings_server.py"]);
      let output = "";
      let error = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
      });

      python.stderr.on("data", (data) => {
        error += data.toString();
      });

      python.on("close", (code) => {
        if (code !== 0) {
          console.error("Python error:", error);
          reject(new Error(`Embedding failed: ${error}`));
          return;
        }

        try {
          const result = JSON.parse(output);
          resolve(result.embedding);
        } catch (e) {
          reject(e);
        }
      });

      python.stdin.write(text);
      python.stdin.end();
    });
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce(
      (sum, a, i) => sum + a * vecB[i],
      0
    );
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * Calculate similarities with all stored embeddings
   */
  calculateSimilarities(queryEmbedding, embeddings) {
    return embeddings.map((emb) =>
      this.cosineSimilarity(queryEmbedding, emb)
    );
  }

  /**
   * Save to disk
   */
  saveToDisk() {
    const data = {
      documents: this.documents,
      embeddings: this.embeddings,
      metadata: this.metadata,
    };

    fs.writeFileSync(
      path.join(this.persistPath, "store.json"),
      JSON.stringify(data, null, 2)
    );
  }

  /**
   * Load from disk
   */
  loadFromDisk() {
    const filePath = path.join(this.persistPath, "store.json");
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      this.documents = data.documents || [];
      this.embeddings = data.embeddings || [];
      this.metadata = data.metadata || [];
    }
  }

  /**
   * Clear all data
   */
  clear() {
    this.documents = [];
    this.embeddings = [];
    this.metadata = [];
    this.saveToDisk();
  }

  /**
   * Get document count
   */
  count() {
    return this.documents.length;
  }
}

export default VectorStore;
