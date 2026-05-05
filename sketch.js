let gameState = "playing";
let score = 0;
let message = "Find kindness";

// Player
let playerX = 250;
let playerY = 250;
let playerSize = 28;
let playerSpeed = 2;

// Heart
let heartX = 120;
let heartY = 250;
let heartSize = 26;
let hasHeart = false;

// Timer
let timer = 10;
let timerStarted = false;
let timerStartFrame = 0;

// Character
let characterX = 380;
let characterY = 250;
let characterSize = 34;
let giveDistance = 45;

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("game-container");
}

function draw() {
  background(0);

  if (gameState === "playing") {
    updatePlayer();
    drawHeart();
    checkHeartCollection();
    updateTimer();
    drawCharacter();
    drawPlayer();
    drawUI();
  }

  if (gameState === "gameover") {
    drawGameOver();
  }
}

function updatePlayer() {
  playerX = playerX + playerSpeed;

  if (playerX > width - playerSize / 2 || playerX < playerSize / 2) {
    playerSpeed = playerSpeed * -1;
  }
}

function drawPlayer() {
  fill(255, 230, 109);
  noStroke();
  ellipse(playerX, playerY, playerSize, playerSize);

  if (hasHeart === true) {
    fill(255, 79, 163);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("♥", playerX, playerY - 24);
  }
}

function drawHeart() {
  if (hasHeart === false) {
    fill(255, 79, 163);
    noStroke();
    textSize(heartSize);
    textAlign(CENTER, CENTER);
    text("♥", heartX, heartY);
  }
}

function checkHeartCollection() {
  let distanceToHeart = dist(playerX, playerY, heartX, heartY);

  if (distanceToHeart < playerSize / 2 + heartSize / 2 && hasHeart === false) {
    hasHeart = true;
    timerStarted = true;
    timerStartFrame = frameCount;
    message = "Pass it on before time runs out!";
  }
}

function updateTimer() {
  if (timerStarted === true) {
    let elapsedFrames = frameCount - timerStartFrame;
    let elapsedSeconds = floor(elapsedFrames / 60);

    timer = 10 - elapsedSeconds;

    if (timer <= 0) {
      gameState = "gameover";
      message = "Kindness was not shared in time.";
    }
  }
}

function drawCharacter() {
  fill(255, 230, 109);
  noStroke();
  rectMode(CENTER);
  rect(characterX, characterY, characterSize, characterSize);
}

function keyPressed() {
  if (key === " ") {
    if (gameState === "playing") {
      giveHeart();
    }

    if (gameState === "gameover") {
      restartGame();
    }
  }
}

function giveHeart() {
  if (hasHeart === true && isNearCharacter() === true) {
    score = score + 1;
    message = "Kindness shared! Find another heart.";

    hasHeart = false;
    timerStarted = false;
    timer = 10;

    moveHeart();
    moveCharacter();
  }
}

function isNearCharacter() {
  let distanceToCharacter = dist(playerX, playerY, characterX, characterY);
  return distanceToCharacter < giveDistance;
}

function moveHeart() {
  heartX = random(60, width - 60);
  heartY = playerY;
}

function moveCharacter() {
  characterX = random(60, width - 60);
  characterY = playerY;
}

function drawUI() {
  fill(255, 79, 163);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);

  if (hasHeart === true) {
    text("Timer: " + timer, 20, 45);
  }

  textAlign(CENTER, BOTTOM);
  textSize(16);
  text(message, width / 2, height - 20);
}

function drawGameOver() {
  fill(255, 79, 163);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("GAME OVER", width / 2, height / 2);

  textSize(16);
  text("Press SPACE to restart", width / 2, height / 2 + 40);
}

function restartGame() {
    message = "Find kindness";
  score = 0;
  hasHeart = false;
  timer = 10;
  timerStarted = false;
  gameState = "playing";

  playerX = 250;
  playerY = 250;

  moveHeart();
  moveCharacter();
}