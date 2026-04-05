let player;
let pizzaGroup, badPizzaGroup, rockGroup;
let particles = [];

let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdle, ninjaWalk1, ninjaWalk2;
let pizzaImg, badPizzaImg, rockImg;

let keys = {};
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

  // key tracking
  window.addEventListener("keydown", e => { keys[e.key] = true; });
  window.addEventListener("keyup",   e => { keys[e.key] = false; });

  // player sprite
  player = createSprite(400, 300);
  player.addImage("idle", ninjaIdle);
  player.addImage("walk1", ninjaWalk1);
  player.addImage("walk2", ninjaWalk2);
  player.scale = 0.4;

  prevX = player.x;
  prevY = player.y;

  // rocks
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100,700), random(100,500));
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // good pizza
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50,750), random(50,550));
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5,1.5]);
    pizza._vy = random([-1.5,1.5]);
    pizzaGroup.add(pizza);
  }

  // bad pizza
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50,750), random(50,550));
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad._vx = random([-2,2]);
    bad._vy = random([-2,2]);
    bad.health = 3; // hit points
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
    handleAttacks();
    checkCollisions();
    updateParticles();

    if (badPizzaGroup.length === 0) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  drawSprites();
  drawUI();

  if (gameState === "win") drawEndScreen("YOU WIN!", color(0,180,0));
  if (gameState === "lose") drawEndScreen("GAME OVER", color(180,0,0));
}

function handleMovement() {
  let moving = false;

  if (keys["ArrowLeft"] || keys["a"]) { player.x -= 4; moving = true; }
  if (keys["ArrowRight"]|| keys["d"]) { player.x += 4; moving = true; }
  if (keys["ArrowUp"]   || keys["w"]) { player.y -= 4; moving = true; }
  if (keys["ArrowDown"] || keys["s"]) { player.y += 4; moving = true; }

  player.x = constrain(player.x, 20, width-20);
  player.y = constrain(player.y, 20, height-20);

  if (moving) player.changeImage(frameCount % 20 < 10 ? "walk1" : "walk2");
  else player.changeImage("idle");
}

function movePizzas() {
  for (let pizza of pizzaGroup) {
    pizza.x += pizza._vx;
    pizza.y += pizza._vy;
    if (pizza.x < 20 || pizza.x > width-20) pizza._vx *= -1;
    if (pizza.y < 20 || pizza.y > height-20) pizza._vy *= -1;
  }

  for (let bad of badPizzaGroup) {
    bad.x += bad._vx;
    bad.y += bad._vy;
    if (bad.x < 20 || bad.x > width-20) bad._vx *= -1;
    if (bad.y < 20 || bad.y > height-20) bad._vy *= -1;

    // random dodge movement
    if (random() < 0.02) {
      bad._vx = random([-2, -1, 1, 2]);
      bad._vy = random([-2, -1, 1, 2]);
    }
  }
}

function handleAttacks() {
  // spacebar attack
  if (keys[" "]) {
    // check bad pizzas
    for (let i = badPizzaGroup.length-1; i>=0; i--) {
      let bad = badPizzaGroup[i];
      if (player.overlap(bad)) {
        bad.health--;
        spawnParticles(bad.x, bad.y, color(255,0,0));
        if (bad.health <= 0) bad.remove();
      }
    }

    // check good pizzas (for fun)
    for (let pizza of pizzaGroup) {
      if (player.overlap(pizza)) {
        spawnParticles(pizza.x, pizza.y, color(255,255,0));
      }
    }
  }
}

function checkCollisions() {
  // rocks
  for (let rock of rockGroup) {
    if (player.overlap(rock)) {
      player.x = prevX;
      player.y = prevY;
    }
  }

  // collect good pizza
  for (let pizza of pizzaGroup) {
    if (player.overlap(pizza)) {
      score++;
      pizza.x = random(50,750);
      pizza.y = random(50,550);
      spawnParticles(pizza.x, pizza.y, color(0,255,0));
    }
  }

  // touch bad pizza = damage
  for (let bad of badPizzaGroup) {
    if (player.overlap(bad)) {
      health--;
      bad.x = random(50,750);
      bad.y = random(50,550);
      spawnParticles(bad.x, bad.y, color(255,0,0));
    }
  }
}

function spawnParticles(x, y, c) {
  for (let i=0; i<10; i++) {
    particles.push(new Particle(x, y, c));
  }
}

function updateParticles() {
  for (let p of particles) {
    p.update();
    p.show();
  }
  particles = particles.filter(p => !p.isDead());
}

function drawUI() {
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);
}

function drawEndScreen(txt, bgColor) {
  fill(bgColor);
  rect(0,0,width,height);
  fill(255);
  textSize(60);
  textAlign(CENTER,CENTER);
  text(txt, width/2, height/2);
  textSize(24);
  text("Refresh to play again", width/2, height/2+60);
}

// ---------------- Particle Class ----------------
class Particle {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.vx = random(-2,2);
    this.vy = random(-2,2);
    this.lifespan = 30;
    this.c = c;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.lifespan--;
  }

  show() {
    noStroke();
    fill(red(this.c), green(this.c), blue(this.c), map(this.lifespan,0,30,0,255));
    ellipse(this.x, this.y, 8);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}