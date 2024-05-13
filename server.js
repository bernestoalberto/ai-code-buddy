const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser')
const multer = require('multer');
const {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const googleGenerativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const  {OpenAI}  = require("openai");
const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});
// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Store images in an 'uploads' folder
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname); // Maintain original filename
  }
});
const upload = multer({ storage: storage });

// Middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());
app.use(express.json());// Middleware for parsing JSON request bodies


let chat = [];
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

app.get("/", (req, res) => {
  res.send("Hello Gemini");
});
app.post("/uploadImage", upload.array('image') ,(req, res) => {
  if (!req.file) {
    res.status(400).send("Error: No file uploaded.");
} else {
    res.send('Image uploaded successfully!');
}
});

app.post('/gemini', async(req, res) => {
  const history = req.body.history;
  const message = req.body.message;

  console.log(history);
  console.log(message);

  const model =  googleGenerativeAI.getGenerativeModel({ model:"gemini-pro"}, generationConfig, safetySettings)
  chat = model.startChat({history});
  // const { totalTokens } = await model.countTokens({ history, message });
  // console.log(totalTokens);
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = await response.text();
  res.json({parts: text});
});
app.post('/openai', async(req, res) => {
  const message = req.body.message;
  console.log(message);
 try {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      { role: "user", content: message },
    ],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
    max_tokens: 40000, // adjust as needed
    temperature: 0.7, // adjust for creativity
  });
  const response = completion.choices[0].message.content;
  console.log(response); 

  res.json(response);
} catch (error) {
  console.error("Error with ChatGPT request:", error);
  res.status(500).send("Error communicating with ChatGPT");
}
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
