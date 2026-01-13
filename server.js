app.post("/chat", async (req, res) => {
  return res.json({
    status: "DEBUG",
    message: "If you see this, Render updated successfully"
  });
});
