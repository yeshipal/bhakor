let x = 80;
let y = 100;
let playerImg;
let gameStarted = false;
let opacity = 0;  // Start fully invisible

let obstacles = [
  { x: 180, y: 50, w: 10, h: 80 },
  { x: 180, y: 200, w: 10, h: 80 },
  { x: 100, y: 160, w: 10, h: 80 }
];

let goalX = 280;
let goalY = 150;

let score = 0;
let gameOver = false;

let restartButton;

function preload() {
  playerImg = loadImage("char.png");
}

function setup() {
  createCanvas(400, 300);

  // Create the restart button but hide it for now
  restartButton = createButton("Restart");
  restartButton.position(160, 180);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  background(220);

  drawMonastery(goalX, goalY);

  // Draw obstacles
  fill(255, 0, 0, 150);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, obs.w, obs.h);
  }

  // Draw player
  image(playerImg, x - 20, y - 40, 40, 60);

  // Show score
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Collisions: " + score, 10, 20);

  // Game Over logic
  if (gameOver) {
    textSize(24);
    textAlign(CENTER);
    text("Game Over", width / 2, height / 2);
    restartButton.show(); // Show restart button
    return;
  } else {
    restartButton.hide(); // Hide it during normal play
  }

  // Collision logic
  if(gameStarted)  {
      for (let obs of obstacles) {
      let charLeft = x - 20;
      let charRight = x + 20;
      let charTop = y - 40;
      let charBottom = y + 20;

      let obsRight = obs.x + obs.w;
      let obsBottom = obs.y + obs.h;

      if (
        charRight > obs.x &&
        charLeft < obsRight &&
        charBottom > obs.y &&
        charTop < obsBottom
      ) {
        score++;
        x = 80;
        y = 100;
        break;
      }
    }
  }


  if (score >= 3) {
    gameOver = true;
  }

  if (dist(x, y, goalX + 50, goalY + 40) < 30) {
    textAlign(CENTER);
    textSize(16);
    text("You reached the monastery!", width / 2, 70);
  }
}

function keyPressed() {
  if (gameOver) return;
  gameStarted = true;
  if (keyCode === RIGHT_ARROW) x += 10;
  if (keyCode === LEFT_ARROW) x -= 10;
  if (keyCode === UP_ARROW) y -= 10;
  if (keyCode === DOWN_ARROW) y += 10;
}

function restartGame() {
  score = 0;
  x = 80;
  y = 100;
  gameOver = false;
  restartButton.hide();
}

function drawMonastery(x, y) {
  fill(212, 175, 55);
  rect(x, y, 100, 80);
  fill(139, 0, 0);
  triangle(x - 10, y, x + 50, y - 50, x + 110, y);
  fill(139, 69, 19);
  rect(x + 40, y + 40, 20, 40);
  fill(255);
  rect(x + 10, y + 20, 15, 15);
  rect(x + 65, y + 20, 15, 15);
  fill(0);
  textSize(14);
  textAlign(CENTER);
  text("Monastery", x + 50, y + 100);
}
