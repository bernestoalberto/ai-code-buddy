import OpenAI from "openai";
import { config } from "dotenv";
import process from "node:process";
import os from 'node:os';
 

config();

  
  // Create an instance of ChatOpenAI with your custom configuration
const llm = new OpenAI({
    baseURL: os.platform() === "win32" 
    ?  process.env.LLAMA_LOCAL_BASE_URL
    :  process.env.LLAMA_REMOTE_BASE_URL,
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export default llm;