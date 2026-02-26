import RAGSystem from "./rag.js";

/**
 * Example usage of the Local RAG System
 */
async function main() {
  try {
    // Initialize RAG system
    const rag = new RAGSystem();
    await rag.initialize();

    // Sample documents to add to knowledge base
    const sampleDocuments = [
      {
        content:
          "Trichy (also known as Tiruchirappalli) is a city in Tamil Nadu, India. It is located on the banks of the Kaveri River. Trichy is known for the Rockfort Temple, which is built on a rock outcrop. The city is also home to the Sri Ranganathaswamy Temple, one of the largest temples in India.",
        source: "trichy_info.txt",
        title: "About Trichy",
      },
      {
        content:
          "The Rockfort Temple in Trichy is a 3,600-foot-high rock structure with a temple at the top. To reach the temple, visitors must climb approximately 344 steps. The temple is dedicated to Lord Shiva and offers panoramic views of the city. It is one of the most popular tourist attractions in Trichy.",
        source: "rockfort.txt",
        title: "Rockfort Temple",
      },
      {
        content:
          "Sri Ranganathaswamy Temple is located on the island of Srirangam in Trichy. It is dedicated to Lord Ranganatha (a form of Vishnu). The temple complex covers an area of about 156 acres and has seven concentric walls. It is one of the oldest and largest temples in India, with construction dating back to the 10th century.",
        source: "srirangam_temple.txt",
        title: "Sri Ranganathaswamy Temple",
      },
      {
        content:
          "Machine Learning is a subset of Artificial Intelligence that enables computers to learn from data without being explicitly programmed. ML algorithms identify patterns in data and make predictions or decisions based on those patterns. Common types of ML include supervised learning, unsupervised learning, and reinforcement learning.",
        source: "ml_basics.txt",
        title: "What is Machine Learning",
      },
      {
        content:
          "Natural Language Processing (NLP) is a branch of AI that focuses on enabling computers to understand, interpret, and generate human language. NLP is used in applications like machine translation, sentiment analysis, and chatbots. Common NLP techniques include tokenization, stemming, and word embeddings.",
        source: "nlp_basics.txt",
        title: "Natural Language Processing",
      },
    ];

    // Add documents to knowledge base
    console.log("\n📚 Loading documents into knowledge base...\n");
    await rag.addDocuments(sampleDocuments);

    // Example queries
    const queries = [
      "Tell me about Trichy",
      "What is the Rockfort Temple?",
      "How many temples are there in Trichy?",
      "What is Machine Learning?",
      "Explain Natural Language Processing",
    ];

    // Run queries
    console.log("\n" + "=".repeat(60));
    console.log("STARTING RAG QUERIES");
    console.log("=".repeat(60));

    for (const query of queries) {
      const result = await rag.query(query);

      console.log("\n" + "-".repeat(60));
      console.log(`\n💡 ANSWER:\n${result.answer}`);
      console.log("\n📌 Sources:");
      result.sources.forEach((source, i) => {
        console.log(
          `   ${i + 1}. [${(source.score * 100).toFixed(1)}% match]`
        );
        console.log(`      ${source.text.substring(0, 80)}...`);
      });

      // Add delay between queries for readability
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Print statistics
    const stats = rag.getStats();
    console.log("\n" + "=".repeat(60));
    console.log("📊 SYSTEM STATISTICS");
    console.log("=".repeat(60));
    console.log(`Documents in Knowledge Base: ${stats.documentCount}`);
    console.log(`LLM Model: ${stats.model}`);
    console.log(`Vector Store Location: ${stats.vectorStoreLocation}`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nMake sure Ollama is running:");
    console.error("  1. Open a terminal");
    console.error("  2. Run: ollama serve");
    console.error("  3. In another terminal, run: node index.js");
    process.exit(1);
  }
}

main();
