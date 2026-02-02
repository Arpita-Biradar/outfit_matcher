import axios from "axios";

export async function getAISuggestion(query) {
  const provider = process.env.AI_PROVIDER;

  if (provider === "gemini") {
    return geminiAI(query);
  }

  if (provider === "openai") {
    return openaiAI(query);
  }

  // if (provider === "huggingface") {
  //   return huggingfaceAI(query);
  // }

  throw new Error("No valid AI provider");
}

/* ===================== GEMINI ===================== */
async function geminiAI(query) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const res = await axios.post(url, {
    contents: [
      {
        parts: [{ text: formatPrompt(query) }],
      },
    ],
  });

  return res.data.candidates[0].content.parts[0].text;
}

/* ===================== OPENAI ===================== */
async function openaiAI(query) {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: formatPrompt(query) }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
  );

  return res.data.choices[0].message.content;
}

/* ===================== HUGGING FACE ===================== */
// async function huggingfaceAI(query) {
//   const res = await axios.post(
//     "https://api-inference.huggingface.co/models/google/flan-t5-large",
//     { inputs: formatPrompt(query) },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//       },
//     },
//   );

//   return res.data[0].generated_text;
// }

/* ===================== COMMON PROMPT ===================== */
function formatPrompt(query) {
  return `You are a fashion assistant.
Suggest outfits clearly in this format:

Top:
Bottom:
Shoes:
Accessories:

User request: ${query}`;
}
