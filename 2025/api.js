/**
 * Express API Server for RAG System
 * Optional: Run this to expose RAG as an HTTP API
 * 
 * Usage: node api.js
 * Then access: http://localhost:3000/query?q=Tell%20me%20about%20Trichy
 */

import express from "express";
import RAGSystem from "./rag.js";
import config from "./config.js";

const app = express();
const rag = new RAGSystem();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    model: rag.llm.model,
    documents: rag.vectorStore.count(),
  });
});

// Query endpoint
app.post("/api/query", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    console.log(`API Query: ${question}`);
    const result = await rag.query(question);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Query error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Add documents endpoint
app.post("/api/documents", async (req, res) => {
  try {
    const { documents } = req.body;

    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ error: "documents array is required" });
    }

    const ids = await rag.addDocuments(documents);

    res.json({
      success: true,
      message: `Added ${ids.length} documents`,
      ids,
    });
  } catch (error) {
    console.error("Add documents error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get statistics
app.get("/api/stats", (req, res) => {
  const stats = rag.getStats();
  res.json({
    success: true,
    data: stats,
  });
});

// Clear all documents
app.post("/api/clear", (req, res) => {
  rag.clear();
  res.json({
    success: true,
    message: "Knowledge base cleared",
  });
});

// Start server
async function startServer() {
  try {
    // Initialize RAG system
    console.log("Initializing RAG system...");
    await rag.initialize();

    // Start Express server
    const port = config.app.port;
    app.listen(port, () => {
      console.log(`\n🚀 RAG API Server running on http://localhost:${port}`);
      console.log("\n📚 Available endpoints:");
      console.log(`  GET  /health              - Server status`);
      console.log(`  POST /api/query           - Ask a question`);
      console.log(`  POST /api/documents       - Add documents`);
      console.log(`  GET  /api/stats           - Get statistics`);
      console.log(`  POST /api/clear           - Clear knowledge base`);
      console.log("\n💡 Example query:");
      console.log(`  curl -X POST http://localhost:${port}/api/query \\`);
      console.log(`       -H "Content-Type: application/json" \\`);
      console.log(`       -d '{"question":"Tell me about Trichy"}'`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
