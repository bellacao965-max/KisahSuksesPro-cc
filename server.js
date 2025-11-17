import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import fetch from "node-fetch";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const OPENAI_KEY = process.env.OPENAI_API_KEY || "";
const GROQ_KEY = process.env.GROQ_API_KEY || "";

async function callAI(prompt) {
  if (OPENAI_KEY) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }] })
    });
    const j = await r.json();
    return j.choices?.[0]?.message?.content || "No reply";
  }
  if (GROQ_KEY) {
    const g = new Groq({ apiKey: GROQ_KEY });
    const chat = await g.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [{ role: "user", content: prompt }]
    });
    return chat.choices?.[0]?.message?.content || "No reply";
  }
  return "AI key belum diset.";
}

app.post("/api/ai", async (req, res) => {
  if (!req.body.prompt) return res.json({ reply: "Missing prompt" });
  const out = await callAI(req.body.prompt);
  res.json({ reply: out });
});

const QUOTES = ["Jangan menyerah.","Sukses dimulai dengan langkah kecil.","Fokus & kerja keras = hasil."];
app.get("/api/quote", (req,res)=> res.json({ quote: QUOTES[Math.floor(Math.random()*QUOTES.length)] }));

app.get("/health", (req,res)=> res.json({status:"ok"}));

app.listen(process.env.PORT || 3000, ()=> console.log("SERVER READY"));
