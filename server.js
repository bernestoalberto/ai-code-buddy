const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai')
const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.get("/", (req, res) => {
  res.send("Hello Gemini");
});
const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 200,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
  };
  const safetySettings = [
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
app.post('/gemini', async(req, res) => {
  const history = req.body.history;
  const message = req.body.message;

  console.log(history);
  console.log(message);

  const model =  googleGenerativeAI.getGenerativeModel({ model:"gemini-pro"}, generationConfig, safetySettings)
  const chat = model.startChat({history});
//   const { totalTokens } = await model.countTokens({ history, message });
//   console.log(totalTokens);
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = await response.text();
  res.send(text);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
