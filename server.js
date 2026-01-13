mport express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("User message:", userMessage); // logs what user sent

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
@@ -12,23 +18,26 @@ app.post("/chat", async (req, res) => {
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a chill, helpful AI chatbot." },
          { role: "system", content: "You are a helpful AI chatbot." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenAI response:", data); // logs the full response

    if (!data.choices) {
      throw new Error("No choices returned from OpenAI");
      console.log("OpenAI returned error:", data);
      return res.status(500).json({ error: "OpenAI error" });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("Error in /chat route:", err); // logs the actual error
    res.status(500).json({ error: "Something broke" });
    console.error("Backend error:", err);
    res.status(500).json({ error: "Backend failure" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port", process.env.PORT || 3000);
});
