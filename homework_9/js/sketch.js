let player;
let pizzas = [];
let badPizzas = [];
let obstacles = [];

let score = 0;
let health = 5;
let gameState = "play";

let idleAnim, walkAnim;
let pizzaImg, badPizzaImg, rockImg;

// debug/version tag to ensure browser loads the updated file
console.log('sketch.js loaded — v2');

function preload() {
  // Load animations
  idleAnim = loadAnimation("images/ninja_idle.png");
  walkAnim = loadAnimation("images/ninja_walk1.png", "images/ninja_walk2.png");

  // Load images
  pizzaImg = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg = loadImage("images/rock.png");
}

function setup() {
  createCanvas(800, 600);

  // Player setup
  player = createSprite(400, 300, 50, 50);
  player.addAnimation("idle", idleAnim);
  player.addAnimation("walk", walkAnim);

  // Obstacles
  for (let i = 0; i < 3; i++) {
    let o = createSprite(random(width), random(height), 60, 60);
    o.addImage(rockImg);
    o.static = true; // prevent moving on collision (p5.play uses `static` now)
    obstacles.push(o);
  }

  // Good pizzas
  for (let i = 0; i < 5; i++) {
    let p = createSprite(random(width), random(height), 30, 30);
    p.addImage(pizzaImg);
    pizzas.push(p);
  }

  // Bad pizzas
  for (let i = 0; i < 3; i++) {
    let b = createSprite(random(width), random(height), 30, 30);
    b.addImage(badPizzaImg);
    badPizzas.push(b);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();

    // Collisions with obstacles
    for (let o of obstacles) {
      player.collide(o);
    }

    // Collect pizzas
    for (let p of pizzas) {
      if (player.overlap(p)) {
        score++;
        p.position.x = random(width);
        p.position.y = random(height);
      }
    }

    // Hit bad pizzas
    for (let b of badPizzas) {
      if (player.overlap(b)) {
        health--;
        b.position.x = random(width);
        b.position.y = random(height);
      }
    }

    // UI
    fill(0);
    textSize(20);
    text("Score: " + score, 20, 30);
    text("Health: " + health, 20, 60);

    // Win/Lose
    if (score >= 10) gameState = "win";
    if (health <= 0) gameState = "lose";

  } else if (gameState === "win") {
    textSize(40);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
  } else if (gameState === "lose") {
    textSize(40);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
  }

  drawSprites();
}

function handleMovement() {
  let moving = false;
  player.velocity.x = 0;
  player.velocity.y = 0;

  if (kb.pressing('ArrowLeft') || kb.pressing('a')) {
    player.velocity.x = -4;
    moving = true;
  }
  if (kb.pressing('ArrowRight') || kb.pressing('d')) {
    player.velocity.x = 4;
    moving = true;
  }
  if (kb.pressing('ArrowUp') || kb.pressing('w')) {
    player.velocity.y = -4;
    moving = true;
  }
  if (kb.pressing('ArrowDown') || kb.pressing('s')) {
    player.velocity.y = 4;
    moving = true;
  }

  if (moving) {
    player.changeAnimation("walk");
  } else {
    player.changeAnimation("idle");
  }
}