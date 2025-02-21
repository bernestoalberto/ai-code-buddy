import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Buffer } from "node:buffer";
import process from "node:process";
import fs from "node:fs";

const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



export default googleGenerativeAI;

export const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 200,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
  };
  export const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType
      },
    };
  }

  async function textOnly() {
    const prompt = "I hate wokeness"
  
    const result = await model.generateContent(prompt, generationConfig);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }

  async function textToImage() {
    model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
    const prompt = "What's different between these pictures?";
  
    const imageParts = [
      fileToGenerativePart("image1.jpg", "image/png"),
      fileToGenerativePart("image2.jpg", "image/jpeg"),
    ];
  
    const result = await model.generateContent([prompt, ...imageParts]);
    // For text-and-image input (multimodal)
const { totalTokens } = await model.countTokens([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
    console.log(totalTokens);
  }

  async function embedding() {
    // For embedding, use the embedding-001 model
    // For text-only input
    model = genAI.getGenerativeModel({ model: "embedding-001"});
  
    const text = "The brother love to help his sister."
  
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    console.log(embedding.values);
  }

  