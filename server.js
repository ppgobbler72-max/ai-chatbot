app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    console.log("User message:", userMessage); // logs what user sent

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a chill, helpful AI chatbot." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenAI response:", data); // logs the full response

    if (!data.choices) {
      throw new Error("No choices returned from OpenAI");
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("Error in /chat route:", err); // logs the actual error
    res.status(500).json({ error: "Something broke" });
  }
});
