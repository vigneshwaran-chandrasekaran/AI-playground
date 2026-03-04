import { Ollama } from 'ollama';

/**
 * Simple Node.js + Ollama Integration
 * Using the official Ollama package with Mistral 7B
 */

const ollama = new Ollama({
  host: 'http://127.0.0.1:11434'
});

const MODEL = 'mistral'; // Your local model

/**
 * 1. Simple Text Generation
 */
async function generateText(prompt) {
  console.log('\n📝 Text Generation:');
  console.log(`📌 Prompt: ${prompt}\n`);

  try {
    const response = await ollama.generate({
      model: MODEL,
      prompt: prompt,
      stream: false,
      temperature: 0.7
    });

    console.log('✅ Response:');
    console.log(response.response);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 2. Chat Conversation
 */
async function chatWithModel(messages) {
  console.log('\n💬 Chat Completion:');
  messages.forEach(msg => {
    console.log(`${msg.role.toUpperCase()}: ${msg.content}`);
  });

  try {
    const response = await ollama.chat({
      model: MODEL,
      messages: messages,
      stream: false,
      temperature: 0.7
    });

    console.log('\n✅ Assistant Response:');
    console.log(response.message.content);
    return response.message.content;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 3. Question Answering
 */
async function answerQuestion(question, context) {
  console.log('\n❓ Question Answering:');
  console.log(`Question: ${question}\n`);

  const prompt = `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`;

  try {
    const response = await ollama.generate({
      model: MODEL,
      prompt: prompt,
      stream: false,
      temperature: 0.3 // Lower temperature for accurate answers
    });

    console.log('✅ Answer:');
    console.log(response.response);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 4. Streaming Response (Real-time)
 */
async function generateTextStreaming(prompt) {
  console.log('\n🔄 Streaming Text Generation:');
  console.log(`📌 Prompt: ${prompt}\n`);
  console.log('Response (streaming):\n');

  try {
    const response = await ollama.generate({
      model: MODEL,
      prompt: prompt,
      stream: true,
      temperature: 0.7
    });

    // Stream the response
    for await (const chunk of response) {
      process.stdout.write(chunk.response);
    }
    console.log('\n\n✅ Streaming complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 5. Code Generation
 */
async function generateCode(description) {
  console.log('\n💻 Code Generation:');
  console.log(`Description: ${description}\n`);

  const prompt = `Generate JavaScript code for: ${description}. Return only the code.`;

  try {
    const response = await ollama.generate({
      model: MODEL,
      prompt: prompt,
      stream: false,
      temperature: 0.5
    });

    console.log('✅ Generated Code:');
    console.log('```javascript');
    console.log(response.response);
    console.log('```');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 6. Check if Ollama is Available
 */
async function checkOllama() {
  console.log('🔍 Checking Ollama availability...');
  try {
    const tags = await ollama.list();
    console.log('✅ Ollama is running!');
    console.log(`📦 Available models: ${tags.models.map(m => m.name).join(', ')}`);
    return true;
  } catch (error) {
    console.error('❌ Ollama is not running. Start it with: ollama serve');
    return false;
  }
}

/**
 * Main function - Run all examples
 */
async function main() {
  console.log('🚀 Local AI Model with Node.js + Ollama\n');
  console.log('='.repeat(50));

  // Check if Ollama is running
  const isAvailable = await checkOllama();
  if (!isAvailable) return;

  console.log('\n' + '='.repeat(50));

  // Example 1: Simple Text Generation
  await generateText('Write a short poem about artificial intelligence');

  console.log('\n' + '='.repeat(50));

  // Example 2: Chat Conversation
  const chatMessages = [
    { role: 'user', content: 'What is machine learning?' }
  ];
  await chatWithModel(chatMessages);

  console.log('\n' + '='.repeat(50));

  // Example 3: Question Answering with Context
  const context = 'Node.js is a JavaScript runtime built on Chromes V8 JavaScript engine. It allows developers to use JavaScript for server-side programming.';
  await answerQuestion('What is Node.js?', context);

  console.log('\n' + '='.repeat(50));

  // Example 4: Code Generation
  await generateCode('A function that calculates factorial of a number');

  console.log('\n' + '='.repeat(50));

  // Example 5: Streaming (Optional - uncomment to test)
  // await generateTextStreaming('Explain quantum computing in simple terms');

  console.log('\n✨ All examples completed!');
}

// Run the main function
main().catch(console.error);

/**
 * USAGE GUIDE:
 * 
 * 1. Make sure Ollama is running:
 *    $ ollama serve
 * 
 * 2. Run this script:
 *    $ node index.js
 * 
 * 3. For specific tasks, call functions directly:
 * 
 *    - Generate text:
 *      generateText('Your prompt here')
 * 
 *    - Chat:
 *      chatWithModel([{ role: 'user', content: 'Your message' }])
 * 
 *    - Stream response:
 *      generateTextStreaming('Your prompt')
 * 
 * 4. Available models check others:
 *    ollama pull llama2
 *    ollama pull neural-chat
 *    ollama pull openchat
 */
