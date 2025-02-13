import { GoogleGenerativeAI } from "@google/generative-ai";
import process from "node:process";

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default googleGenerativeAI;
