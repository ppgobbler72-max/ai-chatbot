import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// 🧠 Rule-based response engine
function getReply(message) {
  const msg = message.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hi! How can I help you today?";
  }

  if (msg.includes("help")) {
    return "Sure! Tell me what you need help with.";
  }

  if (msg.includes("price") || msg.includes("cost")) {
    return "Our service is completely free.";
  }

  if (msg.includes("contact")) {
    return "You can contact us through the contact page on this website.";
  }

  if (msg.includes("hours") || msg.includes("open")) {
    return "We are available 24/7 online.";
  }

  if (msg.includes("thanks") || msg.includes("thank you")) {
    return "You're welcome! 😊";
  }

  return "Sorry, I didn't quite understand that. Try asking something else.";
}

app.post("/chat", (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided" });
  }

  const reply = getReply(userMessage);
  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Free rule-based chatbot running on port", PORT)
);
