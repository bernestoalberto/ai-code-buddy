import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const PORT = 8000;

// Loading modules

import { analyzeData } from "./src/analyze.js";
import { semanticSearch } from "./src/search.js";
import { geminiSemanticSearch } from "./src/search.js";

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store images in an 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Maintain original filename
  },
});
// Multer Setup (For handling file uploads)
const upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' });

// Middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());
app.use(express.json()); // Middleware for parsing JSON request bodies

let chat = [];

app.get("/", (req, res) => {
  res.send("Hello Gemini");
});
app.post("/uploadImage", upload.array("image"), (req, res) => {
  if (!req.file) {
    res.status(400).send("Error: No file uploaded.");
  } else {
    res.send("Image uploaded successfully!");
  }
});

app.post(
  "/gemini",
  async (
    req: { body: { query: any } },
    res: {
      json: (arg0: { result: any }) => void;
      status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any }): void; new (): any } };
    },
  ) => {
    console.log(req.body.query);
    try {
      const result = await geminiSemanticSearch(req.body);
      console.log({ result });
      res.json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);
app.post("/openai", async (req, res) => {
  const { message, model } = req.body;

  console.log(message); // keep it until api is stable
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON.",
        },
        { role: "user", content: message },
      ],
      // model: "gpt-3.5-turbo", // todo: add in the ui to chose the model
      model, // gpt-3.5-turbo, gpt-4o,gpt-4o-mini
      store: true,
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

app.post("/search", async (req, res) => {
  console.log(req.body.query);
  try {
    const result = await semanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/analyze", async (req, res) => {
  console.log(req.body.text);
  try {
    const analysis = await analyzeData(req.body.text);
    res.json(analysis);
    console.log(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
