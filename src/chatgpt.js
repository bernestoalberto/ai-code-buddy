import OpenAI from "openai";
import { config } from "dotenv";
import process from "node:process";

config();
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export default openai;
