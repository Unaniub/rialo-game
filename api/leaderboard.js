const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../data/leaderboard.json");

function getLeaderboard() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function saveLeaderboard(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function addScore(name, score) {
  const leaderboard = getLeaderboard();
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) leaderboard.length = 10;
  saveLeaderboard(leaderboard);
}

module.exports = { getLeaderboard, addScore };
