import Groq from "groq-sdk";
import * as dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getModels = async () => {
  return await groq.models.list();
};

// getModels().then((models) => {
//   console.log(models);
// });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion);
  console.log(chatCompletion.choices[0]?.message);
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        // content: "Explain the importance of fast language models",
        content: "Tell me about trichy morais city",
      },
    ],
    model: "llama3-8b-8192",
  });
}

main();
