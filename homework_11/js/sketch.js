let player;
let pizzaGroup;
let badPizzaGroup;
let particles = [];

let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdle, ninjaWalk1, ninjaWalk2;
let pizzaImg, badPizzaImg;

let keys = {};

function preload() {
  ninjaIdle   = loadImage("images/ninja_idle.png");
  ninjaWalk1  = loadImage("images/ninja_walk1.png");
  ninjaWalk2  = loadImage("images/ninja_walk2.png");
  pizzaImg    = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
}

function setup() {
  createCanvas(800, 600);

  // Key tracking
  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup",   e => keys[e.key] = false);

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addImage("idle", ninjaIdle);
  player.addImage("walk1", ninjaWalk1);
  player.addImage("walk2", ninjaWalk2);
  player.changeImage("idle");
  player.scale = 0.4;

  // GOOD PIZZAS
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50, 750), random(50, 550));
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5, 1.5]);
    pizza._vy = random([-1.5, 1.5]);
    pizzaGroup.add(pizza);
  }

  // BAD PIZZAS
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50, 750), random(50, 550));
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad._vx = random([-2, 2]);
    bad._vy = random([-2, 2]);
    bad.health = 3; // each bad pizza has health
    badPizzaGroup.add(bad);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();
    movePizzas();
    handleCollisions();
    handleParticles();

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

  // WIN / LOSE
  if (gameState === "win") {
    fill(0, 180, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width/2, height/2);
  }
  if (gameState === "lose") {
    fill(180, 0, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
  }
}

function handleMovement() {
  let moving = false;

  if (keys["ArrowLeft"] || keys["a"]) { player.position.x -= 4; moving = true; }
  if (keys["ArrowRight"]|| keys["d"]) { player.position.x += 4; moving = true; }
  if (keys["ArrowUp"]   || keys["w"]) { player.position.y -= 4; moving = true; }
  if (keys["ArrowDown"] || keys["s"]) { player.position.y += 4; moving = true; }

  player.position.x = constrain(player.position.x, 20, width-20);
  player.position.y = constrain(player.position.y, 20, height-20);

  if (moving) {
    player.changeImage(frameCount % 20 < 10 ? "walk1" : "walk2");
  } else {
    player.changeImage("idle");
  }
}

function movePizzas() {
  for (let pizza of pizzaGroup) {
    pizza.position.x += pizza._vx;
    pizza.position.y += pizza._vy;
    if (pizza.position.x < 20 || pizza.position.x > width-20) pizza._vx *= -1;
    if (pizza.position.y < 20 || pizza.position.y > height-20) pizza._vy *= -1;
  }

  for (let bad of badPizzaGroup) {
    // Random dodge movement
    bad.position.x += bad._vx + random(-1, 1);
    bad.position.y += bad._vy + random(-1, 1);
    if (bad.position.x < 20 || bad.position.x > width-20) bad._vx *= -1;
    if (bad.position.y < 20 || bad.position.y > height-20) bad._vy *= -1;
  }
}

function handleCollisions() {
  // GOOD PIZZAS
  for (let pizza of pizzaGroup) {
    if (player.overlap(pizza)) {
      score++;
      pizza.position.x = random(50, 750);
      pizza.position.y = random(50, 550);

      // Particle effect for good pizza
      createParticles(pizza.position.x, pizza.position.y, color(0,255,0));
    }
  }

  // BAD PIZZAS
  for (let bad of badPizzaGroup) {
    if (player.overlap(bad) && keyIsDown(32)) { // spacebar attack
      bad.health--;
      createParticles(bad.position.x, bad.position.y, color(255,0,0));

      if (bad.health <= 0) bad.remove();
    }
  }
}

function createParticles(x, y, c) {
  for (let i=0; i<10; i++) {
    particles.push({
      pos: createVector(x, y),
      vel: p5.Vector.random2D().mult(random(1,3)),
      lifespan: 50,
      color: c
    });
  }
}

function handleParticles() {
  for (let i = particles.length-1; i >=0; i--) {
    let p = particles[i];
    p.pos.add(p.vel);
    p.lifespan--;
    noStroke();
    fill(p.color.levels[0], p.color.levels[1], p.color.levels[2], p.lifespan*5);
    ellipse(p.pos.x, p.pos.y, 5);
    if (p.lifespan <= 0) particles.splice(i,1);
  }
}