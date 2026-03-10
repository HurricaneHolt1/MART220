let ninja;
let pizzaImg;
let rottenPizzaImg;

let goodSound;
let badSound;
let music;

let score = 0;
let health = 5;
let gameTime = 60; // seconds
let startTime;
let gameState = "playing"; // "playing" or "gameover"
let musicStarted = false;

function preload() {
  ninja = new Ninja();
  ninja.loadAnimations();

  pizzaImg = loadImage("images/pizza.png");
  rottenPizzaImg = loadImage("images/rotten_pizza.png"); // your rotten pizza

  goodSound = loadSound("sounds/good.wav");
  badSound = loadSound("sounds/bad.wav");
  music = loadSound("sounds/music.mp3");
}

function setup() {
  createCanvas(800, 600);
  ninja.setup();
  startTime = millis();
}

function draw() {
  background(30);

  if (gameState === "playing") {
    let timeLeft = gameTime - floor((millis() - startTime) / 1000);

    if (timeLeft <= 0 || health <= 0) {
      gameState = "gameover";
    }

    ninja.update();
    ninja.display();

    handleFood(timeLeft);

    displayUI(timeLeft);
  } else if (gameState === "gameover") {
    displayGameOver();
  }
}

function handleFood(timeLeft) {
  // Draw good pizza
  image(pizzaImg, ninja.foodX, ninja.foodY, 60, 60);

  // Draw rotten pizza
  image(rottenPizzaImg, ninja.badFoodX, ninja.badFoodY, 60, 60);

  // Collision with good pizza
  if (collide(ninja.x, ninja.y, 80, 80, ninja.foodX, ninja.foodY, 60, 60)) {
    score++;
    goodSound.play();
    ninja.moveFood();
  }

  // Collision with rotten pizza
  if (collide(ninja.x, ninja.y, 80, 80, ninja.badFoodX, ninja.badFoodY, 60, 60)) {
    health--;
    badSound.play();
    ninja.moveBadFood();
  }

  // Random reposition over time
  if (frameCount % 120 === 0) {
    ninja.moveFood();
    ninja.moveBadFood();
  }
}

function collide(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 &&
         x1 + w1 > x2 &&
         y1 < y2 + h2 &&
         y1 + h1 > y2;
}

function displayUI(timeLeft) {
  fill(255);
  textSize(24);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);
  text("Time: " + timeLeft, width - 150, 30);
}

function displayGameOver() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("GAME OVER", width / 2, height / 2 - 40);
  textSize(24);
  text("Final Score: " + score, width / 2, height / 2 + 10);
}

// Start music on first click
function mousePressed() {
  if (!musicStarted) {
    music.loop();
    musicStarted = true;
  }
}

// Ninja class
class Ninja {
  constructor() {
    this.x = 400;
    this.y = 300;
    this.speed = 4;

    this.idleFrames = [];
    this.runFrames = [];
    this.currentFrame = 0;
    this.frameDelay = 8;

    this.foodX = random(100, 700);
    this.foodY = random(100, 500);

    this.badFoodX = random(100, 700);
    this.badFoodY = random(100, 500);

    this.isMoving = false;
  }

  loadAnimations() {
    // Idle frames
    this.idleFrames[0] = loadImage("images/ninja_idle_0.png");
    this.idleFrames[1] = loadImage("images/ninja_idle_1.png");

    // Run frames
    this.runFrames[0] = loadImage("images/ninja_run_0.png");
    this.runFrames[1] = loadImage("images/ninja_run_1.png");
  }

  setup() {}

  update() {
    this.isMoving = false;

    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.isMoving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.isMoving = true;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
      this.isMoving = true;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
      this.isMoving = true;
    }

    // Keep on screen
    this.x = constrain(this.x, 0, width - 80);
    this.y = constrain(this.y, 0, height - 80);

    // Animate
    if (frameCount % this.frameDelay === 0) {
      this.currentFrame++;
    }
  }

  display() {
    let frames = this.isMoving ? this.runFrames : this.idleFrames;
    let index = this.currentFrame % frames.length;
    image(frames[index], this.x, this.y, 80, 80);
  }

  moveFood() {
    this.foodX = random(50, width - 100);
    this.foodY = random(50, height - 100);
  }

  moveBadFood() {
    this.badFoodX = random(50, width - 100);
    this.badFoodY = random(50, height - 100);
  }
}