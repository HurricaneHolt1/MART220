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

  // key tracking
  window.addEventListener("keydown", (e) => { keys[e.key] = true; });
  window.addEventListener("keyup", (e) => { keys[e.key] = false; });

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addImage("idle", ninjaIdle);
  player.addImage("walk1", ninjaWalk1);
  player.addImage("walk2", ninjaWalk2);
  player.changeImage("idle");
  player.scale = 0.4;
  prevX = player.x;
  prevY = player.y;

  // ROCKS
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100,700), random(100,500), 55, 55);
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // GOOD PIZZA
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50,750), random(50,550), 30, 30);
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5,1.5]);
    pizza._vy = random([-1.5,1.5]);
    pizzaGroup.add(pizza);
  }

  // BAD PIZZA
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50,750), random(50,550), 30, 30);
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad.health = 3;
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
    handleAttacks();
    checkCollisions();

    if (badPizzaGroup.length === 0) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  // update and draw particles
  for (let i = particles.length-1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) particles.splice(i,1);
  }

  drawSprites();

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
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24);
    text("Refresh to play again", width/2, height/2 + 60);
  }

  if (gameState === "lose") {
    fill(180,0,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(24);
    text("Refresh to play again", width/2, height/2 + 60);
  }
}

function handleMovement() {
  let moving = false;

  if (keys["ArrowLeft"] || keys["a"]) { player.x -= 4; moving = true; }
  if (keys["ArrowRight"] || keys["d"]) { player.x += 4; moving = true; }
  if (keys["ArrowUp"] || keys["w"]) { player.y -= 4; moving = true; }
  if (keys["ArrowDown"] || keys["s"]) { player.y += 4; moving = true; }

  player.x = constrain(player.x, 20, width-20);
  player.y = constrain(player.y, 20, height-20);

  if (moving) {
    player.changeImage((frameCount%20<10) ? "walk1" : "walk2");
  } else {
    player.changeImage("idle");
  }
}

function movePizzas() {
  // good pizzas
  for (let pizza of pizzaGroup) {
    pizza.x += pizza._vx;
    pizza.y += pizza._vy;
    if (pizza.x < 20 || pizza.x > width-20) pizza._vx *= -1;
    if (pizza.y < 20 || pizza.y > height-20) pizza._vy *= -1;
  }

  // bad pizzas
  for (let bad of badPizzaGroup) {
    bad.x += bad._vx;
    bad.y += bad._vy;
    if (bad.x < 20 || bad.x > width-20) bad._vx *= -1;
    if (bad.y < 20 || bad.y > height-20) bad._vy *= -1;
  }
}

function handleAttacks() {
  if (keys[" "]) { // spacebar
    for (let i = badPizzaGroup.length-1; i >=0; i--) {
      let bad = badPizzaGroup[i];
      if (player.overlap(bad)) {
        bad.health--;
        spawnParticles(bad.x, bad.y, color(255,0,0));
        if (bad.health <= 0) bad.remove();
      }
    }

    for (let i = pizzaGroup.length-1; i >=0; i--) {
      let pizza = pizzaGroup[i];
      if (player.overlap(pizza)) {
        spawnParticles(pizza.x, pizza.y, color(255,255,0));
        score++;
        pizza.x = random(50,750);
        pizza.y = random(50,550);
      }
    }
  }
}

function checkCollisions() {
  let pw = 18;
  let ph = 18;

  for (let rock of rockGroup) {
    if (rectsOverlap(player.x, player.y, pw, ph, rock.x, rock.y, 25, 25)) {
      // try restoring X
      if (!rectsOverlap(prevX, player.y, pw, ph, rock.x, rock.y, 25, 25)) player.x = prevX;
      else if (!rectsOverlap(player.x, prevY, pw, ph, rock.x, rock.y, 25, 25)) player.y = prevY;
      else { player.x = prevX; player.y = prevY; }
    }
  }
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return abs(ax-bx) < (aw+bw) && abs(ay-by) < (ah+bh);
}

// PARTICLE CLASS
class Particle {
  constructor(x, y, c) {
    this.x = x;
    this.y = y;
    this.vel = createVector(random(-2,2), random(-2,2));
    this.lifespan = 30;
    this.color = c;
  }

  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    this.lifespan--;
  }

  finished() {
    return this.lifespan <= 0;
  }

  show() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], map(this.lifespan,0,30,0,255));
    ellipse(this.x, this.y, 6);
  }
}

function spawnParticles(x, y, c) {
  for (let i=0; i<10; i++) {
    particles.push(new Particle(x, y, c));
  }
}