let player;
let pizzaGroup, badPizzaGroup, rockGroup;
let particles = [];
let attacks = [];

let score = 0;
let health = 5;
let gameState = "play";

// ninja animations
let ninjaIdle, ninjaWalk1, ninjaWalk2;
// images
let pizzaImg, badPizzaImg, rockImg;

// keys tracking
let keys = {};
let prevX, prevY;

function preload() {
  ninjaIdle   = loadAnimation("images/ninja_idle.png");
  ninjaWalk1  = loadAnimation("images/ninja_walk1.png");
  ninjaWalk2  = loadAnimation("images/ninja_walk2.png");

  pizzaImg    = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg     = loadImage("images/rock.png");
}

function setup() {
  createCanvas(800, 600);

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addAnimation("idle", ninjaIdle);
  player.addAnimation("walk1", ninjaWalk1);
  player.addAnimation("walk2", ninjaWalk2);
  player.changeAnimation("idle");
  player.scale = 0.4;
  prevX = player.position.x;
  prevY = player.position.y;

  // ROCKS
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100, 700), random(100, 500), 55, 55);
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // GOOD PIZZAS
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50, 750), random(50, 550), 30, 30);
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5, 1.5]);
    pizza._vy = random([-1.5, 1.5]);
    pizzaGroup.add(pizza);
  }

  // BAD PIZZAS
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50, 750), random(50, 550), 30, 30);
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad._vx = random([-2, 2]);
    bad._vy = random([-2, 2]);
    bad.health = 3;
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
    handleCollisions();
    handleParticles();
    handleAttacks();

    if (badPizzaGroup.length === 0) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  drawSprites();

  // UI
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  if (gameState === "win") {
    fill(0, 180, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
  }
  if (gameState === "lose") {
    fill(180, 0, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
  }
}

// MOVEMENT
function handleMovement() {
  let moving = false;

  if (keys["ArrowLeft"] || keys["a"]) { player.position.x -= 4; moving = true; }
  if (keys["ArrowRight"] || keys["d"]) { player.position.x += 4; moving = true; }
  if (keys["ArrowUp"] || keys["w"]) { player.position.y -= 4; moving = true; }
  if (keys["ArrowDown"] || keys["s"]) { player.position.y += 4; moving = true; }

  player.position.x = constrain(player.position.x, 20, width - 20);
  player.position.y = constrain(player.position.y, 20, height - 20);

  if (moving) player.changeAnimation(frameCount % 20 < 10 ? "walk1" : "walk2");
  else player.changeAnimation("idle");

  if (keys[" "]) {
    attacks.push({x: player.position.x + 40, y: player.position.y, vx: 8});
    keys[" "] = false; // single fire
  }
}

// MOVE PIZZAS
function movePizzas() {
  for (let pizza of pizzaGroup) {
    pizza.position.x += pizza._vx;
    pizza.position.y += pizza._vy;
    if (pizza.position.x < 20 || pizza.position.x > width - 20) pizza._vx *= -1;
    if (pizza.position.y < 20 || pizza.position.y > height - 20) pizza._vy *= -1;
  }

  for (let bad of badPizzaGroup) {
    bad.position.x += bad._vx;
    bad.position.y += bad._vy;
    if (bad.position.x < 20 || bad.position.x > width - 20) bad._vx *= -1;
    if (bad.position.y < 20 || bad.position.y > height - 20) bad._vy *= -1;
  }
}

// COLLISIONS
function handleCollisions() {
  for (let rock of rockGroup) {
    if (player.overlap(rock)) {
      player.position.x = prevX;
      player.position.y = prevY;
    }
  }

  for (let pizza of pizzaGroup) {
    if (player.overlap(pizza)) {
      score++;
      createParticles(pizza.position.x, pizza.position.y, color(0,255,0));
      pizza.position.x = random(50, 750);
      pizza.position.y = random(50, 550);
    }
  }

  for (let bad of badPizzaGroup) {
    if (player.overlap(bad)) {
      health--;
      createParticles(bad.position.x, bad.position.y, color(255,0,0));
    }
  }
}

// PARTICLES
function createParticles(x, y, col) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      pos: createVector(x, y),
      vel: p5.Vector.random2D().mult(random(1,3)),
      lifespan: 60,
      col: col
    });
  }
}

function handleParticles() {
  for (let i = particles.length-1; i>=0; i--) {
    let p = particles[i];
    p.pos.add(p.vel);
    p.lifespan--;
    noStroke();
    fill(p.col.levels[0], p.col.levels[1], p.col.levels[2], map(p.lifespan,0,60,0,255));
    ellipse(p.pos.x, p.pos.y, 6);
    if (p.lifespan <= 0) particles.splice(i,1);
  }
}

// ATTACKS
function handleAttacks() {
  for (let i = attacks.length-1; i >= 0; i--) {
    let atk = attacks[i];
    atk.x += atk.vx;
    fill(255, 200, 0);
    ellipse(atk.x, atk.y, 10);

    // check collision with bad pizzas
    for (let j = badPizzaGroup.length-1; j>=0; j--) {
      let bad = badPizzaGroup[j];
      if (dist(atk.x, atk.y, bad.position.x, bad.position.y) < 20) {
        bad.health--;
        createParticles(bad.position.x, bad.position.y, color(255,0,0));
        if (bad.health <= 0) bad.remove();
        attacks.splice(i,1);
        break;
      }
    }

    // remove attack if off-screen
    if (atk.x > width) attacks.splice(i,1);
  }
}