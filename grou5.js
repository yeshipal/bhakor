let playerImg, goalImg, cutscene1Img, cutscene2Img, cutscene3Img;
let cutscene4Mike, cutscene4Yeshi, insideImg;
let player;
let goal;
let obstacles = [];
let gameState = "start";

// quiz2: three-question quiz after cutscene7
let quiz2Questions = [];
let quiz2Index = 0;
let quiz2Score = 0;

// New quiz3: three-question quiz after quiz2
let quiz3Questions = [];
let quiz3Index = 0;
let quiz3Score = 0;       

// mini-game (CSS interactive lesson)
let chosenColor = "red";    // Track chosen color
let chosenSize = "medium";  // Track chosen size, starts medium

// Leveling / XP system
let playerLevel = 1;
let playerXP = 0;
let xpToLevel = 5;
let lastLevelUpTime = 0;
let showLevelUpFlash = false;

// Mini-game state for code pieces
let codePieces = ["let", "x", "=", "10;"];
let collectedPieces = [];
let foundAllPieces = false;
let piecePositions = []; // Positions for the pieces

// ✅ Completion flags for the true ending
let completedQuiz2 = false;
let completedQuiz3 = false;
let completedMinigame = false;

function preload() {
  playerImg = loadImage('Mike.png', () => console.log('playerImg loaded'), () => console.error('playerImg failed to load: Mike.png'));
  goalImg = loadImage('Yeshihouse.jpeg', () => console.log('goalImg loaded'), () => console.error('goalImg failed to load: Yeshihouse.jpeg'));
  cutscene1Img = loadImage('Yeshi.jpg', () => console.log('cutscene1Img loaded'), () => console.error('cutscene1Img failed to load: Yeshi.jpg'));
  cutscene2Img = loadImage('Mike.png', () => console.log('cutscene2Img loaded'), () => console.error('cutscene2Img failed to load: Mike.png'));
  cutscene3Img = loadImage('Yeshi.jpg', () => console.log('cutscene3Img loaded'), () => console.error('cutscene3Img failed to load: Yeshi.jpg'));

  // Cutscene 4+ assets
  insideImg = loadImage('Inside.jpeg', () => console.log('insideImg loaded'), () => console.error('insideImg failed to load: Inside.jpeg'));
  cutscene4Mike = loadImage('Mike.png', () => console.log('cutscene4Mike loaded'), () => console.error('cutscene4Mike failed to load: Mike.png'));
  cutscene4Yeshi = loadImage('Yeshi.jpg', () => console.log('cutscene4Yeshi loaded'), () => console.error('cutscene4Yeshi failed to load: Yeshi.jpg'));
}

function setup() {
  createCanvas(600, 400);
  player = createVector(100, 200);
  goal = createVector(500, 200);

  for (let i = 0; i < 10; i++) {
    let x = random(150, 450);
    let y = random(50, 350);
    obstacles.push(createVector(x, y));
  }

  // Initialize piece positions
  for (let i = 0; i < codePieces.length; i++) {
    piecePositions.push(createVector(random(50, 550), random(50, 350)));
  }

  textFont('Arial');
  textAlign(CENTER);

  // Initialize quizzes
  quiz2Questions = [
    { q: "What does Yeshi teach Mike first?", options: ["How to cook", "How to code", "How to sleep"], correct: 1 },
    { q: "Which key moves a character left?", options: ["LEFT_ARROW", "UP_ARROW", "SPACE"], correct: 0 },
    { q: "If someone helps you, a good response is:", options: ["Run away", "Be rude", "Be grateful and learn"], correct: 2 }
  ];
  quiz3Questions = [
    { q: "What is the main character's goal?", options: ["Find shelter", "Learn to code", "Defeat a dragon"], correct: 1 },
    { q: "What shape is a pixel?", options: ["Square", "Circle", "Triangle"], correct: 0 },
    { q: "Which method adds an element to an array?", options: ["append()", "push()", "add()"], correct: 1 }
  ];
}

function draw() {
  background(220);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    drawPlayScreen();
  } else if (gameState === "cutscene1") {
    drawCutscene1();
  } else if (gameState === "cutscene2") {
    drawCutscene2();
  } else if (gameState === "cutscene3") {
    drawCutscene3();
  } else if (gameState === "quiz") {
    drawQuiz();
  } else if (gameState === "cutscene4") {
    drawCutscene4();
  } else if (gameState === "cutscene5") {
    drawCutscene5();
  } else if (gameState === "cutscene6") {
    drawCutscene6();
  } else if (gameState === "cutscene7") {
    drawCutscene7();
  } else if (gameState === "quiz2") {
    drawQuiz2();
  } else if (gameState === "quiz3") {
    drawQuiz3();
  } else if (gameState === "congratulations") {
    drawCongratulationsScreen();
  } else if (gameState === "minigame") {
    drawCodeMiniGame();
  } else if (gameState === "finale") {
    drawFinaleScreen(); // ✅ new ending screen
  }

  drawLevelUI();

  if (showLevelUpFlash && millis() - lastLevelUpTime > 1000) {
    showLevelUpFlash = false;
  }
}

///////////////
// Helper functions for consistent styling
///////////////

function drawCutsceneText(textStr) {
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);  // Set all cutscene text to a consistent size
  text(textStr, width / 2, height / 2);
}

function drawQuestionPrompt(textStr) {
  fill(255, 215, 0);
  textAlign(CENTER, TOP);
  textSize(24);  // Consistent size for question prompts
  text(textStr, width / 2, 30);
}

function drawAnswerBox(x, y, w, h, textStr) {
  fill(255);
  rect(x, y, w, h, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);  // Smaller font size for answer options
  text(textStr, x + w / 2, y + h / 2);
}

///////////////
// Drawing screens
///////////////

function drawStartScreen() {
  background(50, 100, 200);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Welcome to the Game!", width / 2, height / 2 - 20);
  textSize(20);
  text("Click to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  background(200);

  if (playerImg) {
    image(playerImg, player.x, player.y, 40, 40);
  } else {
    fill(0);
    rect(player.x, player.y, 40, 40);
  }

  if (goalImg) {
    image(goalImg, goal.x, goal.y, 60, 60);
  } else {
    fill(0, 200, 0);
    rect(goal.x, goal.y, 60, 60);
  }

  fill(0);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, 50, 20);
    if (
      player.x + 20 > obs.x &&
      player.x - 20 < obs.x + 50 &&
      player.y + 20 > obs.y &&
      player.y - 20 < obs.y + 20
    ) {
      console.log("HIT_OBS Reset player to start");
      player.set(100, 200);
    }
  }

  if (keyIsDown(LEFT_ARROW)) player.x -= 3;
  if (keyIsDown(RIGHT_ARROW)) player.x += 3;
  if (keyIsDown(UP_ARROW)) player.y -= 3;
  if (keyIsDown(DOWN_ARROW)) player.y += 3;

  player.x = constrain(player.x, 0, width - 40);
  player.y = constrain(player.y, 50, height - 40);

  let goalCenterX = goal.x + 30;
  let goalCenterY = goal.y + 30;
  // (using player top-left; works fine for 40x40)
  if (dist(player.x, player.y, goalCenterX, goalCenterY) < 40) {
    console.log("REACHED GOAL -> cutscene1");
    gameState = "cutscene1";
  }
}

function drawCutscene1() {
  if (cutscene1Img) image(cutscene1Img, width / 2 - 100, 100, 200, 200);
  drawCutsceneText("Yeshi: What are you doing in the rain?");
}

function drawCutscene2() {
  background(100);
  if (cutscene2Img) image(cutscene2Img, width / 2 - 100, 100, 200, 200);

  drawQuestionPrompt("Choose wisely!");

  let btnWidth = 220;
  let btnHeight = 50;
  let spacing = 40;
  let totalWidth = btnWidth * 2 + spacing;
  let startX = (width - totalWidth) / 2;
  let btnY = 300;

  drawAnswerBox(startX, btnY, btnWidth, btnHeight, "None of your business");
  drawAnswerBox(startX + btnWidth + spacing, btnY, btnWidth, btnHeight, "I Don't have a place to live.");
}

function drawCutscene3() {
  if (cutscene3Img) image(cutscene3Img, width / 2 - 100, 100, 200, 200);
  drawCutsceneText("Yeshi: Do you want to go to my house for shelter?");
}

function drawQuiz() {
  background(150);
  fill(255);
  rect(0, 0, width, 50);

  drawQuestionPrompt("Do you accept Yeshi's offer?");

  let btnWidth = 220;
  let btnHeight = 50;
  let spacing = 40;
  let totalWidth = btnWidth * 2 + spacing;
  let startX = (width - totalWidth) / 2;
  let btnY = 300;

  drawAnswerBox(startX, btnY, btnWidth, btnHeight, "Decline Yeshi's offer");
  drawAnswerBox(startX + btnWidth + spacing, btnY, btnWidth, btnHeight, "Accept Yeshi's offer");
}

function drawCutscene4() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80);
  }

  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  if (cutscene4Mike) {
    let w = 200;
    let h = 200;
    image(cutscene4Mike, 50, height / 2 - h / 2, w, h);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  if (cutscene4Yeshi) {
    let w = 200;
    let h = 200;
    image(cutscene4Yeshi, width - 250, height / 2 - h / 2, w, h);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  fill(255);
  rect(0, 0, width, 50);

  fill(0);
  textAlign(CENTER);
  textSize(16);
  text("You: What are you doing?", width / 2, 30);
}

function drawCutscene5() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80);
  }

  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  if (cutscene4Mike) {
    image(cutscene4Mike, 50, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  if (cutscene4Yeshi) {
    image(cutscene4Yeshi, width - 250, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("Yeshi: I'm coding. Do you know how to code?", width / 2, 30);
}

function drawCutscene6() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80);
  }

  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  if (cutscene4Mike) {
    image(cutscene4Mike, 50, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  if (cutscene4Yeshi) {
    image(cutscene4Yeshi, width - 250, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("You: No, I don't.", width / 2, 30);
}

function drawCutscene7() {
  if (insideImg) {
    image(insideImg, 0, 0, width, height);
  } else {
    background(80);
  }

  fill(0, 0, 0, 50);
  rect(0, 0, width, height);

  if (cutscene4Mike) {
    image(cutscene4Mike, 50, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(50, height / 2 - 100, 200, 200);
  }

  if (cutscene4Yeshi) {
    image(cutscene4Yeshi, width - 250, height / 2 - 100, 200, 200);
  } else {
    fill(255);
    rect(width - 250, height / 2 - 100, 200, 200);
  }

  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(16);
  text("Yeshi: Here let me teach how to.", width / 2, 30);

  textSize(12);
  text("Click to begin a short 3-question quiz", width / 2, 70);
}

function drawQuiz2() {
  background(30, 120, 80);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);

  let qObj = quiz2Questions[quiz2Index];

  drawQuestionPrompt("Question " + (quiz2Index + 1) + " of " + quiz2Questions.length);
  textSize(24);
  fill(255);
  text(qObj.q, width / 2, 120);

  let btnWidth = 180;  // Reduced button width
  let btnHeight = 40;  // Reduced button height
  let spacing = 30;    // Smaller spacing between options
  let numOptions = qObj.options.length;
  let totalWidth = btnWidth * numOptions + spacing * (numOptions - 1);
  let startX = (width - totalWidth) / 2;
  let btnY = 220;

  for (let i = 0; i < numOptions; i++) {
    drawAnswerBox(startX + i * (btnWidth + spacing), btnY, btnWidth, btnHeight, qObj.options[i]);
  }

  fill(255);
  textSize(18);
  textAlign(RIGHT, TOP);
  text("Score: " + quiz2Score, width - 20, 10);
}

function drawQuiz3() {
  background(30, 150, 100);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);

  let qObj = quiz3Questions[quiz3Index];

  drawQuestionPrompt("Question " + (quiz3Index + 1) + " of " + quiz3Questions.length);
  textSize(24);
  fill(255);
  text(qObj.q, width / 2, 120);

  let btnWidth = 180;  // Reduced button width
  let btnHeight = 40;  // Reduced button height
  let spacing = 30;    // Smaller spacing between options
  let numOptions = qObj.options.length;
  let totalWidth = btnWidth * numOptions + spacing * (numOptions - 1);
  let startX = (width - totalWidth) / 2;
  let btnY = 220;

  for (let i = 0; i < numOptions; i++) {
    drawAnswerBox(startX + i * (btnWidth + spacing), btnY, btnWidth, btnHeight, qObj.options[i]);
  }

  fill(255);
  textSize(18);
  textAlign(RIGHT, TOP);
  text("Score: " + quiz3Score, width - 20, 10);
}

function drawCongratulationsScreen() {
  background(100, 200, 150);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Congratulations!", width / 2, height / 2 - 40);
  textSize(20);
  text("You completed Yeshi’s lessons and quizzes.", width / 2, height / 2);
  text("Click to begin your first coding mini-game.", width / 2, height / 2 + 40);
}

function drawCodeMiniGame() {
  background(180, 220, 180);
  fill(255);
  rect(0, 0, width, 50);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);

  let isCorrect = false;

  if (!foundAllPieces) {
    text("Find all pieces of code!", width / 2, 30);

    for (let i = 0; i < codePieces.length; i++) {
      if (!collectedPieces.includes(codePieces[i])) {
        let pos = piecePositions[i];
        fill(200);
        rect(pos.x, pos.y, 60, 30, 5);
        fill(0);
        textSize(14);
        text(codePieces[i], pos.x + 30, pos.y + 15);
      }
    }
  } else {
    const arrangement = collectedPieces.join(" ");
    text("Arrange the pieces: " + arrangement, width / 2, 30);
    if (arrangement === "let x = 10;") {
      isCorrect = true;
      text("Correct Code!", width / 2, height - 30);
    } else {
      text("Not quite—try reordering.", width / 2, height - 30);
    }
  }

  // Finish button (enabled only if correct)
  const btnX = width / 2 - 60, btnY = height - 64, btnW = 120, btnH = 44;
  if (isCorrect) {
    fill(70, 180, 90);  // green when enabled
  } else {
    fill(180);          // gray when disabled
  }
  rect(btnX, btnY, btnW, btnH, 10);
  fill(0);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Finish", width / 2, btnY + btnH / 2);
}

function drawLevelUI() {
  fill(0);
  textSize(16);
  textAlign(LEFT, TOP);
  text(`Level: ${playerLevel}  XP: ${playerXP} / ${xpToLevel}`, 10, 10);

  if (showLevelUpFlash) {
    push();
    textAlign(CENTER, CENTER);
    // outlined for readability
    stroke(0, 180);
    strokeWeight(6);
    fill(255, 215, 0, 230);
    textSize(48);
    text("LEVEL UP!", width / 2, height / 2);
    pop();
  }
}

// ✅ New: Finale screen that states the story clearly
function drawFinaleScreen() {
  background(30, 45, 60);

  // Soft panel
  noStroke();
  fill(255, 255, 255, 16);
  rect(0, 0, width, height);
  fill(255);
  rect(width/2 - 260, 70, 520, 220, 12);

  // Title
  fill(0);
  textAlign(CENTER, TOP);
  textSize(24);
  text("Yeshi’s Compassion • Mike’s Success", width/2, 90);

  // Story wrap
  textSize(15);
  text(
    "Guided by Yeshi’s kindness and patient mentorship, Mike learned to code,\n" +
    "passed the quizzes, and completed his first program.\n\n" +
    "What began as shelter in the rain became a new life—\n" +
    "proof that compassion and skill can lift someone from destitution\n" +
    "to dignity and purpose.",
    width/2, 130
  );

  // Stats line (optional)
  textSize(13);
  text(`Quizzes: ${quiz2Score}/${quiz2Questions.length} & ${quiz3Score}/${quiz3Questions.length}   •   Level ${playerLevel}`, width/2, 230);

  // Restart hint
  textSize(16);
  text("Click anywhere to play again", width/2, 268);
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "cutscene1") {
    gameState = "cutscene2";
  } else if (gameState === "cutscene2") {
    let btnWidth = 220;
    let btnHeight = 50;
    let spacing = 40;
    let totalWidth = btnWidth * 2 + spacing;
    let startX = (width - totalWidth) / 2;
    let btnY = 300;

    if (mouseX > startX && mouseX < startX + btnWidth && mouseY > btnY && mouseY < btnY + btnHeight) {
      // Wrong choice, restart to start
      player.set(100, 200);
      gameState = "start";
    } else if (mouseX > startX + btnWidth + spacing && mouseX < startX + btnWidth * 2 + spacing && mouseY > btnY && mouseY < btnY + btnHeight) {
      gameState = "cutscene3";
    }
  } else if (gameState === "cutscene3") {
    gameState = "quiz";
  } else if (gameState === "quiz") {
    let btnWidth = 220;
    let btnHeight = 50;
    let spacing = 40;
    let totalWidth = btnWidth * 2 + spacing;
    let startX = (width - totalWidth) / 2;
    let btnY = 300;

    if (mouseX > startX && mouseX < startX + btnWidth && mouseY > btnY && mouseY < btnY + btnHeight) {
      // Decline Yeshi's offer, restart game
      player.set(100, 200);
      gameState = "start";
    } else if (mouseX > startX + btnWidth + spacing && mouseX < startX + btnWidth * 2 + spacing && mouseY > btnY && mouseY < btnY + btnHeight) {
      gameState = "cutscene4";
    }
  } else if (gameState === "cutscene4") {
    gameState = "cutscene5";
  } else if (gameState === "cutscene5") {
    gameState = "cutscene6";
  } else if (gameState === "cutscene6") {
    gameState = "cutscene7";
  } else if (gameState === "cutscene7") {
    quiz2Index = 0;
    quiz2Score = 0;
    gameState = "quiz2";
  } else if (gameState === "quiz2") {
    // Quiz 2 answer buttons
    let qObj = quiz2Questions[quiz2Index];
    let btnWidth = 180;
    let btnHeight = 40;
    let spacing = 30;
    let numOptions = qObj.options.length;
    let totalWidth = btnWidth * numOptions + spacing * (numOptions - 1);
    let startX = (width - totalWidth) / 2;
    let btnY = 220;

    for (let i = 0; i < numOptions; i++) {
      let x = startX + i * (btnWidth + spacing);
      if (mouseX > x && mouseX < x + btnWidth && mouseY > btnY && mouseY < btnY + btnHeight) {
        if (i !== qObj.correct) {
          // Wrong answer, restart game
          player.set(100, 200);
          gameState = "start";
        } else {
          quiz2Score++;
          playerXP++;
          if (playerXP >= xpToLevel) {
            playerLevel++;
            playerXP = 0;
            showLevelUpFlash = true;
            lastLevelUpTime = millis();
          }
          quiz2Index++;
          if (quiz2Index >= quiz2Questions.length) {
            completedQuiz2 = true; // ✅ mark completion of quiz2
            // Move to quiz3
            quiz3Index = 0;
            quiz3Score = 0;
            gameState = "quiz3";
          }
        }
        break;
      }
    }
  } else if (gameState === "quiz3") {
    // Quiz 3 answer buttons
    let qObj = quiz3Questions[quiz3Index];
    let btnWidth = 180;
    let btnHeight = 40;
    let spacing = 30;
    let numOptions = qObj.options.length;
    let totalWidth = btnWidth * numOptions + spacing * (numOptions - 1);
    let startX = (width - totalWidth) / 2;
    let btnY = 220;

    for (let i = 0; i < numOptions; i++) {
      let x = startX + i * (btnWidth + spacing);
      if (mouseX > x && mouseX < x + btnWidth && mouseY > btnY && mouseY < btnY + btnHeight) {
        if (i !== qObj.correct) {
          // Wrong answer, restart game
          player.set(100, 200);
          gameState = "start";
        } else {
          quiz3Score++;
          playerXP++;
          if (playerXP >= xpToLevel) {
            playerLevel++;
            playerXP = 0;
            showLevelUpFlash = true;
            lastLevelUpTime = millis();
          }
          quiz3Index++;
          if (quiz3Index >= quiz3Questions.length) {
            completedQuiz3 = true; // ✅ mark completion of quiz3
            gameState = "congratulations";
          }
        }
        break;
      }
    }
  } else if (gameState === "congratulations") {
    gameState = "minigame";
  } else if (gameState === "minigame") {
    // Detect clicks on code pieces
    if (!foundAllPieces) {
      for (let i = 0; i < codePieces.length; i++) {
        let pos = piecePositions[i];
        if (mouseX > pos.x && mouseX < pos.x + 60 && mouseY > pos.y && mouseY < pos.y + 30) {
          if (!collectedPieces.includes(codePieces[i])) {
            collectedPieces.push(codePieces[i]);
            if (collectedPieces.length >= codePieces.length) {
              foundAllPieces = true;
            }
          }
        }
      }
    }

    // ✅ Check for Finish button click (only completes when correct)
    const btnX = width / 2 - 60, btnY = height - 64, btnW = 120, btnH = 44;
    const clickedFinish = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

    if (clickedFinish) {
      const arrangement = collectedPieces.join(" ");
      if (foundAllPieces && arrangement === "let x = 10;") {
        completedMinigame = true; // mark mini-game completion
        if (completedQuiz2 && completedQuiz3 && completedMinigame) {
          gameState = "finale"; // 🎉 true ending
        }
      } else {
        console.log("Finish is unlocked once the code reads: let x = 10;");
      }
    }
  } else if (gameState === "finale") {
    // Soft reset for a fresh run
    player.set(100, 200);

    // reset quizzes
    quiz2Index = quiz3Index = 0;
    quiz2Score = quiz3Score = 0;

    // reset mini-game
    collectedPieces = [];
    foundAllPieces = false;

    // re-scatter mini-game pieces
    piecePositions = [];
    for (let i = 0; i < codePieces.length; i++) {
      piecePositions.push(createVector(random(50, 550), random(50, 350)));
    }

    // reset finale flags
    completedQuiz2 = completedQuiz3 = completedMinigame = false;

    // back to start
    gameState = "start";
  }
}

