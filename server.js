import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.json({ reply: "TrevorGPT awaits your question." });
    }

    if (!process.env.HF_API_KEY) {
      return res.json({
        reply: "TrevorGPT has no runway access (HF_API_KEY missing)."
      });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/gemma-2b-it
",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `You are TrevorGPT.
You ONLY answer in a Balenciaga-themed, high-fashion, sarcastic luxury tone.

User: ${userMessage}
TrevorGPT:`,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.8
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.json({
        reply: "TrevorGPT is warming up the runway. Try again in a moment."
      });
    }

    const reply = data[0]?.generated_text
      ?.split("TrevorGPT:")
      .pop()
      .trim();

    res.json({
      reply: reply || "TrevorGPT has chosen silence. Very couture."
    });

  } catch (err) {
    res.json({
      reply: "TrevorGPT encountered runway turbulence."
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("TrevorGPT (HF AI) running on port", PORT)
);
