let tenzin;
let friends = [];
let chip;
let score = 0;
let chipCollected = false;
let message = "";
let levelComplete = false;

function setup() {
  createCanvas(600, 400);
  tenzin = createVector(50, height / 2);

  // Two friends: exile + inside Tibet
  friends = [
    {
      x: 150, y: 100,
      collected: false,
      name: "Sonam",
      location: "Exile – Dharamsala",
      message: "I'm ready to help share our stories from exile."
    },
    {
      x: 250, y: 200,
      collected: false,
      name: "Lhamo",
      location: "Inside Tibet – Lhasa",
      message: "This truth must reach the world, even if they watch me."
    }
  ];

  chip = { x: 500, y: 300, collected: false };
}

function draw() {
  background(230);

  // Draw Tenzin
  fill(100, 150, 255);
  ellipse(tenzin.x, tenzin.y, 30, 30);

  moveTenzin();

  // Draw and collect friends
  for (let i = 0; i < friends.length; i++) {
    let f = friends[i];
    if (!f.collected) {
      fill(200, 100, 255);
      ellipse(f.x, f.y, 25, 25);
      if (dist(tenzin.x, tenzin.y, f.x, f.y) < 25) {
        f.collected = true;
        score++;
        message = `${f.name} (${f.location}): ${f.message}`;
        setTimeout(() => { message = ""; }, 4000);
      }
    }
  }

  // Draw and collect chip only after both friends are found
  if (score === friends.length && !chip.collected) {
    fill(255, 215, 0);
    rect(chip.x, chip.y, 20, 20);
    if (dist(tenzin.x, tenzin.y, chip.x, chip.y) < 25) {
      chip.collected = true;
      levelComplete = true;
      message = "The chip is secured. The digital resistance begins.";
    }
  }

  // Display message if any
  if (message !== "") {
    fill(0);
    textSize(14);
    text(message, 40, height - 30);
  }

  // Score
  fill(0);
  textSize(16);
  text("Allies Connected: " + score + " / " + friends.length, 20, 30);

  // Completion message
  if (levelComplete) {
    fill(0, 150, 0);
    textSize(18);
    text("Voices of Tibet: Level 1 Complete!", 140, height / 2);
    text("Despite distance and danger, unity is forged.", 120, height / 2 + 30);
  }
}

function moveTenzin() {
  if (keyIsDown(LEFT_ARROW)) tenzin.x -= 2;
  if (keyIsDown(RIGHT_ARROW)) tenzin.x += 2;
  if (keyIsDown(UP_ARROW)) tenzin.y -= 2;
  if (keyIsDown(DOWN_ARROW)) tenzin.y += 2;
  tenzin.x = constrain(tenzin.x, 0, width);
  tenzin.y = constrain(tenzin.y, 0, height);
}
