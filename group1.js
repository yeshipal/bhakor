let gameState = "start";
let player;
let platforms = [];
let goal;
let img;
let chaserImg;
let playerImg;
let startScreenImg; 
//let obstacleImg;
let heartImg;
let chaser;
let chaserStartX = 50;
let chaserStartY = 50;
let opacity = 0;

let obstacleImgs = {};
let warningMessage = "";
let warningTimer = 0; // frames left to display warning


let obstacles = [
  { x: 210 + 200, y: 533, w: 23, h: 23 },
  { x: 60 + 290, y: 333, w: 23, h: 23 },
  { x: 350, y: 100, w: 23, h: 23 }
];

let score = 0;
let gameOver = false;

let currentLevel = 1;
const totalLevels = 6;

let restartButton;

function preload() {
  img = loadImage('Mountain.gif');
  playerImg = loadImage('Dorjee.gif');
  startScreenImg = loadImage('Sky.gif');
  //obstacleImg = loadImage('Lynx.gif');
  heartImg = loadImage('Heart.gif');
  chaserImg = loadImage('Police.gif');
  obstacleImgs = {
  1: loadImage('Lynx.gif'),
  2: loadImage('fox.gif')
  };
  
  
  bgMusic = loadSound('Takedown.m4a');
}

function setup() {
  createCanvas(706, 675);
  goal = createVector(630, 30);
  player = new Player(65, 620);
  chaser = new AI(50, 50);

  textFont('Courier');

  platforms = [
    new Platform(60, 645, 150, 45),
    new Platform(60 + 150, 645 - 45, 150, 45),
    new Platform(210 + 150, 600 - 45, 150, 45),
    new Platform(360 + 150, 555 - 45, 150, 45),
    new Platform(510 + 150, 510 - 45, 150, 45),
    new Platform(210 + 230, 600 - 200, 150, 45),
    new Platform(60 + 230, 555 - 200, 150, 45),
    new Platform(370 - 230, 510 - 200, 150, 45),
    new Platform(140, 310, 150, 45),
    new Platform(-10, 265, 150, 45),
    new Platform(150, 168, 150, 45),
    new Platform(300, 123, 150, 45),
    new Platform(450, 80, 260, 45)
  ];
  setupLevel(currentLevel);

  restartButton = createButton("Restart");
  restartButton.position(width / 2 - 40, height / 2 + 20);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  if (gameState === "start") {
    drawStartScreen();
  } else {
    background(img);
    if (gameState === "play") {
      drawPlayScreen();
      chaser.move(player.x, player.y);
      chaser.display();
      checkCollisions();
      
       if (currentLevel >= 6) {
        chaser.move(player.x, player.y);
        chaser.display();
        checkAIPlayerCollision();
      }

      for (let i = 0; i < 3 - score; i++) {
        image(heartImg, -20 + i * 35, -20, 90, 90);
      }
   if (warningTimer > 0) {
      const boxW = Math.min(440, width - 40);
      const boxH = 100;                     // room for ~3 lines
      const boxX = (width - boxW) / 2;
      const boxY = height - boxH - 20;      // safely above bottom
      drawWarningBox(warningMessage, boxX, boxY, boxW, boxH);
      warningTimer--;
    }



      fill(225);
      textSize(18);
      textAlign(LEFT);
      text("Level: " + currentLevel, 10, 50);
    } else if (gameState === "win") {
      drawWinScreen();
    } else if (gameState === "end") {
      drawEndScreen();
    }
  }
}

function checkCollisions() {
  for (let obs of obstacles) {
    image(obstacleImg, obs.x, obs.y, obs.w, obs.h);

    if (
      player.x + player.w > obs.x &&
      player.x < obs.x + obs.w &&
      player.y + player.h > obs.y &&
      player.y < obs.y + obs.h
    ) {
      score++;
      player.respawn();
      if (score === 1) {
        warningMessage = "☠️ You got caught! Thousands of Tibetans were caught but many of them attempted their escapes again! You can do it!";
      } else if (score === 2) {
        warningMessage = "☠️ You got caught again! Many Tibetans risk their lives again and again to escape. You can attempt again!";
      }
      warningTimer = 120; // ~2 seconds at 60fps
      break;
    }
  }
  
  if (score >= 3) {
    gameOver = true;
    gameState = "end";
    restartButton.show();
  }
}

function checkAIPlayerCollision() {
  if (
    chaser.x < player.x + player.w &&
    chaser.x + chaser.w > player.x &&
    chaser.y < player.y + player.h &&
    chaser.y + chaser.h > player.y
  ) {
    player.respawn();
    score++;
    if (score === 1) {
      warningMessage = "☠️ You got caught! Thousands of Tibetans were caught but many of them attempted their escapes again! You can do it!";
    } else if (score === 2) {
      warningMessage = "☠️ You got caught again! Many Tibetans risk their lives again and again to escape. You can attempt again!";
    }
    warningTimer = 120;
    
    // Reset chaser's position
    chaser.x = chaserStartX;
    chaser.y = chaserStartY;
  }
}

function drawStartScreen() {
  background(startScreenImg);
  textAlign(CENTER);
  fill(0);
  textSize(35); 
  text("Journey's Beginning", width / 2, height / 2 - 60);
  textSize(33);
  text("Land of Snow", width / 2, height / 2 - 10);
  textSize(22);
  text("Click Anywhere to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  player.move();
  player.display();

  for (let p of platforms) {
    p.display();
  }

  fill(0, 255, 0);
  rect(goal.x, goal.y, 40, 40);

  checkWin();
  
  // Display and move AI chaser only at level 6
  if (currentLevel >= 6) {
    chaser.move(player.x, player.y);
    chaser.display();
    checkAIPlayerCollision();
  }
}

function drawWinScreen() {
  background(0, 200, 100);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("🎉 You Completed All Levels! 🎉, Which means you have successefully arrived to Freedom in India. Thank you for taking the journey of thousands of Tibetans who endure to reach freedom.", width / 2, height / 2);
  textSize(20);
  text("Click to Restart", width / 2, height / 2 + 40);
}

function drawEndScreen() {
  background(200, 50, 50);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("Game Over!", width / 2, height / 2);
   // Warning box like in play, positioned above the Restart button
  const boxW = Math.min(460, width - 40);
  const boxH = 80;
  const boxX = (width - boxW) / 2;
  const boxY = height / 2 - boxH - 10; // sits above button (button is at +20)

  drawWarningBox("Just like thousands of Tibetans, aged as young as 4 years old to old age, succumb to the harsh conditions of the journey or brutally subjected to torture on their way of escape, you have failed to reach freedom in India. Please try again!.", boxX, boxY, boxW, boxH);

  textSize(20);
  
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
     if (!bgMusic.isPlaying()) {
      bgMusic.loop();  // Loop the music
      bgMusic.setVolume(0.2); // Volume between 0.0 and 1.0
    }
  } else if (gameState === "win" || gameState === "end") {
    restartGame();
  }
}

function restartGame() {
  player.respawn();
  currentLevel = 1;
  score = 0;
  gameState = "start";
  setupLevel(currentLevel);

  gameOver = false;
  restartButton.hide();
}

function checkWin() {
  if (player.reaches(goal)) {
    currentLevel++;
    if (currentLevel > totalLevels) {
      gameState = "win";
    } else {
      setupLevel(currentLevel);

      player.respawn();
    }
  }
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    fill(200);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 40;
    this.ySpeed = 0;
    this.xSpeed = 0;
    this.onGround = false;
    this.jumpCount = 0;
  }

  move() {
    this.xSpeed = 0;
    if (keyIsDown(LEFT_ARROW)) this.xSpeed = -3;
    if (keyIsDown(RIGHT_ARROW)) this.xSpeed = 3;
    this.x += this.xSpeed;

    this.ySpeed += 0.8; 
    this.y += this.ySpeed;
    this.onGround = false;

    for (let p of platforms) {
      if (
        this.x + this.w > p.x &&
        this.x < p.x + p.w &&
        this.y + this.h > p.y &&
        this.y + this.h < p.y + p.h &&
        this.ySpeed >= 0
      ) {
        this.y = p.y - this.h;
        this.ySpeed = 0;
        this.onGround = true;
        this.jumpCount = 0;
      }
    }

    this.x = constrain(this.x, 0, width - this.w);
    if (this.y > height) this.respawn();
  }

  jump() {
    if (this.onGround || this.jumpCount < 2) {
      this.ySpeed = -12;
      this.jumpCount++;
    }
  }

  respawn() {
    this.x = 65;
    this.y = 620;
    this.ySpeed = 0;
    this.jumpCount = 0;
  }

  display() {
    image(playerImg, this.x, this.y, this.w, this.h);
  }

  reaches(goal) {
    return dist(this.x, this.y, goal.x, goal.y) < 30;
  }
}

function keyPressed() {
  if (gameOver) return;
  if (key === ' ' || keyCode === UP_ARROW) {
    player.jump();
  }
}

class AI {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 40;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.speed = 2;
    this.onGround = false;
  }

  move(targetX, targetY) {
    // Set the stopping distance from the player
    let stoppingDistance = 10;

    // Move in x direction toward the player while respecting stopping distance
    if (targetX < this.x - stoppingDistance) {
      this.xSpeed = -this.speed;
    } else if (targetX > this.x + stoppingDistance) {
      this.xSpeed = this.speed;
    } else {
      this.xSpeed = 0;
    }

    this.x += this.xSpeed;

    // Gravity effect and jumping logic
    this.ySpeed += 0.8;
    this.y += this.ySpeed;
    this.onGround = false;

    // Platform collision logic
    for (let p of platforms) {
      if (
        this.x + this.w > p.x &&
        this.x < p.x + p.w &&
        this.y + this.h > p.y &&
        this.y + this.h < p.y + p.h &&
        this.ySpeed >= 0
      ) {
        this.y = p.y - this.h;
        this.ySpeed = 0;
        this.onGround = true;
      }
    }

    // Boundary constraints
    this.x = constrain(this.x, 0, width - this.w);

    // Logic for jumping if needed
    if (targetY < this.y && this.onGround) {
      this.jump();
    }
  }

  jump() {
    if (this.onGround) {
      this.ySpeed = -12;
    }
  }
  
  display() {
    image(chaserImg, this.x, this.y, this.w, this.h);
  }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', { 
        height: '0', // Hide the player
        width: '0',
        videoId: 'xnpNwuxJBS0?si=epUj88GWCDm6XpXg', // Correctly put only the video ID
        playerVars: {
            'controls': 0, // Hide controls
            'autoplay': 1, // Autoplay the video
            'loop': 1, // Loop the video
            'playlist': 'xnpNwuxJBS0' // Ensure the same video ID for the playlist for looping
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo(); // Start playing the video once ready
    event.target.setVolume(20); // Adjust volume (0-100)
}
function setupLevel(level) {
  const maxKey = Math.max(...Object.keys(obstacleImgs).map(n => int(n)));
  const key = constrain(level, 1, maxKey);
  obstacleImg = obstacleImgs[key] || obstacleImg;  // reuse your existing image var

  const counts = [3, 4, 5, 6, 7, 8];              // tune freely
  const count = counts[constrain(level, 1, counts.length) - 1];
  obstacles = buildObstaclesOnPlatforms(count);
}
function buildObstaclesOnPlatforms(count) {
  const obsW = 23, obsH = 23;
  const picks = [];

  // Pick platforms that are wide enough
  let candidatePlatforms = platforms.filter(p => p.w >= 60);

  // Shuffle the platforms
  candidatePlatforms = candidatePlatforms.sort(() => random(-1, 1));

  // Add obstacles
  for (let i = 0; i < count; i++) {
    const p = candidatePlatforms[i % candidatePlatforms.length];
    const randX = p.x + random(0, p.w - obsW); // random spot along platform
    const y = p.y - obsH;                       // sit on top
    picks.push({ x: randX, y, w: obsW, h: obsH });
  }

  return picks;
}
function drawWarningBox(msg, boxX, boxY, boxW, boxH) {
  push();
  textWrap(WORD);
  textAlign(CENTER, TOP);
  textSize(22);
  textLeading(26);

  // backdrop
  noStroke();
  fill(0, 0, 0, 120);
  rect(boxX, boxY, boxW, boxH, 8);

  // text
  fill(255, 80, 80);
  text(msg, boxX + 12, boxY + 10, boxW - 24, boxH - 20);
  pop();
}
