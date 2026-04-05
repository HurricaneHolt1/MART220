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

  window.addEventListener("keydown", (e) => { keys[e.key] = true; if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault(); });
  window.addEventListener("keyup",   (e) => { keys[e.key] = false; });

  // PLAYER
  player = createSprite(400, 300, 40, 40);
  player.addImage("idle", ninjaIdle);
  player.addImage("walk1", ninjaWalk1);
  player.addImage("walk2", ninjaWalk2);
  player.scale = 0.2;
  prevX = player.x;
  prevY = player.y;

  // ROCK GROUP
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = createSprite(random(100,700), random(100,500));
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // GOOD PIZZA GROUP
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = createSprite(random(50,750), random(50,550));
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5,1.5]);
    pizza._vy = random([-1.5,1.5]);
    pizzaGroup.add(pizza);
  }

  // BAD PIZZA GROUP
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
    prevX = player.x;
    prevY = player.y;

    handleMovement();
    movePizzas();
    checkCollisions();
    updateParticles();

    if (score >= 10) gameState = "win";
    if (health <= 0)  gameState = "lose";
  }

  // draw all sprites
  rockGroup.draw();
  pizzaGroup.draw();
  badPizzaGroup.draw();
  drawSprites();

  // draw particles
  for (let p of particles) p.display();

  // UI
  fill(0);
  noStroke();
  textSize(24);
  textAlign(LEFT);
  text("Score: "  + score,  20, 30);
  text("Health: " + health, 20, 60);

  // WIN SCREEN
  if (gameState === "win") {
    fill(0,180,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24);
    text("Refresh to play again", width/2, height/2+60);
  }

  // LOSE SCREEN
  if (gameState === "lose") {
    fill(180,0,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(24);
    text("Refresh to play again", width/2, height/2+60);
  }
}

// -------------------
// PLAYER MOVEMENT
// -------------------
function handleMovement() {
  let moving = false;
  let movingRight = true;

  if (keys["ArrowLeft"] || keys["a"]) { player.x -= 4; moving = true; movingRight = false; }
  if (keys["ArrowRight"]|| keys["d"]) { player.x += 4; moving = true; movingRight = true; }
  if (keys["ArrowUp"]   || keys["w"]) { player.y -= 4; moving = true; }
  if (keys["ArrowDown"] || keys["s"]) { player.y += 4; moving = true; }

  player.x = constrain(player.x, 20, width-20);
  player.y = constrain(player.y, 20, height-20);

  if (moving) {
    let frame = frameCount % 20 < 10 ? "walk1" : "walk2";
    player.changeImage(frame);
    player.scale = movingRight ? 0.2 : -0.2;
  } else {
    player.changeImage("idle");
    player.scale = 0.2;
  }
}

// -------------------
// MOVE PIZZAS
// -------------------
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

// -------------------
// COLLISIONS
// -------------------
function checkCollisions() {
  let pw = 20;
  let ph = 20;

  // ROCKS - solid
  for (let rock of rockGroup) {
    if (abs(player.position.x - rock.position.x) < 30 && abs(player.position.y - rock.position.y) < 30) {
      player.x = prevX;
      player.y = prevY;
    }
  }

  // GOOD PIZZAS - collect
  for (let pizza of pizzaGroup) {
    if (abs(player.position.x - pizza.position.x) < 25 && abs(player.position.y - pizza.position.y) < 25) {
      score++;
      spawnParticles(pizza.position.x, pizza.position.y, color(255,200,0));
      pizza.position.x = random(50,750);
      pizza.position.y = random(50,550);
    }
  }

  // BAD PIZZAS - damage once per collision
  for (let bad of badPizzaGroup) {
    if (abs(player.position.x - bad.position.x) < 25 && abs(player.position.y - bad.position.y) < 25) {
      health--;
      bad.position.x = random(50,750);
      bad.position.y = random(50,550);
    }
  }
}

// -------------------
// PARTICLES
// -------------------
class Particle {
  constructor(x, y, c) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2,2), random(-2,2));
    this.lifespan = 60;
    this.color = c;
  }
  update() { this.pos.add(this.vel); this.lifespan--; }
  display() {
    noStroke();
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], map(this.lifespan,0,60,0,255));
    ellipse(this.pos.x, this.pos.y, 8);
  }
}

function spawnParticles(x, y, c) {
  for (let i=0; i<10; i++) particles.push(new Particle(x,y,c));
}

function updateParticles() {
  for (let i = particles.length-1; i>=0; i--) {
    particles[i].update();
    if (particles[i].lifespan <= 0) particles.splice(i,1);
  }
}