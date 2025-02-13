import deepSeek from "./deepseek.js";
import { config } from "dotenv";

config();
export async function analyzeData(text) {
  try {
    console.log(`Running AI model ${process.env.DEEPSEEK_MODEL}`);
    const completion = await deepSeek.chat.completions.create({
      model: process.env.DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content: "Analyze this text for sentiment, key topics, and named entities.",
        },
        { role: "user", content: text },
      ],
      temperature: 0.1,
      max_tokens: 256,
    });
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error("Analysis error:", error.message);
    throw error;
  }
}
