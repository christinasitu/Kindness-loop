// KINDNESS LOOP - DEBUGGED VERSION

let gameState = "start";

let score = 0;
let level = 1;
let levelTarget = 5;
let message = "Collect kindness and pass it on.";

let pink, yellow;

// Player
let playerX = 250;
let playerY = 250;
let playerSize = 28;
let playerSpeed = 2;
let moveMode = "horizontal";
let xDir = 1;
let yDir = 1;

// Heart
let heartX = 120;
let heartY = 250;
let hasHeart = false;

// Character
let characterX = 390;
let characterY = 250;
let characterSize = 34;
let giveDistance = 45;

// Timer
let timerLimit = 10;
let timer = 10;
let timerStarted = false;
let timerStartFrame = 0;

// Powerup
let powerupX = 250;
let powerupY = 250;
let powerupActive = true;

// Obstacles
let obstacles = [];

// Confetti
let confetti = [];
let confettiTimer = 0;

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("game-container");

  pink = color(255, 79, 163);
  yellow = color(255, 230, 109);

  setupLevel();
  moveAll();
}

function draw() {
  background(0);

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

// ---------------- START SCREEN ----------------

function drawStart() {
  fill(pink);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("KINDNESS LOOP", width / 2, 90);

  fill(yellow);
  textSize(16);
  text("Collect ♥", width / 2, 170);
  text("Give it to □ before time runs out", width / 2, 200);
  text("Press SPACE near □ to give", width / 2, 230);
  text("Avoid ■ obstacles", width / 2, 260);
  text("✦ = powerup, SPACE to activate", width / 2, 290);
  text("Powerups change movement", width / 2, 320);

  fill(pink);
  textSize(18);
  text("Press SPACE to start", width / 2, 400);
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

// ---------------- PLAYER ----------------

function updatePlayer() {
  if (moveMode === "horizontal") {
    playerX += playerSpeed * xDir;
  } else if (moveMode === "vertical") {
    playerY += playerSpeed * yDir;
  } else if (moveMode === "diagonal") {
    playerX += playerSpeed * xDir;
    playerY += playerSpeed * yDir;
  }

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
  fill(yellow);
  noStroke();
  ellipse(playerX, playerY, playerSize);

  if (hasHeart) {
    fill(pink);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("♥", playerX, playerY - 25);
  }
}

// ---------------- HEART ----------------

function drawHeart() {
  if (!hasHeart) {
    fill(pink);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(26);
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

// ---------------- CHARACTER ----------------

function drawCharacter() {
  fill(yellow);
  noStroke();
  rectMode(CENTER);
  rect(characterX, characterY, characterSize, characterSize);
}

function isNearCharacter() {
  return dist(playerX, playerY, characterX, characterY) < giveDistance;
}

// ---------------- TIMER ----------------

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

// ---------------- INPUT ----------------

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

// ---------------- LEVELS ----------------

function levelUp() {
  level++;

  timerLimit = max(4, 11 - level);
  timer = timerLimit;
  playerSpeed = 2 + level * 0.35;

  if (level === 1) {
    moveMode = "horizontal";
  } else if (level === 2) {
    moveMode = "vertical";
  } else {
    moveMode = "diagonal";
  }

  setupLevel();
  createConfetti();

  confettiTimer = 120;
  gameState = "confetti";
  message = "Level " + level + " unlocked.";
}

function setupLevel() {
  obstacles = [];

  let obstacleCount = min(level - 1, 6);

  for (let i = 0; i < obstacleCount; i++) {
    let newObstacle = makeSafeObstacle();
    obstacles.push(newObstacle);
  }
}

function makeSafeObstacle() {
  let ox = random(70, width - 70);
  let oy = random(130, height - 70);

  for (let attempts = 0; attempts < 30; attempts++) {
    ox = random(70, width - 70);
    oy = random(130, height - 70);

    if (dist(ox, oy, playerX, playerY) > 90) {
      break;
    }
  }

  return {
    x: ox,
    y: oy,
    size: 22,
    dir: random([1, -1]),
    speed: random(1, 1.8 + level * 0.2)
  };
}

// ---------------- FAIR PLACEMENT ----------------

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
  let pos = getReachablePositionAwayFrom(heartX, heartY, 110);

  characterX = pos.x;
  characterY = pos.y;
}

function placePowerup() {
  let pos = getReachablePositionAwayFrom(characterX, characterY, 100);

  powerupX = pos.x;
  powerupY = pos.y;
}

function getReachablePosition() {
  if (moveMode === "horizontal") {
    return {
      x: random(60, width - 60),
      y: playerY
    };
  }

  if (moveMode === "vertical") {
    return {
      x: playerX,
      y: random(130, height - 60)
    };
  }

  return {
    x: random(60, width - 60),
    y: random(130, height - 60)
  };
}

function getReachablePositionAwayFrom(avoidX, avoidY, minDistance) {
  let pos = getReachablePosition();

  for (let attempts = 0; attempts < 40; attempts++) {
    pos = getReachablePosition();

    if (dist(pos.x, pos.y, avoidX, avoidY) > minDistance) {
      return pos;
    }
  }

  return pos;
}

// ---------------- POWERUP ----------------

function drawPowerup() {
  if (powerupActive) {
    fill(pink);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text("✦", powerupX, powerupY);
  }
}

function isNearPowerup() {
  if (!powerupActive) return false;
  return dist(playerX, playerY, powerupX, powerupY) < 35;
}

function collectPowerup() {
  toggleMode();
  powerupActive = false;
  message = "Mode: " + moveMode;
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

// ---------------- OBSTACLES ----------------

function updateObstacles() {
  fill(pink);
  noStroke();

  for (let o of obstacles) {
    rectMode(CENTER);
    rect(o.x, o.y, o.size, o.size);

    o.x += o.speed * o.dir;

    if (o.x < o.size || o.x > width - o.size) {
      o.dir *= -1;
    }
  }
}

function checkObstacleCollision() {
  for (let o of obstacles) {
    if (dist(playerX, playerY, o.x, o.y) < playerSize / 2 + o.size / 2) {
      gameState = "gameover";
      message = "Kindness was interrupted.";
    }
  }
}

// ---------------- CONFETTI ----------------

function createConfetti() {
  confetti = [];

  for (let i = 0; i < 40; i++) {
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
  background(0);

  drawUI();
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

// ---------------- UI ----------------

function drawUI() {
  fill(pink);
  textAlign(LEFT, TOP);
  textSize(16);
  text("Score: " + score, 20, 20);
  text("Level: " + level, 20, 42);
  text("Mode: " + moveMode, 20, 64);

  if (hasHeart) {
    text("Timer: " + timer, 20, 86);
  }

  fill(yellow);
  textAlign(CENTER, BOTTOM);
  textSize(14);
  text(message, width / 2, height - 20);
}

// ---------------- GAME OVER ----------------

function drawGameOver() {
  fill(pink);
  textAlign(CENTER, CENTER);
  textSize(34);
  text("GAME OVER", width / 2, height / 2 - 35);

  fill(yellow);
  textSize(16);
  text(message, width / 2, height / 2 + 5);
  text("Final score: " + score, width / 2, height / 2 + 35);

  fill(pink);
  text("Press SPACE to restart", width / 2, height / 2 + 85);
}

// ---------------- RESET ----------------

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