let player;
let pizzas = [];
let badPizzas = [];
let obstacles = [];

let score = 0;
let health = 5;
let gameState = "play";

let idleAnim, walkAnim;

function preload() {
  idleAnim = loadAnimation("images/ninja_idle.png");
  walkAnim = loadAnimation("images/ninja_walk1.png", "images/ninja_walk2.png");

  pizzaImg = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg = loadImage("images/rock.png");
}

function setup() {
  new Canvas(800, 600);

  // Player
  player = new Sprite(400, 300, 50, 50);
  player.addAnimation("idle", idleAnim);
  player.addAnimation("walk", walkAnim);

  // Obstacles (static)
  for (let i = 0; i < 3; i++) {
    let o = new Sprite(random(width), random(height), 60, 60, "static");
    o.img = rockImg;
    obstacles.push(o);
  }

  // Good pizzas
  for (let i = 0; i < 5; i++) {
    let p = new Sprite(random(width), random(height), 30, 30);
    p.img = pizzaImg;
    pizzas.push(p);
  }

  // Bad pizzas
  for (let i = 0; i < 3; i++) {
    let b = new Sprite(random(width), random(height), 30, 30);
    b.img = badPizzaImg;
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
      if (player.overlaps(p)) {
        score++;
        p.pos.x = random(width);
        p.pos.y = random(height);
      }
    }

    // Hit bad pizzas
    for (let b of badPizzas) {
      if (player.overlaps(b)) {
        health--;
        b.pos.x = random(width);
        b.pos.y = random(height);
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
  }

  else if (gameState === "win") {
    textSize(40);
    textAlign(CENTER);
    text("YOU WIN!", width/2, height/2);
  }

  else if (gameState === "lose") {
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2);
  }
}

function handleMovement() {
  let moving = false;

  player.vel.x = 0;
  player.vel.y = 0;

  if (kb.pressing("left") || kb.pressing("a")) {
    player.vel.x = -4;
    moving = true;
  }
  if (kb.pressing("right") || kb.pressing("d")) {
    player.vel.x = 4;
    moving = true;
  }
  if (kb.pressing("up") || kb.pressing("w")) {
    player.vel.y = -4;
    moving = true;
  }
  if (kb.pressing("down") || kb.pressing("s")) {
    player.vel.y = 4;
    moving = true;
  }

  if (moving) {
    player.changeAnimation("walk");
  } else {
    player.changeAnimation("idle");
  }
}