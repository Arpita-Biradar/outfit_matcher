import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getAISuggestion } from "./services/aiService.js";

dotenv.config();

const app = express(); // 🔹 THIS WAS MISSING
app.use(cors());
app.use(express.json());

// JSON fallback
const dataPath = path.join(process.cwd(), "data", "outfits.json");
const fallbackData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 🔥 API ROUTE
app.post("/api/style", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const result = await getAISuggestion(query);
    res.json({ source: "ai", result });
  } catch (err) {
    console.error("AI failed:", err.message);

    const random =
      fallbackData[Math.floor(Math.random() * fallbackData.length)];

    const formatted = `
Top: ${random.top}
Bottom: ${random.bottom}
Shoes: ${random.shoes}
Accessories: ${random.accessories}
    `;

    res.json({ source: "manual", result: formatted });
  }
});

// 🔹 START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
