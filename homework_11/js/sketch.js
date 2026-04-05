let player;
let pizzaGroup;
let badPizzaGroup;
let rockGroup;
let particleGroup;

let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdle, ninjaWalk1, ninjaWalk2;
let pizzaImg, badPizzaImg, rockImg;

let keys = {};

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

  // Player sprite
  player = createSprite(400, 300, 40, 40);
  player.addImage("idle", ninjaIdle);
  player.addImage("walk1", ninjaWalk1);
  player.addImage("walk2", ninjaWalk2);
  player.changeImage("idle");
  player.scale = 0.4;

  // Rocks
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100, 700), random(100, 500));
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // Good pizza
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50, 750), random(50, 550));
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza.setSpeed(random(1, 2), random(0, 360));
    pizzaGroup.add(pizza);
  }

  // Bad pizza
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50, 750), random(50, 550));
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad.setSpeed(random(1, 2), random(0, 360));
    bad.health = 3; // bad pizza takes 3 hits
    badPizzaGroup.add(bad);
  }

  // Particles
  particleGroup = new Group();
}

// Key press tracking
function keyPressed() {
  keys[key] = true;

  // Attack with spacebar
  if (key === " ") {
    attack();
  }
}

function keyReleased() {
  keys[key] = false;
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();
    movePizzas();
    checkCollisions();
  }

  drawSprites();
  drawUI();
}

function handleMovement() {
  let moving = false;

  if (keys["ArrowLeft"]  || keys["a"]) { player.position.x -= 4; moving = true; }
  if (keys["ArrowRight"] || keys["d"]) { player.position.x += 4; moving = true; }
  if (keys["ArrowUp"]    || keys["w"]) { player.position.y -= 4; moving = true; }
  if (keys["ArrowDown"]  || keys["s"]) { player.position.y += 4; moving = true; }

  player.position.x = constrain(player.position.x, 20, width - 20);
  player.position.y = constrain(player.position.y, 20, height - 20);

  // Ninja walk animation
  if (moving) {
    player.changeImage(frameCount % 20 < 10 ? "walk1" : "walk2");
  } else {
    player.changeImage("idle");
  }
}

function movePizzas() {
  // bounce pizzas off walls
  pizzaGroup.forEach(p => {
    if (p.position.x < 20 || p.position.x > width - 20) p.velocity.x *= -1;
    if (p.position.y < 20 || p.position.y > height - 20) p.velocity.y *= -1;
  });

  badPizzaGroup.forEach(b => {
    if (b.position.x < 20 || b.position.x > width - 20) b.velocity.x *= -1;
    if (b.position.y < 20 || b.position.y > height - 20) b.velocity.y *= -1;
  });
}

function checkCollisions() {
  // Player & rocks
  rockGroup.forEach(rock => {
    player.collide(rock);
  });

  // Player & good pizza
  pizzaGroup.forEach(p => {
    if (player.overlap(p)) {
      score++;
      p.position.x = random(50, 750);
      p.position.y = random(50, 550);
      // optional: small particles when collecting good pizza
      spawnParticles(p.position.x, p.position.y, color(0, 255, 0));
    }
  });

  // Player & bad pizza (damage)
  badPizzaGroup.forEach(b => {
    if (player.overlap(b)) {
      health--;
      b.position.x = random(50, 750);
      b.position.y = random(50, 550);
    }
  });

  // Particles lifetime
  particleGroup.forEach(p => {
    p.lifetime--;
    if (p.lifetime <= 0) {
      p.remove();
    }
  });
}

// Attack function
function attack() {
  // check overlap with bad pizzas
  badPizzaGroup.forEach(b => {
    let d = dist(player.position.x, player.position.y, b.position.x, b.position.y);
    if (d < 50) { // attack radius
      b.health--;
      spawnParticles(b.position.x, b.position.y, color(255, 0, 0));
      if (b.health <= 0) {
        b.remove();
      }
    }
  });
}

// Spawn particle effect
function spawnParticles(x, y, c) {
  for (let i = 0; i < 10; i++) {
    let p = createSprite(x, y, 5, 5);
    p.shapeColor = c;
    p.velocity.x = random(-2, 2);
    p.velocity.y = random(-2, 2);
    p.lifetime = 20;
    particleGroup.add(p);
  }
}

function drawUI() {
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  if (health <= 0) {
    gameState = "lose";
    fill(180, 0, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
  }

  if (badPizzaGroup.length === 0) {
    gameState = "win";
    fill(0, 180, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
  }
}