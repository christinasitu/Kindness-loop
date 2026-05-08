// THE KINDNESS LOOP

let gameState = "start";

let score = 0;
let level = 1;
let levelTarget = 5;
let message = "Collect kindness and pass it on.";

let pink, yellow;
let tileSize = 20;

// Player Variables
let playerX = 250;
let playerY = 250;
let playerSize = 28;
let playerSpeed = 2;
let moveMode = "horizontal";
let xDir = 1;
let yDir = 1;

// Heart variables
let heartX = 120;
let heartY = 250;
let hasHeart = false;

// Character Variables
let characterX = 390;
let characterY = 250;
let characterSize = 34;
let giveDistance = 45;

// Timer Variables
let timerLimit = 10;
let timer = 10;
let timerStarted = false;
let timerStartFrame = 0;

// Powerup Variables
let powerupX = 250;
let powerupY = 250;
let powerupActive = true;

// Obstacles Variables
let obstacles = [];

// Confetti Variables
let confetti = [];
let confettiTimer = 0;

// Level up text
let levelUpMessage = "";


//  -----------SETUP----------------------

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("game-container");

  pink = color(255, 79, 163);
  yellow = color(255, 230, 109);

  setupLevel();
  moveAll();
}

function draw() {
  drawBackground();

  if (gameState === "start") {
    drawStart();
  } else if (gameState === "playing") {
    drawGame();
  } else if (gameState === "confetti") {
    drawConfettiState();
  } else if (gameState === "gameover") {
    drawGameOver();
  }
}

// BACKGROUND

function drawBackground() {
  background(0);

  stroke(255, 79, 163, 40);
  strokeWeight(1);

  for (let x = 0; x < width; x += tileSize) {
    line(x, 100, x, height);
  }

  for (let y = 100; y < height; y += tileSize) {
    line(0, y, width, y);
  }

  noStroke();
  fill(255, 230, 109, 100);

  for (let i = 0; i < 18; i++) {
    let sparkleX = (i * 71 + frameCount * 0.4) % width;
    let sparkleY = 115 + ((i * 43) % (height - 135));
    rect(sparkleX, sparkleY, 2, 2);
  }
}

// ---------------- START SCREEN ----------------

function drawStart() {
  fill(0);
  stroke(pink);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2, 405, 410);

  noStroke();
  fill(pink);
  textAlign(CENTER, CENTER);
  textSize(34);
  text("KINDNESS", width / 2, 62);
  text("LOOP", width / 2, 100);

  fill(yellow);
  textSize(14);
  text("Kindness only counts", width / 2, 145);
  text("when it is passed on.", width / 2, 168);

  fill(pink);
  textSize(15);
  text("Collect ♥", width / 2, 215);
  text("Give ♥ to □", width / 2, 245);
  text("Avoid pink blocks", width / 2, 275);
  text("Use ✦ to change movement", width / 2, 305);

  fill(yellow);
  textSize(14);
  text("SPACE near □ = give", width / 2, 350);
  text("SPACE near ✦ = change mode", width / 2, 375);
  text("SPACE elsewhere = reverse", width / 2, 400);

  fill(pink);
  textSize(18);
  text("PRESS SPACE", width / 2, 455);
}

// ---------------- MAIN GAME ----------------

function drawGame() {
  updatePlayer();

  drawHeart();
  checkHeart();

  updateTimer();

  drawCharacter();
  drawPowerup();

  updateObstacles();
  checkObstacleCollision();

  drawPlayer();
  drawUI();
}

// PLAYER FUNCTIONS

function updatePlayer() {
  if (moveMode === "horizontal") {
    playerX += playerSpeed * xDir;
  } else if (moveMode === "vertical") {
    playerY += playerSpeed * yDir;
  } else if (moveMode === "diagonal") {
    playerX += playerSpeed * xDir;
    playerY += playerSpeed * yDir;
  }

  bouncePlayer();
}

function bouncePlayer() {
  if (playerX > width - playerSize / 2) {
    playerX = width - playerSize / 2;
    xDir *= -1;
  }

  if (playerX < playerSize / 2) {
    playerX = playerSize / 2;
    xDir *= -1;
  }

  if (playerY > height - playerSize / 2) {
    playerY = height - playerSize / 2;
    yDir *= -1;
  }

  if (playerY < 110) {
    playerY = 110;
    yDir *= -1;
  }
}

function drawPlayer() {
  noFill();
  stroke(yellow);
  strokeWeight(2);
  ellipse(playerX, playerY, playerSize + 8);

  fill(yellow);
  noStroke();
  ellipse(playerX, playerY, playerSize);

  fill(0);
  rectMode(CENTER);
  rect(playerX, playerY, 6, 6);

  if (hasHeart) {
    fill(pink);
    textAlign(CENTER, CENTER);
    textSize(22);
    text("♥", playerX, playerY - 28);
  }
}

function reverseDirection() {
  xDir *= -1;
  yDir *= -1;
  message = "Direction reversed.";
}

// HEART LOGIC

function drawHeart() {
  if (!hasHeart) {
    textAlign(CENTER, CENTER);

    fill(255, 79, 163, 70);
    textSize(42);
    text("♥", heartX, heartY);

    fill(pink);
    textSize(28);
    text("♥", heartX, heartY);
  }
}

function checkHeart() {
  if (!hasHeart && dist(playerX, playerY, heartX, heartY) < 28) {
    hasHeart = true;
    timerStarted = true;
    timerStartFrame = frameCount;
    timer = timerLimit;
    message = "Pass it on.";
  }
}

// DRAWING CHARACTER/ PROXIM CHECK

function drawCharacter() {
  stroke(yellow);
  strokeWeight(3);
  fill(0);
  rectMode(CENTER);
  rect(characterX, characterY, characterSize + 12, characterSize + 12);

  noStroke();
  fill(yellow);
  rect(characterX, characterY, characterSize, characterSize);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(18);
  text("♡", characterX, characterY);
}

function isNearCharacter() {
  return dist(playerX, playerY, characterX, characterY) < giveDistance;
}

// TIMER

function updateTimer() {
  if (timerStarted) {
    let elapsedSeconds = floor((frameCount - timerStartFrame) / 60);
    timer = timerLimit - elapsedSeconds;

    if (timer <= 0) {
      gameState = "gameover";
      message = "Kindness was kept too long.";
    }
  }
}

// INPUT (CAN only use SPACEBAR)

function keyPressed() {
  if (key === " ") {
    if (gameState === "start") {
      gameState = "playing";
      message = "Collect ♥";
    } else if (gameState === "playing") {
      if (hasHeart && isNearCharacter()) {
        giveHeart();
      } else if (isNearPowerup()) {
        collectPowerup();
      } else {
        reverseDirection();
      }
    } else if (gameState === "gameover") {
      restart();
    }
  }
}

function giveHeart() {
  score++;
  hasHeart = false;
  timerStarted = false;
  timer = timerLimit;
  message = "Kindness redistributed.";

  if (score > 0 && score % levelTarget === 0) {
    levelUp();
  } else {
    moveAll();
  }
}

// -------------------Make Levels

function levelUp() {
  level++;

  timerLimit = max(4, 11 - level);
  timer = timerLimit;
  playerSpeed = 2 + level * 0.35;

  if (level === 2) {
    moveMode = "vertical";
  } else if (level >= 3) {
    moveMode = "diagonal";
  }

  setupLevel();
  createConfetti();

  levelUpMessage = "LEVEL " + level;
  confettiTimer = 150;
  gameState = "confetti";
  message = "Level " + level + " unlocked.";
}

//  PLACEMENT LOGISTICS (make it fair and reachable)

function moveAll() {
  placeHeart();
  placeCharacter();
  placePowerup();
  powerupActive = true;
}

function placeHeart() {
  let pos = getReachablePosition();
  heartX = pos.x;
  heartY = pos.y;
}

function placeCharacter() {
  let pos = getReachablePositionAwayFrom(heartX, heartY, 115);
  characterX = pos.x;
  characterY = pos.y;
}

function placePowerup() {
  let pos = getReachablePositionAwayFrom(characterX, characterY, 105);
  powerupX = pos.x;
  powerupY = pos.y;
}

function getReachablePosition() {
  if (moveMode === "horizontal") {
    return { x: random(60, width - 60), y: playerY };
  }

  if (moveMode === "vertical") {
    return { x: playerX, y: random(130, height - 60) };
  }

  return { x: random(60, width - 60), y: random(130, height - 60) };
}

function getReachablePositionAwayFrom(avoidX, avoidY, minDistance) {
  let bestPos = getReachablePosition();

  for (let attempts = 0; attempts < 40; attempts++) {
    let pos = getReachablePosition();

    if (dist(pos.x, pos.y, avoidX, avoidY) > minDistance && !isOnObstacle(pos.x, pos.y)) {
      return pos;
    }

    bestPos = pos;
  }

  return bestPos;
}

function isOnObstacle(x, y) {
  for (let o of obstacles) {
    if (dist(x, y, o.x, o.y) < o.size + 35) {
      return true;
    }
  }

  return false;
}

// POWERUP Logistics

function drawPowerup() {
  if (powerupActive) {
    stroke(pink);
    strokeWeight(2);
    noFill();
    rectMode(CENTER);
    rect(powerupX, powerupY, 26, 26);

    noStroke();
    fill(pink);
    rect(powerupX, powerupY, 12, 12);

    fill(yellow);
    textAlign(CENTER, CENTER);
    textSize(14);
    text("✦", powerupX, powerupY - 1);
  }
}

function isNearPowerup() {
  if (!powerupActive) return false;
  return dist(playerX, playerY, powerupX, powerupY) < 35;
}

function collectPowerup() {
  toggleMode();
  powerupActive = false;
  message = "Mode changed to " + moveMode + ".";
}

function toggleMode() {
  if (moveMode === "horizontal") {
    moveMode = "vertical";
  } else if (moveMode === "vertical") {
    moveMode = "diagonal";
  } else {
    moveMode = "horizontal";
  }

  moveAll();
}

// Making Moving Obstacles

function setupLevel() {
  obstacles = [];

  let obstacleCount = min(level + 1, 7);

  for (let i = 0; i < obstacleCount; i++) {
    obstacles.push(makeSafeObstacle());
  }
}

function makeSafeObstacle() {
  let ox = random(70, width - 70);
  let oy = random(130, height - 70);

  for (let attempts = 0; attempts < 40; attempts++) {
    ox = random(70, width - 70);
    oy = random(130, height - 70);

    if (dist(ox, oy, playerX, playerY) > 140) {
      break;
    }
  }

  return {
    x: ox,
    y: oy,
    size: tileSize,
    dirX: random([1, -1]),
    dirY: random([1, -1]),
    speedX: 1.4 + level * 0.1,
    speedY: 1.4 + level * 0.1
  };
}

function updateObstacles() {
  for (let o of obstacles) {
    drawObstacle(o);
    moveObstacle(o);
  }
}

function drawObstacle(o) {
  stroke(pink);
  strokeWeight(2);
  noFill();
  rectMode(CENTER);
  rect(o.x, o.y, o.size + 4, o.size + 4);

  noStroke();
  fill(pink);
  rect(o.x, o.y, o.size, o.size);
}

function moveObstacle(o) {
  o.x += o.speedX * o.dirX;

  if (level >= 3) {
    o.y += o.speedY * o.dirY;
  }

  if (o.x < o.size / 2 || o.x > width - o.size / 2) {
    o.dirX *= -1;
  }

  if (o.y < 110 || o.y > height - o.size / 2) {
    o.dirY *= -1;
  }
}

function checkObstacleCollision() {
  for (let o of obstacles) {
    let d = dist(playerX, playerY, o.x, o.y);

    if (d < playerSize / 2 + o.size / 2 - 5) {
      gameState = "gameover";
      message = "Kindness was interrupted.";
    }
  }
}

// CONFETTI VISUAL

function createConfetti() {
  confetti = [];

  for (let i = 0; i < 45; i++) {
    confetti.push({
      x: width / 2,
      y: height / 2,
      vx: random(-3, 3),
      vy: random(-4, 1),
      size: random(14, 24)
    });
  }
}

function drawConfettiState() {
  drawBackground();

  fill(0);
  stroke(pink);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2, 330, 170);

  noStroke();
  fill(pink);
  textAlign(CENTER, CENTER);
  textSize(34);
  text(levelUpMessage, width / 2, height / 2 - 45);

  fill(yellow);
  textSize(15);
  text("Timer reduced to " + timerLimit + " seconds", width / 2, height / 2 - 10);
  text("Movement: " + moveMode, width / 2, height / 2 + 18);
  text("Keep passing kindness", width / 2, height / 2 + 46);

  updateConfetti();

  confettiTimer--;

  if (confettiTimer <= 0) {
    hasHeart = false;
    timerStarted = false;
    timer = timerLimit;

    moveAll();

    gameState = "playing";
    message = "Level " + level + ": keep passing kindness.";
  }
}

function updateConfetti() {
  for (let c of confetti) {
    fill(pink);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(c.size);
    text("♥", c.x, c.y);

    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.1;
  }
}

// Game Display/ UI

function drawUI() {
  fill(0);
  stroke(pink);
  strokeWeight(2);
  rectMode(CORNER);
  rect(12, 12, 185, hasHeart ? 110 : 88);

  noStroke();
  fill(pink);
  textAlign(LEFT, TOP);
  textSize(15);
  text("SCORE  " + score, 25, 25);
  text("LEVEL  " + level, 25, 47);
  text("MODE   " + moveMode, 25, 69);

  if (hasHeart) {
    fill(yellow);
    text("TIME   " + timer, 25, 91);
  }

  fill(0);
  stroke(yellow);
  strokeWeight(2);
  rectMode(CENTER);
  rect(width / 2, height - 28, 360, 34);

  noStroke();
  fill(yellow);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(message, width / 2, height - 28);
}

// -Game Over Mode

function drawGameOver() {
  fill(0);
  stroke(pink);
  strokeWeight(3);
  rectMode(CENTER);
  rect(width / 2, height / 2, 360, 210);

  noStroke();
  fill(pink);
  textAlign(CENTER, CENTER);
  textSize(34);
  text("GAME OVER", width / 2, height / 2 - 55);

  fill(yellow);
  textSize(16);
  text(message, width / 2, height / 2 - 10);
  text("Final score: " + score, width / 2, height / 2 + 25);

  fill(pink);
  text("Press SPACE to restart", width / 2, height / 2 + 75);
}

// Restart Mode

function restart() {
  gameState = "start";

  score = 0;
  level = 1;
  levelTarget = 5;
  message = "Collect kindness and pass it on.";

  playerX = width / 2;
  playerY = height / 2;
  playerSpeed = 2;
  moveMode = "horizontal";
  xDir = 1;
  yDir = 1;

  hasHeart = false;
  timerStarted = false;
  timerLimit = 10;
  timer = 10;

  powerupActive = true;
  confetti = [];
  confettiTimer = 0;

  setupLevel();
  moveAll();
}