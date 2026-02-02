# Local RAG System with Mistral 7B

A complete **Retrieval Augmented Generation (RAG)** application running entirely on your local machine using:
- **Mistral 7B LLM** via Ollama (offline, private)
- **Local Vector Embeddings** with Sentence Transformers
- **Simple Vector Database** stored as JSON

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- Ollama (installed and running)
- Mistral 7B model (4GB)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Ollama in a separate terminal:**
   ```bash
   # Terminal 1
   ollama serve
   
   # If you haven't downloaded Mistral yet:
   ollama pull mistral
   ```

3. **Run the RAG system:**
   ```bash
   # Terminal 2
   node index.js
   ```

## 📁 Project Structure

```
├── config.js              # Configuration settings
├── llm.js                 # Ollama client for Mistral
├── vectorStore.js         # Vector database implementation
├── embeddings_server.py   # Python embedding generator
├── rag.js                 # RAG system orchestrator
├── index.js               # Example usage and queries
├── vector_store/          # Local vector database storage
└── .env.example           # Environment variables template
```

## 🎯 How It Works

### 1. **Document Ingestion**
   - Documents are split into chunks
   - Each chunk is converted to an embedding using `all-MiniLM-L6-v2`
   - Embeddings and documents are stored locally

### 2. **Query Processing**
   - User question is embedded
   - Vector similarity search finds relevant documents (top-3)
   - Retrieved documents provide context

### 3. **Answer Generation**
   - Context + Question sent to Mistral 7B
   - LLM generates answer based on retrieved context
   - Answer sources are returned

## 💻 Usage Examples

### Basic Query
```javascript
import RAGSystem from "./rag.js";

const rag = new RAGSystem();
await rag.initialize();

// Add documents
await rag.addDocuments([
  { content: "Your document text", source: "doc1.txt" }
]);

// Query
const result = await rag.query("What is...?");
console.log(result.answer);
```

### Add Custom Documents
```javascript
const documents = [
  {
    content: "Machine Learning is a subset of AI...",
    source: "ml_guide.txt",
    title: "Machine Learning Basics"
  },
  // More documents...
];

await rag.addDocuments(documents);
```

## 📊 Performance Notes

- **Mistral 7B**: ~4.4 GB on disk, ~8-16 GB RAM during inference
- **Embeddings**: ~2 seconds per chunk (CPU)
- **LLM Response**: 5-30 seconds depending on answer length (CPU)
- **Vector Search**: <100ms for up to 1000 documents

## 🔧 Configuration

Edit `.env` file:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
OLLAMA_TEMPERATURE=0.7      # 0=deterministic, 1=creative
RAG_TOP_K=3                 # Number of documents to retrieve
MAX_CHUNK_SIZE=500          # Characters per chunk
```

## 🛠️ Troubleshooting

### Ollama not running?
```bash
# Check if service is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve
```

### Python embedding server error?
```bash
# Install sentence-transformers
pip install sentence-transformers torch
```

### Out of memory?
- Reduce `OLLAMA_TEMPERATURE` for faster generation
- Use smaller chunks (`MAX_CHUNK_SIZE=300`)
- Limit `RAG_TOP_K` to 2 instead of 3

## 📚 Next Steps

1. **Add your own documents** to `index.js`
2. **Create an API** with Express
3. **Build a UI** with React/Vue
4. **Use better embeddings** (BGE, Cohere, etc.)
5. **Scale with Pinecone or Weaviate** for production

## 🎓 Learning Resources

- [RAG Explained](https://arxiv.org/abs/2005.11401)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Sentence Transformers](https://www.sbert.net/)
- [Vector Similarity Search](https://en.wikipedia.org/wiki/Cosine_similarity)

## ⚠️ Important Notes

- All data is **locally stored** - no cloud uploads
- First run downloads embeddings (~600MB)
- Vector store saved in `vector_store/store.json`
- Clear data: `rag.clear()`

---

Happy RAG building! 🚀
