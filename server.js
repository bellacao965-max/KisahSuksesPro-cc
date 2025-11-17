import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limit
app.use(
  rateLimit({
    windowMs: 60000,
    max: 60
  })
);

// Serve public folder
app.use(express.static(path.join(__dirname, "public")));
console.log("Serving static from:", path.join(__dirname, "public"));

// AI KEYS
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const GROQ_KEY = process.env.GROQ_API_KEY || "";

// AI FUNCTION
async function callAI(prompt, model) {
  if (OPENAI_KEY) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const j = await r.json();
    return j.choices?.[0]?.message?.content || "No reply";
  }

  if (GROQ_KEY) {
    const groq = new Groq({ apiKey: GROQ_KEY });
    const r = await groq.chat.completions.create({
      model: model || "gemma2-9b-it",
      messages: [{ role: "user", content: prompt }]
    });
    return r.choices?.[0]?.message?.content || "No reply";
  }

  return "AI key belum diatur di Render dashboard.";
}

// AI Route
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const reply = await callAI(prompt);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "AI Error", detail: err.message });
  }
});

// Quote (tanpa API)
app.get("/api/quote", (req, res) => {
  const Q = [
    "Sukses dimulai dari langkah pertama.",
    "Tetap fokus, hasil akan mengikuti.",
    "Jangan menyerah, proses membentukmu."
  ];
  res.json({ quote: Q[Math.floor(Math.random() * Q.length)] });
});

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SERVER READY"));
