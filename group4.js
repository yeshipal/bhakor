// =========================
// Methok — A Three-Chapter Story Game
// (p5.js)
// =========================

// --- Assets & sprites ---
let methok;       // Methok.png
let coinImg;      // Coin.png
let bgImage;      // background.png (village); optional; we draw fallbacks too
let beggarImg;    // optional: 'beggar.png' (will fallback if missing)

// --- World / player ---
let gameState = "start";  // "start" | "play" | "success"
let chapter = 1;          // 1 | 2 | 3
let player = { x: 20, y: 315, size: 40 };

// --- Coins (reused per chapter) ---
let coins = [];           // each: {x, y, collected, msg?}

// --- UI messages (non-blocking overlay) ---
let showMessage = false;
let messageTimer = 0;
let currentMessage = "";
let _msgToken = 0;        // prevent older timers from clearing newer messages

// --- Chapter 1: Village & Kindness ---
let beggar = { x: 500, y: 290, w: 50, h: 60, fed: 0, revealed: false };

// --- Chapter 2: MIT & AI Ulcer Detection ---
let labArea = { x: 430, y: 60, w: 150, h: 110 };
let aiBuilt = false;

// --- Chapter 3: Return to Tibet, Tibetan ChatGPT ---
let buildSteps = 0; // 0: none, 1: servers, 2: data, 3: train (done)

// =========================
//  Lifecycle
// =========================
function preload() {
  // Core sprites (use your filenames; fallback safe)
  methok = loadImage("Methok.png");
  coinImg = loadImage("Coin.png");
  bgImage = loadImage("background.png");
  // Optional: a beggar sprite
  beggarImg = loadImage("beggar.png", () => {}, () => { beggarImg = null; });
}

function setup() {
  createCanvas(600, 400);
  noSmooth();

  // Start with chapter 1 setup
  setupChapter1();
}

function draw() {
  if (gameState === "start") {
    showStartScreen();
    return;
  }

  if (gameState === "success") {
    drawSuccessScreen();
    return;
  }

  // --- PLAY state ---
  // Background (fallback color if image missing)
  if (chapter === 1) {
    if (bgImage && bgImage.width) image(bgImage, 0, 0, width, height);
    else background(70, 110, 140); // village-ish fallback
  } else if (chapter === 2) {
    background(190, 210, 230);     // MIT-ish campus
  } else if (chapter === 3) {
    background(180, 220, 200);     // green-ish, home return
  }

  // Chapter routing
  if (chapter === 1) {
    drawChapter1();
  } else if (chapter === 2) {
    drawChapter2();
  } else if (chapter === 3) {
    drawChapter3();
  }

  // Player (on top of world elements)
  drawPlayer();

  // HUD / Overlay message
  drawOverlayMessage();
  drawHUD();
}

// =========================
//  Start / Success Screens
// =========================
function showStartScreen() {
  background(50, 100, 150);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Methok's Journey", width / 2, height / 2 - 40);
  textSize(16);
  text("Press any key (or click) to Start", width / 2, height / 2 + 20);
  textSize(12);
  text("Move with arrow keys", width / 2, height / 2 + 50);
}

function drawSuccessScreen() {
  background(15, 30, 20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("Success!", width/2, height/2 - 40);
  textSize(16);
  text("Methok brought investment and built a Tibetan-language ChatGPT.\nHope, access, and education are growing across remote regions.", width/2, height/2 + 10);
  text("(Press any key to replay)", width/2, height/2 + 60);
}

// =========================
//  Chapters — Setup
// =========================
function setupChapter1() {
  chapter = 1;
  player.x = 40; player.y = 315;
  beggar = { x: 500, y: 290, w: 50, h: 60, fed: 0, revealed: false };

  // Coins = little kindness/story beats in the village
  coins = [
    { x: 60,  y: 300, collected: false, msg: "In a humble Tibetan village, Methok helps wherever she can." },
    { x: 230, y: 190, collected: false, msg: "Each day, she chooses kindness despite scarcity." },
    { x: 200, y: 125, collected: false, msg: "Her dream of education feels distant, but not impossible." },
  ];

  aiBuilt = false;
  buildSteps = 0;
  showMsg("Chapter 1: Kindness in the village — Feed the beggar (F) three times.", 3500);
}

function setupChapter2() {
  chapter = 2;
  player.x = 60; player.y = 300;
  aiBuilt = false;

  // Research tokens to collect at MIT
  coins = [
    { x: 120, y: 310, collected: false, msg: "Scholarship secured—time to study hard at MIT." },
    { x: 270, y: 325, collected: false, msg: "Reading papers late into the night…" },
    { x: 230, y: 190, collected: false, msg: "Mentors guide her toward medical AI." },
    { x: 300, y: 291, collected: false, msg: "Early prototype for ulcer detection improves." },
    { x: 200, y: 150, collected: false, msg: "Clinical partners validate early results!" },
  ];

  showMsg("Chapter 2: MIT & AI for stomach-ulcer detection — Collect 5 research tokens. Then press B in the Lab.", 4600);
}

function setupChapter3() {
  chapter = 3;
  player.x = 60; player.y = 315;
  buildSteps = 0;

  // Some coins for local support / community stories (optional)
  coins = [
    { x: 160, y: 300, collected: false, msg: "Returning home with knowledge and humility." },
    { x: 260, y: 230, collected: false, msg: "Community centers are opening for students." },
    { x: 360, y: 180, collected: false, msg: "Connectivity projects now reach remote villages." },
  ];

  showMsg("Chapter 3: Return to Tibet — Build a Tibetan ChatGPT (S: Servers, D: Data, T: Train).", 4600);
}

// =========================
//  Chapters — Draw
// =========================
function drawChapter1() {
  // Ground line
  stroke(0, 40); line(0, 350, width, 350); noStroke();

  // Beggar
  drawBeggar(beggar.x, beggar.y, beggar.w, beggar.h, beggarImg);

  // Prompt near beggar
  const nearBeggar = dist(player.x + 20, player.y + 20, beggar.x + beggar.w/2, beggar.y + beggar.h/2) < 70;
  if (nearBeggar) {
    drawPrompt("Press F to give food");
  }

  // Coins (village micro-messages)
  drawCoins(); // uses global coins and messages

  // Reveal + transition text
  if (beggar.fed >= 3 && !beggar.revealed) {
    beggar.revealed = true;
    showMsg("Revealed: The beggar is Bill Gates in disguise.\nMoved by Methok’s values, he sponsors her to study at MIT.", 5000);
  }

  if (beggar.revealed) {
    drawBanner("Press N to travel to MIT (Chapter 2)");
  }
}

function drawChapter2() {
  // Draw a simple "Lab" building area (top-right)
  push();
  fill(35, 60, 110); noStroke();
  rect(labArea.x, labArea.y, labArea.w, labArea.h, 8);
  fill(255); textSize(12); textAlign(CENTER, TOP);
  text("LAB", labArea.x + labArea.w/2, labArea.y + 6);
  pop();

  drawCoins(); // research tokens & messages

  const nearLab = pointInRect(player.x + 20, player.y + 20, labArea);
  if (nearLab && allCoinsCollected()) {
    drawPrompt("Press B to build AI ulcer-detection");
  }

  if (aiBuilt) {
    drawBanner("Offers arrive: Meta, X, OpenAI.\nPress N to return to Tibet (Chapter 3).");
  }
}

function drawChapter3() {
  // Simple "Server room" panel on right
  const panel = { x: 420, y: 80, w: 140, h: 200 };
  push();
  fill(30); rect(panel.x, panel.y, panel.w, panel.h, 10);
  fill(140); rect(panel.x + 10, panel.y + 14, panel.w - 20, 24, 5);
  fill(90); rect(panel.x + 10, panel.y + 50, panel.w - 20, 24, 5);
  fill(60); rect(panel.x + 10, panel.y + 86, panel.w - 20, 24, 5);
  fill(255); textAlign(CENTER, TOP); textSize(12);
  text("SERVERS", panel.x + panel.w/2, panel.y + 12);
  text("DATA",    panel.x + panel.w/2, panel.y + 48);
  text("TRAIN",   panel.x + panel.w/2, panel.y + 84);
  pop();

  drawCoins(); // community updates & messages

  // Instructions ribbon
  push();
  fill(255); textSize(13); textAlign(LEFT, TOP);
  text("Tasks: S = Start servers, D = Download Tibetan text data, T = Train model", 14, 14);
  pop();

  // Progress meter
  drawProgress("ChatGPT (Tibetan) Build Progress", buildSteps, 3, 16, 44, 320, 12);

  if (buildSteps >= 3) {
    drawBanner("Project complete! Press N to finish the game.");
  }
}

// =========================
//  Draw helpers
// =========================
function drawPlayer() {
  let nextX = player.x, nextY = player.y;
  if (keyIsDown(LEFT_ARROW))  nextX -= 2;
  if (keyIsDown(RIGHT_ARROW)) nextX += 2;
  if (keyIsDown(UP_ARROW))    nextY -= 2;
  if (keyIsDown(DOWN_ARROW))  nextY += 2;

  player.x = constrain(nextX, 0, width - player.size);
  player.y = constrain(nextY, 0, height - player.size);

  if (methok && methok.width) {
    image(methok, player.x, player.y, player.size, player.size);
  } else {
    // Fallback circle
    fill(255); ellipse(player.x + 20, player.y + 20, player.size);
  }
}

function drawCoins() {
  for (let i = 0; i < coins.length; i++) {
    const c = coins[i];
    if (!c.collected) {
      if (coinImg && coinImg.width) image(coinImg, c.x, c.y, 30, 30);
      else { fill(255, 215, 0); ellipse(c.x + 15, c.y + 15, 24); }

      if (dist(player.x, player.y, c.x, c.y) < 30) {
        c.collected = true;
        if (c.msg) showMsg(c.msg, 2600);
      }
    }
  }
}

function drawBeggar(x, y, w, h, img) {
  if (img && img.width) {
    image(img, x, y, w, h);
  } else {
    // fallback: a seated figure
    push();
    fill(120, 80, 60);
    rect(x, y + h/2, w, h/2, 8);
    fill(230, 200, 180);
    ellipse(x + w/2, y + h/2, h/2);
    pop();
  }
  // label
  push();
  fill(0); textSize(12); textAlign(CENTER, BOTTOM);
  text("Beggar", x + w/2, y - 6);
  pop();
}

function drawPrompt(txt) {
  push();
  fill(0, 0, 0, 140); noStroke();
  rect(14, height - 70, width - 28, 50, 10);
  fill(255); textAlign(CENTER, CENTER); textSize(14);
  text(txt, width/2, height - 45);
  pop();
}

function drawBanner(txt) {
  push();
  fill(0, 150, 0);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(txt, width/2, 60);
  pop();
}

function drawProgress(label, step, total, x, y, w, h) {
  push();
  fill(255); textSize(12); textAlign(LEFT, BOTTOM);
  text(label, x, y - 6);
  noStroke();
  fill(240); rect(x, y, w, h, 6);
  fill(60, 180, 90);
  const ww = map(step, 0, total, 0, w);
  rect(x, y, ww, h, 6);
  pop();
}

function drawOverlayMessage() {
  if (showMessage) {
    if (millis() > messageTimer) {
      showMessage = false;
      currentMessage = "";
    } else {
      // wrapped message box
      const boxW = Math.min(520, width - 40);
      const boxH = 64;
      const boxX = (width - boxW) / 2;
      const boxY = height - boxH - 10;

      push();
      noStroke(); fill(0, 0, 0, 150);
      rect(boxX, boxY, boxW, boxH, 10);

      fill(255); textAlign(CENTER, CENTER); textSize(14);
      textWrap(WORD);
      text(currentMessage, boxX + 10, boxY + 8, boxW - 20, boxH - 16);
      pop();
    }
  }
}

function drawHUD() {
  push();
  fill(255); textSize(12); textAlign(LEFT, TOP);
  text("Chapter: " + chapter, 10, 10);
  if (chapter === 1) {
    text("Goal: Feed beggar (F) three times", 10, 26);
  } else if (chapter === 2) {
    text("Goal: Collect 5 tokens, then B in Lab", 10, 26);
  } else if (chapter === 3) {
    text("Goal: S, D, T to finish Tibetan ChatGPT", 10, 26);
  }
  pop();
}

// =========================
 //  Message helper (no loop-func warning)
// =========================
function showMsg(text, ms = 2000) {
  _msgToken++;
  const token = _msgToken;
  currentMessage = text;
  showMessage = true;
  messageTimer = millis() + ms;

  // (No setTimeout – we use millis() in drawOverlayMessage)
}

// =========================
//  Input
// =========================
function keyPressed() {
  if (gameState === "start") {
    gameState = "play";
    return;
  }
  if (gameState === "success") {
    // replay
    gameState = "play";
    setupChapter1();
    return;
  }

  // CHAPTER 1 actions
  if (chapter === 1) {
    const nearBeggar = dist(player.x + 20, player.y + 20, beggar.x + beggar.w/2, beggar.y + beggar.h/2) < 70;
    if (nearBeggar && (key === 'f' || key === 'F')) {
      beggar.fed++;
      showMsg("Methok shares a warm meal. (" + beggar.fed + "/3)", 1500);
      if (beggar.fed === 3) {
        // reveal handled in draw loop; extra cue here:
        showMsg("A grateful smile… something is different about him.", 2200);
      }
    }
    if (beggar.revealed && (key === 'n' || key === 'N')) {
      setupChapter2();
    }
  }

  // CHAPTER 2 actions
  if (chapter === 2) {
    const nearLab = pointInRect(player.x + 20, player.y + 20, labArea);
    if (!aiBuilt && allCoinsCollected() && nearLab && (key === 'b' || key === 'B')) {
      aiBuilt = true;
      showMsg("AI ulcer detection built! Early treatment can save lives.", 3600);
      showMsg("Job offers: Meta, X, OpenAI—but Methok is thinking of home…", 4200);
    }
    if (aiBuilt && (key === 'n' || key === 'N')) {
      setupChapter3();
    }
  }

  // CHAPTER 3 actions
  if (chapter === 3) {
    if (buildSteps < 1 && (key === 's' || key === 'S')) {
      buildSteps = 1;
      showMsg("Servers online across remote hubs.", 2000);
    } else if (buildSteps < 2 && (key === 'd' || key === 'D')) {
      buildSteps = 2;
      showMsg("Downloading Tibetan texts and educational resources.", 2400);
    } else if (buildSteps < 3 && (key === 't' || key === 'T')) {
      buildSteps = 3;
      showMsg("Training complete! A Tibetan-language ChatGPT is ready.", 2600);
    }
    if (buildSteps >= 3 && (key === 'n' || key === 'N')) {
      gameState = "success";
    }
  }
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "success") {
    gameState = "play";
    setupChapter1();
  }
}

// =========================
//  Small utilities
// =========================
function pointInRect(px, py, r) {
  return px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h;
}

function allCoinsCollected() {
  return coins.length > 0 && coins.every(c => c.collected);
}
