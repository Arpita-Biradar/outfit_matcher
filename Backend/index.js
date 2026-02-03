import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { getAISuggestion } from "./services/aiService.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(process.cwd(), "data", "outfits.json");
const fallbackData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

app.post("/api/style", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const result = await getAISuggestion(query);
    return res.json({ source: "ai", result });
  } catch (err) {
    console.error("AI failed, using JSON fallback:", err.message);

    const random =
      fallbackData[Math.floor(Math.random() * fallbackData.length)];

    const formatted = `
Top: ${random.top}
Bottom: ${random.bottom}
Shoes: ${random.shoes}
Accessories: ${random.accessories}
    `;

    return res.json({ source: "manual", result: formatted });
  }
});

const addUtm = (url) => {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}utm_source=stylemate&utm_medium=referral`;
};

app.get("/api/image", async (req, res) => {
  const query = req.query.query;
  const count = Number.parseInt(req.query.count || "3", 10);
  const perPage = Number.isNaN(count) ? 3 : Math.min(Math.max(count, 1), 6);

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  if (!process.env.UNSPLASH_ACCESS_KEY) {
    return res.status(500).json({ error: "Unsplash API key missing" });
  }

  try {
    const searchQuery = `${query} outfit fashion`;
    const endpoint =
      "https://api.unsplash.com/search/photos" +
      `?query=${encodeURIComponent(searchQuery)}` +
      `&per_page=${perPage}&orientation=landscape`;

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Unsplash error: ${response.status}`);
    }

    const data = await response.json();
    const images = (data?.results || [])
      .map((photo) => ({
        imageUrl: photo.urls?.regular || "",
        imageAlt: photo.alt_description || `${query} outfit`,
        imageLink: addUtm(photo.links?.html),
        creditName: photo.user?.name || "Unsplash",
        creditLink: addUtm(photo.user?.links?.html),
      }))
      .filter((image) => image.imageUrl);

    if (!images.length) {
      return res.json({ images: [] });
    }

    return res.json({
      images,
      imageUrl: images[0].imageUrl,
      imageAlt: images[0].imageAlt,
      imageLink: images[0].imageLink,
      creditName: images[0].creditName,
      creditLink: images[0].creditLink,
    });
  } catch (err) {
    console.error("Unsplash fetch failed:", err.message);
    return res.json({ images: [] });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
