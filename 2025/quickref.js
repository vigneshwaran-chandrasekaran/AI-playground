#!/usr/bin/env node

/**
 * QUICK REFERENCE - RAG System Commands
 * 
 * Copy this file to your home directory or keep it handy
 * Usage: node quickref.js
 */

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                   RAG SYSTEM - QUICK REFERENCE                  ║
╚══════════════════════════════════════════════════════════════════╝

📋 DIRECTORY
  /home/vigneshwaran/Natchathra/github/AI-playground

🚀 START THE SYSTEM (2 terminals)
  
  Terminal 1 - Start Ollama:
  $ ollama serve
  
  Terminal 2 - Run RAG:
  $ cd /home/vigneshwaran/Natchathra/github/AI-playground
  $ node index.js

🔧 AVAILABLE COMMANDS
  
  node index.js              Run example with 5 queries
  node api.js                Start Express API server
  npm start                  Run main entry point
  npm install                Install dependencies

📝 MODIFY SETTINGS
  
  .env file:
    OLLAMA_TEMPERATURE=0.7   (0=precise, 1=creative)
    RAG_TOP_K=3              (documents to retrieve)
    MAX_CHUNK_SIZE=500       (chunk size)
  
  Edit these and restart to apply changes

📚 ADD YOUR OWN DOCUMENTS
  
  1. Open index.js
  2. Find sampleDocuments array
  3. Add your documents:
     {
       content: "Your text...",
       source: "filename.txt",
       title: "Document Title"
     }
  4. Save and run: node index.js

🤖 CHANGE THE MODEL
  
  Currently using: Mistral 7B (4.4 GB)
  
  Other options:
  $ ollama pull llama2        (7B, faster)
  $ ollama pull neural-chat   (7B, optimized for chat)
  $ ollama pull mistral:7b-q4_0  (Quantized, smaller)
  
  Then edit config.js:
  model: "llama2" or "neural-chat"

📊 API ENDPOINTS (if using api.js)
  
  GET  http://localhost:3000/health
       Returns server status
  
  POST http://localhost:3000/api/query
       Body: {"question": "Your question?"}
       Returns: {answer, sources}
  
  POST http://localhost:3000/api/documents
       Body: {"documents": [{content, source, title}, ...]}
       Returns: {ids, message}
  
  GET  http://localhost:3000/api/stats
       Returns document count, model, location
  
  POST http://localhost:3000/api/clear
       Clears all documents

⚡ PERFORMANCE TIPS
  
  Faster responses:
    - Reduce RAG_TOP_K from 3 to 2
    - Reduce MAX_CHUNK_SIZE to 300
    - Use smaller model (llama2, neural-chat)
    - Close other applications
  
  Better answers:
    - Increase RAG_TOP_K to 4-5
    - Add more relevant documents
    - Lower temperature (0.3-0.5)
    - Use larger model (mistral, llama2-70b)

🐛 TROUBLESHOOTING
  
  Problem: Ollama not running
  Fix:     $ ollama serve
  
  Problem: Out of memory
  Fix:     Reduce RAG_TOP_K, close apps, restart
  
  Problem: Python error with embeddings
  Fix:     pip install sentence-transformers torch
  
  Problem: Model not found
  Fix:     $ ollama pull mistral
  
  Problem: Port 11434 already in use
  Fix:     Kill other Ollama: killall ollama
           Or change OLLAMA_BASE_URL

📚 FILE DESCRIPTIONS
  
  index.js           - Main example with sample queries
  api.js             - Express API server (optional)
  rag.js             - Core RAG implementation
  llm.js             - Mistral 7B interface
  vectorStore.js     - Vector database
  embeddings_server.py - Python embedding service
  config.js          - Configuration settings
  
  .env               - Runtime environment variables
  vector_store/      - Persistent data storage

💡 EXAMPLE USAGE IN CODE
  
  import RAGSystem from "./rag.js";
  
  const rag = new RAGSystem();
  await rag.initialize();
  
  // Add documents
  await rag.addDocuments([
    { content: "Your text", source: "file.txt" }
  ]);
  
  // Query
  const result = await rag.query("Your question?");
  console.log(result.answer);
  console.log(result.sources);

📖 DOCUMENTATION FILES
  
  README.md             - Full documentation
  GETTING_STARTED.md    - Step-by-step guide
  SETUP_SUMMARY.sh      - What was installed
  quickref.js           - This file

🔗 USEFUL LINKS
  
  Ollama:     https://github.com/ollama/ollama
  Mistral:    https://mistral.ai/
  RAG Paper:  https://arxiv.org/abs/2005.11401
  Embeddings: https://www.sbert.net/

⚙️ SYSTEM INFO
  
  OS:          Linux
  Ollama:      v0.15.4
  Model:       Mistral 7B (4.4 GB)
  Embeddings:  all-MiniLM-L6-v2 (384-dim)
  Database:    JSON file-based
  CPU:         Available
  GPU:         Not configured
  RAM:         15 GB available

✨ COOL THINGS YOU CAN DO
  
  1. Build a chatbot over your documents
  2. Create a Q&A system for customer support
  3. Analyze documents and extract insights
  4. Summarize large document collections
  5. Search semantically (not keyword-based)
  6. Multi-turn conversations with context
  7. Fine-tune answers with custom prompts

🎯 NEXT PROJECTS
  
  1. Build REST API (api.js included!)
  2. Create React frontend
  3. Add document upload
  4. Implement file parsing (PDF, Word)
  5. Add user authentication
  6. Deploy with Docker (Dockerfile included)
  7. Add web search integration

💾 BACKUP YOUR DATA
  
  Your vector store:
    vector_store/store.json
  
  Backup command:
    cp -r vector_store/ vector_store.backup/
  
  Restore command:
    rm -rf vector_store/ && cp -r vector_store.backup/ vector_store/

🔐 SECURITY NOTES
  
  ✅ All processing happens locally
  ✅ No data leaves your computer
  ✅ No API keys required
  ✅ No internet needed (after setup)
  ✅ No tracking or analytics
  ✅ Open source - audit the code

🎉 YOU'RE ALL SET!
  
  Your RAG system is ready. Start with:
    $ ollama serve
    $ node index.js
  
  Then explore, customize, and build!

═══════════════════════════════════════════════════════════════════
For detailed help: cat README.md or cat GETTING_STARTED.md
═══════════════════════════════════════════════════════════════════
`);
