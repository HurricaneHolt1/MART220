let player;
let pizzaGroup;
let badPizzaGroup;
let rockGroup;
let particles = [];

let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdle, ninjaWalk1, ninjaWalk2;
let pizzaImg, badPizzaImg, rockImg;

// manual key tracking
let keys = {};

// track player position from previous frame for solid collision
let prevX, prevY;

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

  window.addEventListener("keydown", function(e) { keys[e.key] = true; });
  window.addEventListener("keyup", function(e) { keys[e.key] = false; });

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addAnimation("idle", ninjaIdle);
  player.addAnimation("walk", ninjaWalk1, ninjaWalk2);
  player.scale = 0.4;
  prevX = player.position.x;
  prevY = player.position.y;

  // ROCK GROUP
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100, 700), random(100, 500));
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // GOOD PIZZA GROUP
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50, 750), random(50, 550));
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5, 1.5]);
    pizza._vy = random([-1.5, 1.5]);
    pizzaGroup.add(pizza);
  }

  // BAD PIZZA GROUP
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50, 750), random(50, 550));
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad._vx = random([-2, 2]);
    bad._vy = random([-2, 2]);
    badPizzaGroup.add(bad);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    prevX = player.position.x;
    prevY = player.position.y;

    handleMovement();
    movePizzas();
    checkCollisions();
    updateParticles();

    if (pizzaGroup.length === 0 && badPizzaGroup.length === 0) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  drawSprites();

  // UI
  fill(0);
  noStroke();
  textSize(24);
  textAlign(LEFT);
  text("Score: "  + score,  20, 30);
  text("Health: " + health, 20, 60);

  // WIN SCREEN
  if (gameState === "win") {
    fill(0, 180, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
    textSize(24);
    text("Refresh to play again", width / 2, height / 2 + 60);
  }

  // LOSE SCREEN
  if (gameState === "lose") {
    fill(180, 0, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    textSize(24);
    text("Refresh to play again", width / 2, height / 2 + 60);
  }
}

// PLAYER MOVEMENT AND ANIMATION
function handleMovement() {
  let moving = false;
  let movingRight = true;

  if (keys["ArrowLeft"]  || keys["a"]) { player.position.x -= 4; moving = true; movingRight = false; }
  if (keys["ArrowRight"] || keys["d"]) { player.position.x += 4; moving = true; movingRight = true; }
  if (keys["ArrowUp"]    || keys["w"]) { player.position.y -= 4; moving = true; }
  if (keys["ArrowDown"]  || keys["s"]) { player.position.y += 4; moving = true; }

  player.position.x = constrain(player.position.x, 20, width  - 20);
  player.position.y = constrain(player.position.y, 20, height - 20);

  if (moving) {
    player.changeAnimation("walk");
  } else {
    player.changeAnimation("idle");
  }

  player.mirrorX(movingRight ? 1 : -1);
}

// MOVE PIZZAS
function movePizzas() {
  for (let pizza of pizzaGroup) {
    pizza.position.x += pizza._vx;
    pizza.position.y += pizza._vy;
    if (pizza.position.x < 20 || pizza.position.x > width  - 20) pizza._vx *= -1;
    if (pizza.position.y < 20 || pizza.position.y > height - 20) pizza._vy *= -1;
  }

  for (let bad of badPizzaGroup) {
    bad.position.x += bad._vx;
    bad.position.y += bad._vy;
    if (bad.position.x < 20 || bad.position.x > width  - 20) bad._vx *= -1;
    if (bad.position.y < 20 || bad.position.y > height - 20) bad._vy *= -1;
  }
}

// CHECK COLLISIONS
function checkCollisions() {
  // ROCKS — push back
  for (let rock of rockGroup) {
    if (player.overlap(rock)) {
      player.position.x = prevX;
      player.position.y = prevY;
    }
  }

  // GOOD PIZZAS
  for (let i = pizzaGroup.length-1; i >= 0; i--) {
    let pizza = pizzaGroup[i];
    if (player.overlap(pizza)) {
      score++;
      createParticles(pizza.position.x, pizza.position.y, "yellow");
      pizza.remove();
    }
  }

  // BAD PIZZAS
  for (let i = badPizzaGroup.length-1; i >= 0; i--) {
    let bad = badPizzaGroup[i];
    if (player.overlap(bad)) {
      health--;
      createParticles(bad.position.x, bad.position.y, "red");
      bad.position.x = random(50, 750);
      bad.position.y = random(50, 550);
    }
  }
}

// PARTICLE SYSTEM
function createParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      pos: createVector(x, y),
      vel: createVector(random(-2, 2), random(-2, 2)),
      life: 30,
      color: color
    });
  }
}

function updateParticles() {
  for (let i = particles.length-1; i >= 0; i--) {
    let p = particles[i];
    p.pos.add(p.vel);
    p.life--;
    fill(p.color);
    noStroke();
    ellipse(p.pos.x, p.pos.y, 6);
    if (p.life <= 0) particles.splice(i, 1);
  }
}