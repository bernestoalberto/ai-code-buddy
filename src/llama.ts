import OpenAI from "openai";
import process from "node:process";
import os from 'node:os';
import dotenv from "dotenv";
 

dotenv.config();

  
  // Create an instance of ChatOpenAI with your custom configuration
  export const llm = new OpenAI({
    baseURL: os.platform() === "win32" 
    ?  process.env.LLAMA_LOCAL_BASE_URL
    :  process.env.LLAMA_REMOTE_BASE_URL,
    apiKey: process.env.DEEPSEEK_API_KEY,
});
