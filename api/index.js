const express = require("express");
const OpenAI = require("openai");

const openai = new OpenAI();
const app = express();
const port = 3001;

const query =
  "Create a conversation between two random individuals in an unspecified location, discussing arbitrary topics with a late-night ambiance. Ensure the conversation can loop infinitely with a smooth transition from the end back to the start. Include their names and format it as follows: '{personOne: string, personTwo: string, conversation: [{person: string, content: string}]}'.";

const storyOfTheDay = {};

function getCurrentDate() {
  const today = new Date();

  const day = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-based, so we add 1
  const year = today.getFullYear();

  const currentDate = `${day}-${month}-${year}`;
  return currentDate;
}

async function askGPT(message) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: message }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

app.get("/story", async (req, res) => {
  const today = getCurrentDate();
  if (storyOfTheDay[today]) {
    return res.send(storyOfTheDay[today]);
  }

  const story = await askGPT(query);

  storyOfTheDay = {}; // Clear the cache
  storyOfTheDay[today] = story;

  res.send(story);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

module.exports = app;
