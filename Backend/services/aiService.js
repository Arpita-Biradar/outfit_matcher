import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// 🔹 Initialize Google Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY, // must be in your .env
});

// 🔹 Load JSON fallback
const dataPath = path.join(process.cwd(), "data", "outfits.json");
const fallbackData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// 🔹 Main function to get suggestion
export async function getAISuggestion(query) {
  if (!query) throw new Error("Query is required");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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

    // 🔹 Extract the AI response safely
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("AI returned empty response");

    return text;
  } catch (err) {
    console.error("AI failed:", err.message);

    // 🔹 Fallback to JSON
    const random =
      fallbackData[Math.floor(Math.random() * fallbackData.length)];

    const formatted = `
Top: ${random.top}
Bottom: ${random.bottom}
Shoes: ${random.shoes}
Accessories: ${random.accessories}
    `;

    return formatted;
  }
}
