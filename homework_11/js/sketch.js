let player;
let pizzaGroup;
let badPizzaGroup;
let rockGroup;

let score = 0;
let health = 5;
let gameState = "play";

// Player images
let ninjaIdle, ninjaWalk1, ninjaWalk2;
let pizzaImg, badPizzaImg, rockImg;

// Keys tracking
let keys = {};

// Track previous position for solid collision
let prevX, prevY;

// Particles
let particles = [];

function preload() {
  ninjaIdle   = loadImage("images/ninja_idle.png");
  ninjaWalk1  = loadImage("images/ninja_walk1.png");
  ninjaWalk2  = loadImage("images/ninja_walk2.png");
  pizzaImg    = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg     = loadImage("images/rock.png");
}

function setup() {
  createCanvas(800, 600);

  window.addEventListener("keydown", function(e){
    keys[e.key] = true;
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault();
  });
  window.addEventListener("keyup", function(e){
    keys[e.key] = false;
  });

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addAnimation("idle", ninjaIdle);
  player.addAnimation("walk", ninjaWalk1, ninjaWalk2);
  player.changeAnimation("idle");
  player.scale.x = 0.4; // facing right initially
  prevX = player.x;
  prevY = player.y;

  // ROCKS
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100,700), random(100,500), 50, 50);
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // GOOD PIZZAS
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50,750), random(50,550), 30, 30);
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5, 1.5]);
    pizza._vy = random([-1.5, 1.5]);
    pizzaGroup.add(pizza);
  }

  // BAD PIZZAS
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50,750), random(50,550), 30, 30);
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad._vx = random([-2,2]);
    bad._vy = random([-2,2]);
    badPizzaGroup.add(bad);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    prevX = player.x;
    prevY = player.y;

    handleMovement();
    movePizzas();
    checkCollisions();
    handleParticles();

    if (score >= 10) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  // Draw all sprites
  drawSprites();

  // Draw particles on top
  for (let p of particles) {
    p.display();
  }

  // UI
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  if (gameState === "win") {
    fill(0,180,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("YOU WIN!", width/2, height/2);
  }

  if (gameState === "lose") {
    fill(180,0,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
  }

  // Spacebar attack
  if (keys[" "]) handleAttacks();
}

// ------------------------
// Movement
// ------------------------
function handleMovement() {
  let moving = false;
  let movingRight = true;

  if (keys["ArrowLeft"] || keys["a"]) {
    player.x -= 4;
    moving = true;
    movingRight = false;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    player.x += 4;
    moving = true;
    movingRight = true;
  }
  if (keys["ArrowUp"] || keys["w"]) {
    player.y -= 4;
    moving = true;
  }
  if (keys["ArrowDown"] || keys["s"]) {
    player.y += 4;
    moving = true;
  }

  // Keep inside canvas
  player.x = constrain(player.x, 20, width-20);
  player.y = constrain(player.y, 20, height-20);

  // Animation
  if (moving) player.changeAnimation("walk");
  else player.changeAnimation("idle");

  // Flip left/right
  player.scale.x = movingRight ? 0.4 : -0.4;
}

// ------------------------
// Move pizzas
// ------------------------
function movePizzas() {
  for (let pizza of pizzaGroup) {
    pizza.position.x += pizza._vx;
    pizza.position.y += pizza._vy;
    if (pizza.position.x < 20 || pizza.position.x > width-20) pizza._vx *= -1;
    if (pizza.position.y < 20 || pizza.position.y > height-20) pizza._vy *= -1;
  }

  for (let bad of badPizzaGroup) {
    bad.position.x += bad._vx;
    bad.position.y += bad._vy;
    if (bad.position.x < 20 || bad.position.x > width-20) bad._vx *= -1;
    if (bad.position.y < 20 || bad.position.y > height-20) bad._vy *= -1;
  }
}

// ------------------------
// Collisions
// ------------------------
function checkCollisions() {
  let pw = 20;
  let ph = 20;

  // Rocks
  for (let rock of rockGroup) {
    if (abs(player.x - rock.position.x) < 35 && abs(player.y - rock.position.y) < 35) {
      player.x = prevX;
      player.y = prevY;
    }
  }

  // Good pizzas
  for (let pizza of pizzaGroup) {
    if (abs(player.x - pizza.position.x) < 25 && abs(player.y - pizza.position.y) < 25) {
      score++;
      pizza.position.x = random(50,750);
      pizza.position.y = random(50,550);
      spawnParticles(pizza.position.x, pizza.position.y, color(0,255,0));
    }
  }

  // Bad pizzas
  for (let bad of badPizzaGroup) {
    if (abs(player.x - bad.position.x) < 25 && abs(player.y - bad.position.y) < 25) {
      health--;
      // move bad pizza away to prevent multi-hit
      bad.position.x = random(50,750);
      bad.position.y = random(50,550);
      spawnParticles(bad.position.x, bad.position.y, color(255,0,0));
    }
  }
}

// ------------------------
// Attack
// ------------------------
function handleAttacks() {
  for (let bad of badPizzaGroup) {
    if (abs(player.x - bad.position.x) < 50 && abs(player.y - bad.position.y) < 50) {
      // Move bad pizza away and spawn particles
      bad.position.x = random(50,750);
      bad.position.y = random(50,550);
      spawnParticles(bad.position.x, bad.position.y, color(255,150,0));
    }
  }
}

// ------------------------
// Particles
// ------------------------
function spawnParticles(x, y, c) {
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(x, y, c));
  }
}

function handleParticles() {
  for (let i = particles.length-1; i >=0; i--) {
    particles[i].update();
    if (particles[i].lifespan <= 0) particles.splice(i,1);
  }
}

// ------------------------
// Particle class
// ------------------------
class Particle {
  constructor(x, y, c){
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2,2), random(-2,2));
    this.lifespan = 60;
    this.color = c;
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan--;
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], map(this.lifespan,0,60,0,255));
    ellipse(this.pos.x, this.pos.y, 8);
  }

}