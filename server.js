const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { getLeaderboard, addScore } = require("./api/leaderboard");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

app.get("/api/leaderboard", (req, res) => {
  res.json(getLeaderboard());
});

app.post("/api/leaderboard", (req, res) => {
  const { name, score } = req.body;
  addScore(name, score);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
