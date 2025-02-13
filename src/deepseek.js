import OpenAI from "openai";
import { config } from "dotenv";

config();
const deepSeek = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});
export default deepSeek;
