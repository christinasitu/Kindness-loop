//Game State
let gameState = "playing"; // either "playing" or "gameOver" 
let score = 0;

//Setup on start
function setup() {
    let canvas = createCanvas(500, 500);
    canvas.parent("game-container");
}

//  Main game loop
function draw() {
    background(0); // black background

    if (gameState === "playing") {
        drawUI();
    }
    if (gameState === "gameOver") {
 drawGameOver();
    }
}

function drawUI() {
    fill(255, 79, 163); // pink
    textSize(18);
    text("Score: " + score, 20, 20);
}

function drawGameOver() {
    fill(255, 79, 163); // pink
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Game Over", width / 2, height / 2);
    textSize(16);
    text("Press SPACE to Restart", width / 2, height / 2 + 40);

}