let player;
let gravity = 0.5;
let jumpStrength = -10;
let velocityY = 0;
let isOnGround = false;

let platforms = [];
let compassionStopX = 300;
let showCompassionPrompt = false;
let promptAnswered = false;

function setup() {
  createCanvas(600, 400);
  player = createVector(50, 300);

  // Create some platforms
  platforms.push({ x: 0, y: 350, w: 600, h: 50 }); // ground
  platforms.push({ x: 200, y: 250, w: 100, h: 10 });
  platforms.push({ x: 400, y: 200, w: 100, h: 10 });
}

function draw() {
  background(220);

  // Gravity
  velocityY += gravity;
  player.y += velocityY;

  // Movement
  if (keyIsDown(LEFT_ARROW)) player.x -= 3;
  if (keyIsDown(RIGHT_ARROW)) player.x += 3;

  // Check platform collisions
  isOnGround = false;
  for (let plat of platforms) {
    fill(150);
    rect(plat.x, plat.y, plat.w, plat.h);
    if (player.y + 30 >= plat.y && player.y + 30 <= plat.y + 10 &&
        player.x + 15 > plat.x && player.x - 15 < plat.x + plat.w) {
      player.y = plat.y - 30;
      velocityY = 0;
      isOnGround = true;
    }
  }

  // Draw player
  fill(100, 180, 255);
  ellipse(player.x, player.y, 30, 30);

  // Trigger compassion prompt
  if (abs(player.x - compassionStopX) < 30 && !promptAnswered) {
    showCompassionPrompt = true;
  }

  if (showCompassionPrompt) {
    fill(255);
    rect(50, 50, 500, 100);
    fill(0);
    textSize(14);
    text("A stranger is hurt on the road. Do you stop to help?", 70, 80);
    text("Press 'Y' to show compassion or 'N' to ignore.", 70, 100);
  }

  // Level message
  if (promptAnswered) {
    fill(0, 150, 0);
    textSize(16);
    text("You chose compassion. The world needs more of that.", 120, 60);
  }

  // Keep player in canvas
  player.x = constrain(player.x, 0, width);
}

function keyPressed() {
  if (key === " " && isOnGround) {
    velocityY = jumpStrength;
  }

  if (showCompassionPrompt && !promptAnswered) {
    if (key === "y" || key === "Y") {
      promptAnswered = true;
      showCompassionPrompt = false;
    } else if (key === "n" || key === "N") {
      showCompassionPrompt = false;
      // Optional: show consequence or restart
    }
  }
}
