#!/bin/bash
# Setup and run Local RAG System

echo "🚀 Setting up Local RAG System with Mistral 7B"
echo "================================================"

# Check Ollama
echo "📋 Checking Ollama..."
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not installed. Installing..."
    curl -fsSL https://ollama.ai/install.sh | sh
fi

# Check if Ollama service is running
echo "🔍 Checking if Ollama service is running..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama is NOT running!"
    echo "   Please start Ollama in another terminal:"
    echo "   $ ollama serve"
    echo ""
    echo "   Then run this script again."
    exit 1
fi

# Check if Mistral model exists
echo "🤖 Checking for Mistral model..."
if ollama list | grep -q mistral; then
    echo "✅ Mistral model found"
else
    echo "📥 Downloading Mistral model (4.4 GB)..."
    ollama pull mistral
fi

# Install Node dependencies
echo "📦 Installing Node.js dependencies..."
npm install --silent

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip install -q sentence-transformers torch

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 To run the RAG system:"
echo "   node index.js"
echo ""
echo "💡 Make sure Ollama is running in another terminal:"
echo "   ollama serve"
