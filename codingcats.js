let methok;
let methokImg; // Optional image
let coins = [];
let score = 0;
let messages = [
  "Left her village",
  "Climbed the mountain",
  "Crossed a river",
  "Found a new home"
];

function preload() {
  // methokImg = loadImage('methok.png'); // Optional: Add your own image here
}

function setup() {
  createCanvas(600, 400);
  methok = createVector(50, height / 2);

  // Create 4 coin positions (can add more)
  coins = [
    { x: 150, y: 100, collected: false },
    { x: 300, y: 200, collected: false },
    { x: 450, y: 150, collected: false },
    { x: 550, y: 300, collected: false }
  ];
}

function draw() {
  background(220);

  // Draw player (Methok)
  fill(255, 100, 100);
  ellipse(methok.x, methok.y, 30, 30);
  // image(methokImg, methok.x, methok.y, 30, 30); // Use if image added

  // Move player
  if (keyIsDown(LEFT_ARROW)) methok.x -= 2;
  if (keyIsDown(RIGHT_ARROW)) methok.x += 2;
  if (keyIsDown(UP_ARROW)) methok.y -= 2;
  if (keyIsDown(DOWN_ARROW)) methok.y += 2;

  // Keep player on screen
  methok.x = constrain(methok.x, 0, width);
  methok.y = constrain(methok.y, 0, height);

  // Draw and check coin collection
  for (let i = 0; i < coins.length; i++) {
    if (!coins[i].collected) {
      fill(255, 215, 0);
      ellipse(coins[i].x, coins[i].y, 20, 20);
      if (dist(methok.x, methok.y, coins[i].x, coins[i].y) < 20) {
        coins[i].collected = true;
        score++;
        console.log(messages[i]); // You can display this on screen too
      }
    }
  }

  // Display score
  fill(0);
  textSize(16);
  text("Coins Collected: " + score, 20, 30);

  // Show win message
  if (score === coins.length) {
    textSize(24);
    fill(0, 150, 0);
    text("You completed Methok's journey!", 100, height / 2);
  }
}
