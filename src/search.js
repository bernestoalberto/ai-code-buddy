import deepSeek from "./deepseek.js";
import openai from "./chatgpt.js";
import googleGenerativeAI from "./gemini.js";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

export async function semanticSearch(query) {
  try {
    const { message, model } = query;
    console.log(`Running Deep Seek AI model ${model}`);
    const completion = await deepSeek.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are a powerful search engine. Return concise, factual answers.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.3,
      max_tokens: 150,
    });
    console.log(completion.choices[0].message.content);
    return JSON.parse(completion.choices[0].message.content);
    //return completion.choices[0].message.content;
  } catch (error) {
    console.error("Search error:", error.message);
    throw error;
  }
}

export async function geminiSemanticSearch(query) {
  try {
    //  const generationConfig = {
    //  stopSequences: ["red"],
    //  maxOutputTokens: 200,
    //  temperature: 0.9,
    //  topP: 0.1,
    //     topK: 16,
    //  };

    // const safetySettings = [
    // {
    //   category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //   threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    // },
    // {
    //   category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    //   threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    // },
    // {
    //   category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    //   threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    // },
    // ];

    const { history, message, model } = query;

    console.log(history);

    console.log(message);

    // const { totalTokens } = await model.countTokens({ history, message });
    // console.log(totalTokens);

    //   const result = await chat.sendMessage(message);
    //   const response = await result.response;
    //   const text = await response.text();
    //   res.json({parts: text});

    // const gemini =
    //  googleGenerativeAI.getGenerativeModel({ model: model}, generationConfig, safetySettings);
    const gemini = googleGenerativeAI.getGenerativeModel({ model: model });
    console.log(`Running Gemini model ${model}`);

    const result = await gemini.generateContent(message);
    console.log(result.response.text());
    return result.response.text();
    //   const completion = await gemini.chat.completions.create({
    //     model,
    //     messages: [
    //       {
    //         role: "system",
    //         content: "You are a powerful search engine. Return concise, factual answers."
    //       },
    //       { role: "user", content: query.message }
    //     ],
    //     temperature: 0.3,
    //     max_tokens: 150
    //   });

    //   console.log(completion.choices[0].message.content);
    //  const result = await gemini.generateContent(message);
    //   return JSON.parse(result);
    //return completion.choices[0].message.content;
  } catch (error) {
    console.error("Search error:", error.message);
    throw error;
  }
}
export async function openAISemanticSearch(query) {
  try {
    const { model, message } = query;
    console.log(`Running  Open AI model ${model}`);
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are a powerful search engine. Return concise, factual answers.",
            },
          ],
        },
        { role: "user", content: message },
      ],
      response_format: {
        "type": "text",
      },
      store: true,
      temperature: 0.3,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Search error:", error.cause.message + ":" + error.message);
    //   throw error;
    return error.message;
  }
}
