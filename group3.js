// =========================
//  GLOBAL STATE & ASSETS
// =========================
let tenzin; // position vector for player sprite
let tenzinImg, LhamoImg, sonamImg, chipImg, wireImg, coinImg, bgImage;

let currentLevel = 1;
let levelComplete = false;
let message = "";

// ---------- Level 1 (Friends + Chip) ----------
let friends = [];
let chip;
let score = 0; // re-used per level: allies in L1, coins in L3

// ---------- Level 2 (Conversation) ----------
let talking = false;
let conversationStage = 0;
let canTalk = false;
let currentNPC = null;
let npcs = [
  { name: 'Lhamo', x: 340, y: 110, img: null },
  { name: 'Sonam', x: 420, y: 220, img: null }
];
let convoDone = { Lhamo:false, Sonam:false };

// ---------- Level 3 (Wires + Coins + Shop) ----------
let wires = [];
let wiresCollected = 0;
let coins = [];
let shop = { x: 500, y: 40, w: 80, h: 80 };
let hasBoughtComputer = false;

// ---------- Level 4 (Computer + Website Build) ----------
let l4Step = 0;                 // conversation step (0..)
let l4WebsiteStage = 0;         // 0 none, 1 frame, 2 title, 3 headlines, 4 published
let gameWon = false;

const l4Dialog = [
  "Lhamo: The world must hear what’s happening inside Tibet.",
  "Sonam: A website can carry stories past any border.",
  "Tenzin: Let's build it together—clear, truthful, and safe."
];

const l4Headlines = [
  "Monasteries under surveillance; elders detained for \"reeducation\"",
  "Glaciers receding—new dams threaten river lifelines",
  "Language classes replaced; Tibetan teachers sidelined",
  "Nomadic families displaced from ancestral grasslands",
  "Internet blackouts hide protests and mass arrests"
];

let _msgToken = 0;       // prevents older timeouts from clearing newer messages

function showMessage(text, ms = 2000) {
  _msgToken++;                   // new message = new token
  const token = _msgToken;       // capture token for this call
  message = text;
  setTimeout(() => {
    if (token === _msgToken) {   // only clear if still the latest message
      message = "";
    }
  }, ms);
}
// =========================
//  LIFECYCLE
// =========================
function preload() {
  tenzinImg = loadImage("tenzin.png");
  LhamoImg = loadImage("Lhamo.png");
  sonamImg  = loadImage("sonam.png");
  chipImg   = loadImage("chip.png");
  wireImg   = loadImage("wire.png");
  coinImg   = loadImage("coin.png");
  bgImage   = loadImage("background.jpg"); // used in Level 2
}

function setup() {
  createCanvas(600, 400);

  if      (currentLevel === 1) setupLevel1();
  else if (currentLevel === 2) setupLevel2Conversation();
  else if (currentLevel === 3) setupLevel3();
  else if (currentLevel === 4) setupLevel4();
}

function draw() {
  if      (currentLevel === 1) drawLevel1();
  else if (currentLevel === 2) drawLevel2Conversation();
  else if (currentLevel === 3) drawLevel3();
  else if (currentLevel === 4) drawLevel4();
}

// =========================
//  LEVEL 1 — FRIENDS + CHIP
// =========================
function setupLevel1() {
  tenzin = createVector(50, height / 2);
  friends = [
    { x: 150, y: 100, collected: false, name: "Sonam", location: "Exile – Dharamsala", message: "I'm ready to help share our stories from exile." },
    { x: 250, y: 200, collected: false, name: "Lhamo", location: "Inside Tibet – Gyantse", message: "This truth must reach the world, even if they watch me." }
  ];
  chip = { x: 500, y: 300, collected: false };
  score = 0;
  message = "";
  levelComplete = false;
}

function drawLevel1() {
  background(230);
  image(tenzinImg, tenzin.x, tenzin.y, 80, 80);
  moveTenzin();

  // Draw & collect friends
  for (let i = 0; i < friends.length; i++) {
    const f = friends[i];
    if (!f.collected) {
      if (f.name === "Sonam") image(sonamImg,  f.x, f.y, 70, 80);
      if (f.name === "Lhamo") image(LhamoImg, f.x, f.y, 80, 80);

      if (dist(tenzin.x, tenzin.y, f.x, f.y) < 25) {
        f.collected = true;
        score++;
        showMessage(`${f.name} (${f.location}): ${f.message}`, 4000);
      }
    }
  }

  // Chip appears after both friends are found
  if (score === friends.length && !chip.collected) {
    image(chipImg, chip.x, chip.y, 40, 40);
    if (dist(tenzin.x, tenzin.y, chip.x, chip.y) < 25) {
      chip.collected = true;
      levelComplete = true;
      message = "The chip is secured. The digital resistance begins.";
    }
  }

  // HUD
  if (message) {
    fill(0); textSize(14);
    text(message, 40, height - 30);
  }
  fill(0); textSize(16);
  text("Allies Connected: " + score + " / " + friends.length, 20, 30);

  // Complete banner
  if (levelComplete) {
    fill(0, 150, 0);
    textSize(18); textAlign(CENTER);
    text("Voices of Tibet: Level 1 Complete!", width / 2, height / 2);
    text("You've gathered your friends and the chip!", width / 2, height / 2 + 30);
    text("Click to continue to Level 2.", width / 2, height / 2 + 60);
    textAlign(LEFT);
  }
}

// =========================
//  LEVEL 2 — CONVERSATION
// =========================
function setupLevel2Conversation() {
  tenzin = createVector(60, height / 2); // start position

  npcs = [
    { name: 'Lhamo', x: 340, y: 110, img: LhamoImg },
    { name: 'Sonam', x: 420, y: 220, img: sonamImg }
  ];

  talking = false;
  canTalk = false;
  currentNPC = null;
  conversationStage = 0;
  convoDone = { Lhamo:false, Sonam:false };

  levelComplete = false;
  message = "";
}

function drawLevel2Conversation() {
  image(bgImage, 0, 0, width, height);

  // Player
  image(tenzinImg, tenzin.x, tenzin.y, 80, 80);

  // NPCs + prompt
  canTalk = false;
  currentNPC = null;

  for (let npc of npcs) {
    image(npc.img, npc.x, npc.y, 80, 80);
    const d = dist(tenzin.x + 40, tenzin.y + 40, npc.x + 40, npc.y + 40);
    if (d < 70) {
      canTalk = true;
      currentNPC = npc.name;
      fill(0); textSize(12);
      text("Press 'E' to talk", tenzin.x - 20, tenzin.y - 12);
    }
  }

  // Movement when not talking
  if (!talking) {
    if (keyIsDown(LEFT_ARROW))  tenzin.x -= 3;
    if (keyIsDown(RIGHT_ARROW)) tenzin.x += 3;
    if (keyIsDown(UP_ARROW))    tenzin.y -= 3;
    if (keyIsDown(DOWN_ARROW))  tenzin.y += 3;
    tenzin.x = constrain(tenzin.x, 0, width - 80);
    tenzin.y = constrain(tenzin.y, 0, height - 80);
  } else {
    drawConversationBox();
  }

  // Objective / completion
  const spokeToLhamo = convoCompletedFor('Lhamo');
  const spokeToSonam = convoCompletedFor('Sonam');

  if (spokeToLhamo && spokeToSonam) {
    levelComplete = true;
    fill(0, 150, 0); textSize(18); textAlign(CENTER);
    text("Level 2 Complete!", width/2, height/2 - 10);
    text("Click to continue to Level 3.", width/2, height/2 + 20);
    textAlign(LEFT);
  } else {
    fill(255); textSize(14);
    text("Goal: Talk to Lhamo and Sonam (E, then SPACE)", 12, 20);
  }
}

function drawConversationBox() {
  // Dialog box at bottom
  fill(255);
  rect(20, height - 110, width - 40, 90, 10);
  fill(0);
  textSize(12); textAlign(LEFT, TOP);

  switch (currentNPC) {
    case 'Lhamo':
      if (conversationStage === 0) {
        text("Lhamo: My story didn’t start until my family\nfound refuge in McLeod Ganj.", 30, height - 100);
      } else if (conversationStage === 1) {
        text("Lhamo: Now it’s my turn to help those in need.", 30, height - 80);
      }
      break;

    case 'Sonam':
      if (conversationStage === 0) {
        text("Sonam: As a young boy, it was difficult\nleaving Tibet suddenly.", 30, height - 100);
      } else if (conversationStage === 1) {
        text("Sonam: Now I am ready to influence,\nto fight, and to protect.", 30, height - 80);
      }
      break;

    default:
      talking = false;
      conversationStage = 0;
      return;
  }

  if (conversationStage <= 1) {
    textSize(10); fill(100);
    text("Press SPACE to continue...", 30, height - 32);
  }
}

function convoCompletedFor(name) {
  return !!convoDone[name];
}

// =========================
//  LEVEL 3 — WIRES + COINS + SHOP
// =========================
function setupLevel3() {
  wires = [
    { x: 100, y: 150, collected: false },
    { x: 300, y: 250, collected: false },
  ];

  tenzin.x = 50;
  tenzin.y = height / 2;

  score = 0;
  wiresCollected = 0;
  coins = [];
  hasBoughtComputer = false;
  shop = { x: 500, y: 40, w: 80, h: 80 };

  levelComplete = false;
  message = "";
}

function drawLevel3() {
  background(200);
  image(tenzinImg, tenzin.x, tenzin.y, 80, 80);
  moveTenzin();

  // Wires
  for (let i = 0; i < wires.length; i++) {
    let wire = wires[i];
    if (!wire.collected) {
      image(wireImg, wire.x, wire.y, 40, 40);
      if (dist(tenzin.x, tenzin.y, wire.x, wire.y) < 25) {
        wire.collected = true;
        wiresCollected++;
        showMessage("Wire collected!", 2000);
      }
    }
  }

  // Spawn coins after all wires
  if (wiresCollected === wires.length && coins.length < 10) {
    coins.push({x: random(width), y: random(height), collected: false});
    coins.push({x: random(width), y: random(height), collected: false});
  }

  // Coins
  for (let coin of coins) {
    if (!coin.collected) image(coinImg, coin.x, coin.y, 30, 40);
    if (dist(tenzin.x, tenzin.y, coin.x, coin.y) < 25 && !coin.collected) {
      coin.collected = true;
      score++;
      showMessage("Coin collected!", 2000);
    }
  }

  // Shop (draw)
  push();
  noStroke(); fill(30, 30, 40);
  rect(shop.x, shop.y, shop.w, shop.h, 8);
  fill(255); textSize(12); textAlign(CENTER, TOP);
  text("SHOP", shop.x + shop.w / 2, shop.y + 6);
  pop();

  // Near-shop prompt once wires are done
  const nearShop = dist(tenzin.x + 40, tenzin.y + 40, shop.x + shop.w/2, shop.y + shop.h/2) < 70;
  if (!hasBoughtComputer && wiresCollected === wires.length && nearShop) {
    fill(0); textSize(14); textAlign(LEFT, TOP);
    text("Press B to buy a computer set", 20, 20);
  }

  // Completion when purchased
  if (hasBoughtComputer) levelComplete = true;

  // HUD
  if (message) { fill(0); textSize(14); text(message, 20, height - 20); }
  fill(0); textSize(16);
  text("Wires: " + wiresCollected + " / " + wires.length, 20, 30);
  text("Coins: " + score, 20, 50);

  // Banner
  if (levelComplete) {
    fill(0, 150, 0); textSize(18); textAlign(CENTER);
    text("Level 3 Complete!", width/2, height/2 - 8);
    text("You bought a computer set.", width/2, height/2 + 16);
    text("Click to continue to Level 4.", width/2, height/2 + 40);
    textAlign(LEFT);
  }
}

// =========================
//  LEVEL 4 — COMPUTER + WEBSITE
// =========================
function setupLevel4() {
  tenzin = createVector(60, height / 2 + 40);
  levelComplete = false;
  message = "";
  l4Step = 0;
  l4WebsiteStage = 0;
  gameWon = false;
}

function drawLevel4() {
  background(180, 220, 200);

  // Characters on left
  image(tenzinImg,  40, height - 120, 80, 80);
  image(LhamoImg,   20,  40, 80, 80);
  image(sonamImg,  120,  80, 80, 80);

  // Computer monitor (center-right)
  drawMonitor(260, 40, 320, 300);
  drawWebsiteOnMonitor(260, 40, 320, 300, l4WebsiteStage);

  // Conversation / instruction ribbon
  drawRibbon(() => {
    if (l4Step < l4Dialog.length) {
      return l4Dialog[l4Step] + "\n(Press SPACE)";
    } else if (l4WebsiteStage < 3) {
      return "Building site: Press SPACE to add sections";
    } else if (l4WebsiteStage === 3) {
      return "Site drafted: Press P to PUBLISH";
    } else {
      return "Published! Voices for Tibet is live.";
    }
  });

  // Completion banner
  if (levelComplete) {
    fill(0, 150, 0); textSize(18); textAlign(CENTER);
    text("Game Complete — Success!", width/2, height/2 - 6);
    text("‘Voices for Tibet’ is live. Thank you for amplifying the truth.", width/2, height/2 + 18);
    text("Click to restart from Level 1.", width/2, height/2 + 42);
    textAlign(LEFT);
  }
}

// =========================
//  INPUT
// =========================
function mousePressed() {
  if (levelComplete && currentLevel === 1) {
    currentLevel = 2;
    setupLevel2Conversation();
  } else if (levelComplete && currentLevel === 2) {
    currentLevel = 3;
    setupLevel3();
  } else if (levelComplete && currentLevel === 3) {
    currentLevel = 4;
    setupLevel4();
  } else if (levelComplete && currentLevel === 4) {
    // Restart to Level 1 (or go to a credits screen)
    currentLevel = 1;
    setupLevel1();
  }
}

function keyPressed() {
  // Level 2 talk controls
  if (currentLevel === 2) {
    if (canTalk && key.toLowerCase() === 'e' && currentNPC) {
      talking = true;
      conversationStage = 0;
    }
    if (talking && key === ' ') {
      conversationStage++;
      if (conversationStage > 1) {
        talking = false;
        conversationStage = 0;
        if (currentNPC) convoDone[currentNPC] = true;
        currentNPC = null;
      }
    }
  }

  // Level 3: buy computer set at shop
  if (currentLevel === 3 && key.toLowerCase() === 'b') {
    const nearShop = dist(tenzin.x + 40, tenzin.y + 40, shop.x + shop.w/2, shop.y + shop.h/2) < 70;
    if (nearShop && wiresCollected === wires.length && !hasBoughtComputer) {
      hasBoughtComputer = true;
      showMessage("Purchased computer set!", 2000);

    }
  }

  // Level 4: build site & publish
  if (currentLevel === 4) {
    if (key === ' ') {
      if (l4Step < l4Dialog.length) {
        l4Step++; // advance conversation
      } else if (l4WebsiteStage < 3) {
        l4WebsiteStage++; // add website sections (frame -> title -> headlines)
      }
    }
    if (key.toLowerCase() === 'p') {
      if (l4Step >= l4Dialog.length && l4WebsiteStage >= 3 && !levelComplete) {
        l4WebsiteStage = 4; // published
        levelComplete = true;
        gameWon = true;
      }
    }
  }
}

// =========================
//  HELPERS (UI / DRAWING)
// =========================
function moveTenzin() {
  if (keyIsDown(LEFT_ARROW))  tenzin.x -= 2;
  if (keyIsDown(RIGHT_ARROW)) tenzin.x += 2;
  if (keyIsDown(UP_ARROW))    tenzin.y -= 2;
  if (keyIsDown(DOWN_ARROW))  tenzin.y += 2;
  tenzin.x = constrain(tenzin.x, 0, width);
  tenzin.y = constrain(tenzin.y, 0, height);
}

function drawMonitor(x, y, w, h) {
  push();
  // bezel
  fill(30);
  stroke(255, 255, 255, 40);
  strokeWeight(1.5);
  rect(x, y, w, h, 12);
  // screen
  noStroke();
  fill(235);
  rect(x + 10, y + 10, w - 20, h - 20, 8);
  // stand
  fill(30);
  rect(x + w/2 - 40, y + h + 8, 80, 10, 4);
  rect(x + w/2 - 10, y + h - 6, 20, 16, 3);
  pop();
}

function drawWebsiteOnMonitor(x, y, w, h, stage) {
  const sx = x + 10, sy = y + 10, sw = w - 20, sh = h - 20;

  if (stage >= 1) {
    // browser chrome
    push();
    fill(240);
    rect(sx, sy, sw, 28, 6, 6, 0, 0);
    fill(255, 95, 86);  circle(sx + 14, sy + 14, 10);
    fill(255, 189, 46); circle(sx + 32, sy + 14, 10);
    fill(39, 201, 63);  circle(sx + 50, sy + 14, 10);
    fill(255); rect(sx + 70, sy + 8, sw - 90, 14, 6);
    pop();
  }

  if (stage >= 2) {
    // site title
    push();
    fill(20);
    textAlign(LEFT, TOP);
    textSize(18);
    textWrap(WORD);
    text("Voices for Tibet", sx + 16, sy + 36, sw - 32);
    fill(90);
    textSize(12);
    text("Stories of resilience and urgent truths", sx + 16, sy + 58, sw - 32);
    pop();
  }

  if (stage >= 3) {
    // headlines
    const listTop = sy + 86;
    const itemH = 34;
    for (let i = 0; i < l4Headlines.length; i++) {
      const iy = listTop + i * itemH;
      push();
      stroke(220);
      line(sx + 12, iy - 6, sx + sw - 12, iy - 6);
      noStroke();
      fill(25);
      textAlign(LEFT, TOP);
      textSize(12);
      textWrap(WORD);
      text("• " + l4Headlines[i], sx + 16, iy, sw - 32);
      pop();
    }
  }

  if (stage >= 4) {
    // published overlay
    push();
    rectMode(CENTER);
    fill(0, 0, 0, 140);
    rect(sx + sw/2, sy + sh/2, sw * 0.7, 80, 10);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("Published ✔", sx + sw/2, sy + sh/2 - 10);
    textSize(12);
    text("The site is live and sharing the truth.", sx + sw/2, sy + sh/2 + 12);
    pop();
  }
}

function drawRibbon(getText) {
  const txt = getText();
  const boxW = Math.min(560, width - 40);
  const boxH = 66;
  const boxX = (width - boxW) / 2;
  const boxY = height - boxH - 10;

  push();
  noStroke();
  fill(0, 0, 0, 110);
  rect(boxX, boxY, boxW, boxH, 10);
  fill(255);
  textAlign(LEFT, TOP);
  textWrap(WORD);
  textSize(14);
  const innerX = boxX + 12, innerY = boxY + 8, innerW = boxW - 24, innerH = boxH - 16;
  text(txt, innerX, innerY, innerW, innerH);
  pop();
}
