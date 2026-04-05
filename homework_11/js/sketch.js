let player;
let pizzaGroup;
let badPizzaGroup;
let rockGroup;
let attacks = [];
let particles = [];

let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdle, ninjaWalk1, ninjaWalk2;
let pizzaImg, badPizzaImg, rockImg;

// manual key tracking
let keys = {};
let prevX, prevY;
let lastFacingRight = true; // remember last horizontal direction

// PARTICLE CLASS
class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 5));
    this.lifespan = 60;
    this.color = color;
  }
  update() {
    this.pos.add(this.vel);
    this.lifespan--;
  }
  show() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], map(this.lifespan, 0, 60, 0, 255));
    ellipse(this.pos.x, this.pos.y, 6);
  }
  isDead() { return this.lifespan <= 0; }
}

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

  // keys
  window.addEventListener("keydown", (e) => { keys[e.key] = true; if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); });
  window.addEventListener("keyup", (e) => { keys[e.key] = false; });

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addAnimation("idle", ninjaIdle);
  player.addAnimation("walk1", ninjaWalk1);
  player.addAnimation("walk2", ninjaWalk2);
  player.scale = 0.4;
  prevX = player.position.x;
  prevY = player.position.y;

  // ROCKS
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100,700), random(100,500));
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // GOOD PIZZAS
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50,750), random(50,550));
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5, 1.5]);
    pizza._vy = random([-1.5, 1.5]);
    pizzaGroup.add(pizza);
  }

  // BAD PIZZAS
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = createSprite(random(50,750), random(50,550));
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
    prevX = player.position.x;
    prevY = player.position.y;

    handleMovement();
    movePizzas();
    handleAttacks();
    checkCollisions();

    if (score >= 10) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  // draw sprites
  drawSprites();

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isDead()) particles.splice(i, 1);
  }

  // UI
  fill(0); noStroke(); textSize(24); textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  if (gameState === "win") {
    fill(0,180,0,180); rect(0,0,width,height);
    fill(255); textSize(60); textAlign(CENTER,CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24); text("Refresh to play again", width/2, height/2+60);
  }
  if (gameState === "lose") {
    fill(180,0,0,180); rect(0,0,width,height);
    fill(255); textSize(60); textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(24); text("Refresh to play again", width/2, height/2+60);
  }
}

function handleMovement() {
  let moving = false;
  let movingRight = lastFacingRight;

  if (keys["ArrowLeft"] || keys["a"]) { player.position.x -= 4; moving = true; movingRight = false; lastFacingRight = false; }
  if (keys["ArrowRight"] || keys["d"]) { player.position.x += 4; moving = true; movingRight = true; lastFacingRight = true; }
  if (keys["ArrowUp"] || keys["w"]) { player.position.y -= 4; moving = true; }
  if (keys["ArrowDown"] || keys["s"]) { player.position.y += 4; moving = true; }

  player.position.x = constrain(player.position.x, 20, width-20);
  player.position.y = constrain(player.position.y, 20, height-20);

  player.mirrorX(movingRight ? 1 : -1);

  if (moving) player.changeAnimation(frameCount%20 < 10 ? "walk1" : "walk2");
  else player.changeAnimation("idle");

  if (keys[" "]) {
    attacks.push({x: player.position.x + (lastFacingRight ? 40 : -40), y: player.position.y, vx: (lastFacingRight ? 8 : -8)});
    keys[" "] = false;
  }
}

function movePizzas() {
  for (let pizza of pizzaGroup) {
    pizza.position.x += pizza._vx; pizza.position.y += pizza._vy;
    if (pizza.position.x < 20 || pizza.position.x > width-20) pizza._vx*=-1;
    if (pizza.position.y < 20 || pizza.position.y > height-20) pizza._vy*=-1;
  }

  for (let bad of badPizzaGroup) {
    bad.position.x += bad._vx; bad.position.y += bad._vy;
    if (bad.position.x < 20 || bad.position.x > width-20) bad._vx*=-1;
    if (bad.position.y < 20 || bad.position.y > height-20) bad._vy*=-1;
  }
}

function handleAttacks() {
  for (let i = attacks.length - 1; i >= 0; i--) {
    let atk = attacks[i];
    atk.x += atk.vx;

    // remove offscreen attacks
    if (atk.x < 0 || atk.x > width) {
      attacks.splice(i,1);
      continue;
    }

    // hit bad pizza
    for (let j = badPizzaGroup.length-1; j >= 0; j--) {
      let bad = badPizzaGroup[j];
      if (dist(atk.x, atk.y, bad.position.x, bad.position.y) < 25) {
        // spawn particles
        for (let k = 0; k < 10; k++) particles.push(new Particle(bad.position.x, bad.position.y, color(255,0,0)));
        bad.remove();
        attacks.splice(i,1);
        break;
      }
    }
  }

  // draw attacks
  fill(0); noStroke();
  for (let atk of attacks) ellipse(atk.x, atk.y, 12);
}

function checkCollisions() {
  // rocks
  for (let rock of rockGroup) {
    if (player.overlap(rock)) {
      player.position.x = prevX;
      player.position.y = prevY;
    }
  }

  // good pizzas
  for (let pizza of pizzaGroup) {
    if (dist(player.position.x, player.position.y, pizza.position.x, pizza.position.y) < 25) {
      score++;
      pizza.position.x = random(50,750);
      pizza.position.y = random(50,550);
      // particle for good pizza
      for (let k = 0; k < 10; k++) particles.push(new Particle(pizza.position.x, pizza.position.y, color(0,255,0)));
    }
  }

  // bad pizzas collide with player
  for (let bad of badPizzaGroup) {
    if (dist(player.position.x, player.position.y, bad.position.x, bad.position.y) < 25) {
      health--;
      bad.position.x = random(50,750);
      bad.position.y = random(50,550);
      for (let k = 0; k < 10; k++) particles.push(new Particle(bad.position.x, bad.position.y, color(255,0,0)));
    }
  }
}