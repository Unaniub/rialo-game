// =========================
// Word Pool
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // ===== semua kode app.js kamu taruh di sini =====
});

const wordList = [
  "rialo",
  "subzero",
  "blockchain",
  "web3",
  "crypto",
  "ecosystem",
  "dapp",
  "api",
  "wallet",
  "node"
];

// =========================
// Game State
// =========================
let lives;
let selectedWord;
let displayWord;
let playerName = "Player";

// =========================
// DOM Elements
// =========================
const startScreen     = document.getElementById("startScreen");
const gameScreen      = document.getElementById("gameScreen");
const startBtn        = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");
const welcomeText     = document.getElementById("welcomeText");

const wordDisplay     = document.getElementById("wordDisplay");
const livesContainer  = document.getElementById("lives");
const guessInput      = document.getElementById("guessInput");
const guessBtn        = document.getElementById("guessBtn");
const message         = document.getElementById("message");
const leaderboardList = document.getElementById("leaderboardList");
const newLevelBtn     = document.getElementById("newLevelBtn");

// =========================
// Render Functions
// =========================
function renderWord() {
  wordDisplay.textContent = displayWord.join(" ");
}

function renderHearts() {
  livesContainer.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement("span");
    heart.textContent = i < lives ? "❤️" : "🤍";
    heart.style.fontSize = "24px";
    heart.style.margin = "2px";
    livesContainer.appendChild(heart);
  }
}

// =========================
// Game Functions
// =========================
function initGame() {
  lives = 6;
  selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
  displayWord = Array(selectedWord.length).fill("_");
  message.textContent = "";
  newLevelBtn.style.display = "none";
  renderWord();
  renderHearts();
}

function handleGuess() {
  const guess = guessInput.value.toLowerCase();
  guessInput.value = "";
  if (!guess) return;

  if (selectedWord.includes(guess)) {
    selectedWord.split("").forEach((letter, index) => {
      if (letter === guess) displayWord[index] = guess;
    });
    renderWord();
  } else {
    lives--;
    renderHearts();
  }

  checkGameStatus();
}

function checkGameStatus() {
  if (!displayWord.includes("_")) {
    message.textContent = "🎉 You Win!";
    updateLeaderboard(playerName, 100);
    newLevelBtn.style.display = "inline-block";
  } else if (lives <= 0) {
    message.textContent = "💀 Game Over! The word was " + selectedWord;
    updateLeaderboard(playerName, 0);
    newLevelBtn.style.display = "inline-block";
  }
}

// =========================
// Leaderboard
// =========================
async function updateLeaderboard(name, score) {
  await fetch("/api/leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score }),
  });
  loadLeaderboard();
}

async function loadLeaderboard() {
  const res = await fetch("/api/leaderboard");
  const data = await res.json();
  leaderboardList.innerHTML = "";
  data.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}: ${entry.score}`;
    leaderboardList.appendChild(li);
  });
}

// =========================
// Event Listeners
// =========================
startBtn.addEventListener("click", () => {
  playerName = playerNameInput.value.trim() || "Player";
  welcomeText.textContent = `Welcome, ${playerName}!`;
  startScreen.style.display = "none";
  gameScreen.style.display = "block";
  initGame();
  loadLeaderboard();
});

guessBtn.addEventListener("click", handleGuess);
newLevelBtn.addEventListener("click", initGame);
