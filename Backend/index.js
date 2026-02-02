import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { getAISuggestion } from "./services/aiService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load JSON fallback for offline/manual suggestions
const dataPath = path.join(process.cwd(), "data", "outfits.json");
const fallbackData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 🔹 API route
app.post("/api/style", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // Try AI first
    const result = await getAISuggestion(query);
    res.json({ source: "ai", result });
  } catch (err) {
    console.error("AI failed, using JSON fallback:", err.message);

    // Fallback to manual JSON data
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

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
