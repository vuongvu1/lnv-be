const express = require("express");
const OpenAI = require("openai");

const openai = new OpenAI();
const app = express();
const port = 3001;

async function askGPT(message) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: message }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

app.get("/ask", async (req, res) => {
  const { q: question } = req.query;
  const reply = question ? await askGPT(question) : "No question asked.";
  res.send(reply);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
