import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 📌 Load JSON fallback data
const dataPath = path.join(process.cwd(), "data", "outfits.json");
const manualData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

app.post("/api/style", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // 🔥 PRIMARY: Gemini API
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const geminiRes = await axios.post(url, {
      contents: [
        {
          parts: [
            {
              text: `You are a fashion assistant.
Suggest outfits clearly in this format:

Top:
Bottom:
Shoes:
Accessories:

User request: ${query}`,
            },
          ],
        },
      ],
    });

    const text = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Empty AI response");

    return res.json({
      source: "ai",
      result: text,
    });
  } catch (error) {
    console.error("⚠️ AI failed, using JSON fallback");

    // 🧠 FALLBACK: JSON data
    const random = manualData[Math.floor(Math.random() * manualData.length)];

    const formattedResult = `
Top: ${random.top}
Bottom: ${random.bottom}
Shoes: ${random.shoes}
Accessories: ${random.accessories}
    `;

    return res.json({
      source: "manual",
      result: formattedResult,
    });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
