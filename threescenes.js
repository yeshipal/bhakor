let gameState = "start";

let player;
let goal;

function setup() {
  createCanvas(600, 400);
  player = createVector(100, 200);
  goal = createVector(500, 200);
}

function draw() {
  background(220);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    drawPlayScreen();
  } else if (gameState === "win") {
    drawWinScreen();
  }
}

function drawStartScreen() {
  background(50, 100, 200);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("Welcome to the Game!", width / 2, height / 2 - 20);
  textSize(20);
  text("Click to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  background(200);

  // Draw player
  fill(255, 0, 0);
  ellipse(player.x, player.y, 40, 40);

  // Draw goal
  fill(0, 255, 0);
  rect(goal.x, goal.y, 40, 40);

  // Move with arrow keys
  if (keyIsDown(LEFT_ARROW)) player.x -= 3;
  if (keyIsDown(RIGHT_ARROW)) player.x += 3;
  if (keyIsDown(UP_ARROW)) player.y -= 3;
  if (keyIsDown(DOWN_ARROW)) player.y += 3;

  // Check win condition
  if (dist(player.x, player.y, goal.x + 20, goal.y + 20) < 30) {
    gameState = "win";
  }
}

function drawWinScreen() {
  background(0, 200, 100);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("🎉 You Reached the Goal! 🎉", width / 2, height / 2);
  textSize(20);
  text("Click to Restart", width / 2, height / 2 + 40);
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "win") {
    // Reset game
    player.set(100, 200);
    gameState = "start";
  }
}
