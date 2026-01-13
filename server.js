import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors());
const upload = multer({ dest: "uploads/" });

app.post("/chat", async (req, res) => {
  try {
    const { history } = req.body; // full conversation array [{role:"user", content:"..."}, ...]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: history
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something broke" });
  }
});

// Handle image uploads
app.post("/image", upload.single("image"), async (req, res) => {
  try {
    // Example: just return the filename
    res.json({ status: "Image received", filename: req.file.filename });
    // Later: you can send this to OpenAI image endpoints
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// Optional: fetch URL content
app.post("/fetch-url", async (req, res) => {
  try {
    const { url } = req.body;
    const { data } = await axios.get(url);
    // Strip HTML for simplicity
    const text = data.replace(/<[^>]*>?/gm, "").slice(0, 5000);
    res.json({ content: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch URL" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
