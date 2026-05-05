// Game state
let gameState = "playing";
let score = 0;

// Player variables
let playerX = 250;
let playerY = 250;
let playerSize = 28;
let playerSpeed = 2;

// Heart variables
let heartX = 120;
let heartY = 250;
let heartSize = 26;
let hasHeart = false;

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("game-container");
}

function draw() {
  background(0);

  if (gameState === "playing") {
    updatePlayer();
    drawHeart();
     CheckHeartCollection();
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
  fill(255, 230, 109); // yellow
  noStroke();
  ellipse(playerX, playerY, playerSize, playerSize);

  if (hasHeart === true) {
    fill(255, 79, 163); // pink
    textSize(18);
    textAlign(CENTER, CENTER);
    text("♥", playerX, playerY - 24);
  }
}

function drawUI() {
  fill(255, 79, 163); // pink
  textSize(18);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
}

function drawGameOver() {
  fill(255, 79, 163);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("GAME OVER", width / 2, height / 2);

  textSize(16);
  text("Press SPACE to restart", width / 2, height / 2 + 40);
}

function drawHeart() {
    if (hasHeart === false) {
        fill(255, 79, 163); // pink
        noStroke();
        textSize(heartSize);
         textAlign(CENTER, CENTER);     
        text("♥", heartX, heartY);
    }
}


function CheckHeartCollection() {
    let distanceToHeart = dist(playerX, playerY, heartX, heartY);

    if (distanceToHeart < playerSize / 2 + heartSize / 2 && hasHeart === false) {
        hasHeart = true;
    }
}