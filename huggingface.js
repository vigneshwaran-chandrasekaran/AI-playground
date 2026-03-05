/**
 * HuggingFace Transformers with Node.js
 * Using @xenova/transformers for local model execution
 * 
 * Installation:
 *   npm install @xenova/transformers
 */

import { pipeline } from '@xenova/transformers';

/**
 * 1. Text Generation with DistilGPT-2
 */
async function textGeneration(prompt) {
  console.log('\n📝 Text Generation (DistilGPT-2):');
  console.log(`📌 Prompt: ${prompt}\n`);

  try {
    const generator = await pipeline('text-generation', 'Xenova/distilgpt2');
    const result = await generator(prompt, { max_new_tokens: 100 });
    
    console.log('✅ Generated Text:');
    console.log(result[0].generated_text);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 2. Question Answering
 */
async function questionAnswering(question, context) {
  console.log('\n❓ Question Answering:');
  console.log(`Context: ${context}`);
  console.log(`Question: ${question}\n`);

  try {
    const qa = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
    const result = await qa({ question, context });
    
    console.log('✅ Answer:');
    console.log(`${result.answer} (confidence: ${(result.score * 100).toFixed(2)}%)`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 3. Sentiment Analysis
 */
async function sentimentAnalysis(text) {
  console.log('\n😊 Sentiment Analysis:');
  console.log(`Text: ${text}\n`);

  try {
    const classifier = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
    const result = await classifier(text);
    
    console.log('✅ Sentiment:');
    console.log(`Label: ${result[0].label}, Score: ${(result[0].score * 100).toFixed(2)}%`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 4. Text Classification
 */
async function textClassification(text) {
  console.log('\n🏷️  Text Classification:');
  console.log(`Text: ${text}\n`);

  try {
    const classifier = await pipeline('zero-shot-classification', 'Xenova/distilbert-base-uncased');
    const result = await classifier(
      text,
      ['positive', 'negative', 'neutral']
    );
    
    console.log('✅ Classification Results:');
    result.scores.forEach((score, index) => {
      console.log(`${result.labels[index]}: ${(score * 100).toFixed(2)}%`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 5. Named Entity Recognition (NER)
 */
async function namedEntityRecognition(text) {
  console.log('\n🏷️  Named Entity Recognition:');
  console.log(`Text: ${text}\n`);

  try {
    const ner = await pipeline('token-classification', 'Xenova/bert-base-multilingual-cased-ner');
    const result = await ner(text);
    
    console.log('✅ Entities Found:');
    result.forEach(entity => {
      console.log(`${entity.word}: ${entity.entity_group}`);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 6. Summarization
 */
async function summarization(text) {
  console.log('\n📄 Summarization:');
  console.log(`Text: ${text}\n`);

  try {
    const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    const result = await summarizer(text, { max_length: 100, min_length: 50 });
    
    console.log('✅ Summary:');
    console.log(result[0].summary_text);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 7. Translation (English to French)
 */
async function translation(text) {
  console.log('\n🌐 Translation (EN -> FR):');
  console.log(`Text: ${text}\n`);

  try {
    const translator = await pipeline('translation_en_to_fr', 'Xenova/nllb-200-distilled-600M');
    const result = await translator(text);
    
    console.log('✅ Translation:');
    console.log(result[0].translation_text);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 8. Feature Extraction (Embeddings)
 */
async function featureExtraction(text) {
  console.log('\n🔢 Feature Extraction (Embeddings):');
  console.log(`Text: ${text}\n`);

  try {
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const result = await extractor(text, { pooling: 'mean', normalize: true });
    
    console.log('✅ Embedding (first 10 dimensions):');
    console.log(result[0].slice(0, 10));
    console.log(`Total dimensions: ${result[0].length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Main function - Run all examples
 */
async function main() {
  console.log('🚀 HuggingFace Transformers with Node.js\n');
  console.log('='.repeat(60));

  // Example 1: Text Generation
  await textGeneration('Artificial Intelligence is');

  console.log('\n' + '='.repeat(60));

  // Example 2: Question Answering
  const context = 'JavaScript is a versatile programming language that runs in browsers and servers. Node.js is a runtime environment for running JavaScript outside the browser.';
  await questionAnswering('What is Node.js?', context);

  console.log('\n' + '='.repeat(60));

  // Example 3: Sentiment Analysis
  await sentimentAnalysis('I absolutely love exploring AI models! This is amazing!');

  console.log('\n' + '='.repeat(60));

  // Example 4: Text Classification
  await textClassification('This movie was fantastic! I loved every minute of it.');

  console.log('\n' + '='.repeat(60));

  // Example 5: Named Entity Recognition
  await namedEntityRecognition('John Smith works at Google in Mountain View.');

  console.log('\n' + '='.repeat(60));

  // Example 6: Summarization
  const longText = `Artificial Intelligence (AI) continues to revolutionize various industries 
  by automating complex tasks and improving decision-making processes. Machine learning, 
  a subset of AI, enables systems to learn from data without explicit programming. 
  Deep learning models powered by neural networks have achieved remarkable breakthroughs 
  in image recognition, natural language processing, and game playing. Companies worldwide 
  are investing heavily in AI research and development to maintain competitive advantages.`;
  await summarization(longText);

  console.log('\n' + '='.repeat(60));

  // Example 7: Translation
  await translation('Hello! How are you doing today?');

  console.log('\n' + '='.repeat(60));

  // Example 8: Feature Extraction
  await featureExtraction('HuggingFace transformers are powerful');

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ All HuggingFace examples completed!');
}

// Run the main function
main().catch(console.error);

/**
 * USAGE GUIDE:
 *
 * 1. Install the required package:
 *    npm install @xenova/transformers
 *
 * 2. Run this script:
 *    node huggingface.js
 *
 * 3. Call specific functions:
 *    - Text Generation: textGeneration('Your prompt')
 *    - Q&A: questionAnswering('Question', 'Context')
 *    - Sentiment: sentimentAnalysis('Text')
 *    - Classification: textClassification('Text')
 *    - NER: namedEntityRecognition('Text')
 *    - Summarization: summarization('Text')
 *    - Translation: translation('Text')
 *    - Embeddings: featureExtraction('Text')
 *
 * AVAILABLE MODELS (can change in each pipeline call):
 *    Text Generation: Xenova/distilgpt2, Xenova/gpt2
 *    Q&A: Xenova/distilbert-base-uncased-distilled-squad
 *    Sentiment: Xenova/distilbert-base-uncased-finetuned-sst-2-english
 *    Classification: Xenova/distilbert-base-uncased
 *    NER: Xenova/bert-base-multilingual-cased-ner
 *    Summarization: Xenova/distilbart-cnn-6-6
 *    Translation: Xenova/nllb-200-distilled-600M
 *    Embeddings: Xenova/all-MiniLM-L6-v2
 */
