import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import path from "path";
import fetch from "node-fetch"; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();
const app = express();
const PORT = 3000;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
}

app.post("/api/from-url", async (req, res) => {
  const imageUrl = req.body.url;
  const userPrompt = req.body.userPrompt || "";

  if (!imageUrl) {
    return res.status(400).json({ success: false, error: "No image URL provided." });
  }

  try {
    const { mode } = req.body;

    const basePrompt = 
      mode === "yugioh"
        ? process.env.YUGIOH_PROMPT
        : process.env.POKEMON_PROMPT;

    const fullPrompt = `${basePrompt}${userPrompt}`;
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();
    const mimeType = response.headers.get("content-type") || "image/png";

    const base64 = buffer.toString("base64");

    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: mimeType,
      },
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([fullPrompt, imagePart]);
    const geminiResponse = await result.response;
    const cardText = await geminiResponse.text();

    res.json({ success: true, card: cardText });
  } catch (err) {
    console.error("Error processing image URL:", err);
    res.status(500).json({ success: false, error: "Failed to analyze image URL." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
