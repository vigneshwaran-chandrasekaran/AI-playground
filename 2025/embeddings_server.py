#!/usr/bin/env python3
"""
Embedding server for generating embeddings using HuggingFace models.
This runs locally and communicates with Node.js via stdio or files.
"""

import sys
import json
from sentence_transformers import SentenceTransformer

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

def embed_text(text):
    """Generate embedding for a single text."""
    embedding = model.encode(text, convert_to_tensor=False)
    return embedding.tolist()

def embed_batch(texts):
    """Generate embeddings for a batch of texts."""
    embeddings = model.encode(texts, convert_to_tensor=False)
    return [emb.tolist() for emb in embeddings]

if __name__ == "__main__":
    # Read input from stdin
    if len(sys.argv) > 1 and sys.argv[1] == "--batch":
        # Batch mode: read JSON array of texts
        data = json.loads(sys.stdin.read())
        texts = data.get("texts", [])
        embeddings = embed_batch(texts)
        print(json.dumps({"embeddings": embeddings}))
    else:
        # Single text mode: read from stdin
        text = sys.stdin.read().strip()
        embedding = embed_text(text)
        print(json.dumps({"embedding": embedding}))
