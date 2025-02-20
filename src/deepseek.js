import OpenAI from "openai";
import { config } from "dotenv";
import process from "node:process";
import os from 'node:os';
 

config();
const deepSeek = new OpenAI({
  baseURL: os.platform() === "win32" 
    ?  process.env.DEEPSEEK_REMOTE_BASE_URL
    :  process.env.DEEPSEEK_LOCAL_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});
export default deepSeek;
