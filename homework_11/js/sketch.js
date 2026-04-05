let player;
let pizzaGroup;
let badPizzaGroup;
let rockGroup;

let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdle;
let ninjaWalk1;
let ninjaWalk2;
let pizzaImg;
let badPizzaImg;
let rockImg;

// manual key tracking
let keys = {};
let prevX, prevY;

// attack system
let attacks = [];
let attackCooldown = 0;

// particle system
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

  window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
  });

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addImage("idle", ninjaIdle);
  player.addImage("walk1", ninjaWalk1);
  player.addImage("walk2", ninjaWalk2);
  player.scale = 0.4;
  prevX = player.x;
  prevY = player.y;

  // ROCKS
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100, 700), random(100, 500));
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

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
    handleAttacks();
    checkCollisions();
    updateParticles();

    if (badPizzaGroup.length === 0) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  drawSprites();

  // draw particles
  for (let p of particles) {
    p.update();
    p.show();
  }
  particles = particles.filter(p => p.lifespan > 0);

  // UI
  fill(0);
  noStroke();
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  // WIN / LOSE SCREEN
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

  if (attackCooldown > 0) attackCooldown--;
}

function handleMovement() {
  let moving = false;
  let movingRight = true;

  if (keys["ArrowLeft"] || keys["a"]) { player.position.x -= 4; moving = true; movingRight = false; }
  if (keys["ArrowRight"] || keys["d"]) { player.position.x += 4; moving = true; movingRight = true; }
  if (keys["ArrowUp"] || keys["w"]) { player.position.y -= 4; moving = true; }
  if (keys["ArrowDown"] || keys["s"]) { player.position.y += 4; moving = true; }

  player.position.x = constrain(player.position.x, 20, width - 20);
  player.position.y = constrain(player.position.y, 20, height - 20);

  // flip ninja left/right
  player.scale.x = abs(player.scale.x) * (movingRight ? 1 : -1);

  // walk animation
  if (moving) {
    let anim = (frameCount % 20 < 10) ? "walk1" : "walk2";
    player.changeImage(anim);
  } else {
    player.changeImage("idle");
  }

  // attack with spacebar
  if (keys[" "] && attackCooldown === 0) {
    let atk = createSprite(player.position.x, player.position.y, 20, 20);
    atk.setCollider("rectangle", 0, 0, 20, 20);
    atk.life = 5;
    attacks.push(atk);
    attackCooldown = 15;
  }
}

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

function handleAttacks() {
  for (let atk of attacks) {
    atk.life--;
    for (let bad of badPizzaGroup) {
      if (bad.overlap(atk)) {
        bad.health--;
        spawnParticles(bad.position.x, bad.position.y);
        if (bad.health <= 0) {
          bad.remove();
        }
        atk.remove();
        break;
      }
    }
  }
}

function checkCollisions() {
  let pw = 18;
  let ph = 18;

  // rocks
  for (let rock of rockGroup) {
    if (rectsOverlap(player.position.x, player.position.y, pw, ph, rock.position.x, rock.position.y, 25, 25)) {
      player.position.x = prevX;
      player.position.y = prevY;
    }
  }

  // good pizzas
  for (let pizza of pizzaGroup) {
    if (rectsOverlap(player.position.x, player.position.y, pw, ph, pizza.position.x, pizza.position.y, 20, 20)) {
      score++;
      spawnParticles(pizza.position.x, pizza.position.y);
      pizza.position.x = random(50, 750);
      pizza.position.y = random(50, 550);
    }
  }

  // bad pizzas
  for (let bad of badPizzaGroup) {
    if (rectsOverlap(player.position.x, player.position.y, pw, ph, bad.position.x, bad.position.y, 20, 20)) {
      health--;
      bad.position.x = random(50, 750);
      bad.position.y = random(50, 550);
    }
  }
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return abs(ax - bx) < (aw + bw) && abs(ay - by) < (ah + bh);
}

// PARTICLES
function spawnParticles(x, y) {
  for (let i = 0; i < 8; i++) {
    particles.push(new Particle(x, y));
  }
}

function updateParticles() {
  for (let p of particles) {
    p.update();
  }
}

// Particle class
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.lifespan = 30;
  }
  update() {
    this.pos.add(this.vel);
    this.lifespan--;
  }
  show() {
    noStroke();
    fill(255, 150, 0, this.lifespan * 8);
    ellipse(this.pos.x, this.pos.y, 6);
  }
}