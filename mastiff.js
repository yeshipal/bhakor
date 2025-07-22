let dakar;
let choiceMade = false;
let showPrompt = false;
let choice = "";

function setup() {
  createCanvas(600, 300);
  dakar = createVector(50, 200);
}

function draw() {
  background(220);

  // Draw the road
  fill(180);
  rect(0, 230, width, 10);

  // Draw Dakar
  fill(255, 100, 100);
  rect(dakar.x, dakar.y, 20, 20);

  // Move right with arrow key (stops at choice point)
  if (keyIsDown(RIGHT_ARROW) && dakar.x < 250 && !choiceMade) {
    dakar.x += 2;
  }

  // Trigger choice prompt
  if (dakar.x >= 250 && !choiceMade) {
    showPrompt = true;
  }

  // Show choice prompt
  if (showPrompt) {
    fill(255);
    rect(100, 50, 400, 100);
    fill(0);
    textSize(14);
    text("Dakar faces a decision...", 220, 80);
    text("Press LEFT for Compassion   |   RIGHT for Revenge", 140, 105);
  }

  // Show result of choice
  if (choiceMade) {
    fill(0);
    textSize(16);
    text("You chose: " + choice, 220, 80);

    if (choice === "Compassion") {
      text("Dakar shows mercy and keeps her heart.", 160, 110);
    } else if (choice === "Revenge") {
      text("Dakar wins, but at what cost?", 180, 110);
    }
  }
}

function keyPressed() {
  if (showPrompt && !choiceMade) {
    if (keyCode === LEFT_ARROW) {
      choice = "Compassion";
      choiceMade = true;
      showPrompt = false;
    } else if (keyCode === RIGHT_ARROW) {
      choice = "Revenge";
      choiceMade = true;
      showPrompt = false;
    }
  }
}
