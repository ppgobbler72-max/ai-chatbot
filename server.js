import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL = "mistralai/Mistral-7B-Instruct";

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    if (!HF_API_KEY) {
      return res.status(500).json({ error: "HF_API_KEY not set" });
    }

    const prompt = `
You are TrevorGPT.
You ONLY answer questions in a Balenciaga fashion, high-fashion, sarcastic, luxury tone.

User: ${userMessage}
TrevorGPT:
`;

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 120,
            temperature: 0.8
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({
        error: "HF inference error",
        details: data.error
      });
    }

    const reply =
      Array.isArray(data)
        ? data[0].generated_text.replace(prompt, "").trim()
        : "TrevorGPT is thinking about fashion right now.";

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: "Backend error", details: err.message });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("TrevorGPT (HF AI) running")
);
