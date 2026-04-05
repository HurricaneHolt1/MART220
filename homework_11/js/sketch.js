// ===== GLOBAL VARIABLES =====
let ninja;
let goodPizzas = [];
let badPizzas = [];
let thrownPizzas = [];
let particles = [];
let score = 0;
let gameOver = false;

// Sprites
let ninjaIdle, ninjaWalk1, ninjaWalk2;
let goodPizzaImg, badPizzaImg;

function preload() {
  ninjaIdle = loadImage('assets/ninja_idle.png');
  ninjaWalk1 = loadImage('assets/ninja_walk1.png');
  ninjaWalk2 = loadImage('assets/ninja_walk2.png');
  goodPizzaImg = loadImage('assets/goodPizza.png');
  badPizzaImg = loadImage('assets/badPizza.png');
}

function setup() {
  createCanvas(800, 600);

  // Ninja
  ninja = new Ninja(
    width / 2, 
    height - 50, 
    ninjaIdle, 
    [ninjaWalk1, ninjaWalk2]
  );

  // Good pizzas
  for (let i = 0; i < 5; i++) {
    goodPizzas.push(new PizzaItem(random(50, width-50), random(50, height-150), true));
  }

  // Bad pizzas
  for (let i = 0; i < 5; i++) {
    badPizzas.push(new PizzaItem(random(50, width-50), random(50, height/2), false));
  }
}

function draw() {
  background(50, 150, 200);

  if (!gameOver) {
    ninja.update();
    ninja.display();

    // Thrown pizzas
    for (let i = thrownPizzas.length - 1; i >= 0; i--) {
      thrownPizzas[i].update();
      thrownPizzas[i].display();

      for (let j = badPizzas.length - 1; j >= 0; j--) {
        if (thrownPizzas[i].hits(badPizzas[j])) {
          attackPizza(badPizzas[j]);
          thrownPizzas.splice(i, 1);
          break;
        }
      }

      if (i < thrownPizzas.length && thrownPizzas[i].offscreen()) {
        thrownPizzas.splice(i, 1);
      }
    }

    // Good pizzas
    for (let i = goodPizzas.length - 1; i >= 0; i--) {
      goodPizzas[i].display();
      if (ninja.collides(goodPizzas[i])) {
        score += 10;
        goodPizzas.splice(i, 1);
      }
    }

    // Bad pizzas
    for (let i = badPizzas.length - 1; i >= 0; i--) {
      badPizzas[i].update();
      badPizzas[i].display();
    }

    // Particles
    updateParticles();

    // Score
    fill(255);
    textSize(24);
    text("Score: " + score, 20, 30);

    // Win check
    checkWin();
  } else {
    fill(255, 255, 0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("You Win!", width/2, height/2);
  }
}

// ===== NINJA CLASS =====
class Ninja {
  constructor(x, y, idleImg, walkImgs) {
    this.pos = createVector(x, y);
    this.size = 50;
    this.speed = 5;

    this.idleImg = idleImg;
    this.walkImgs = walkImgs;

    this.currentFrame = 0;
    this.frameCounter = 0;
    this.isMoving = false;
  }

  update() {
    this.isMoving = false;

    if (keyIsDown(LEFT_ARROW)) { this.pos.x -= this.speed; this.isMoving = true; }
    if (keyIsDown(RIGHT_ARROW)) { this.pos.x += this.speed; this.isMoving = true; }
    if (keyIsDown(UP_ARROW)) { this.pos.y -= this.speed; this.isMoving = true; }
    if (keyIsDown(DOWN_ARROW)) { this.pos.y += this.speed; this.isMoving = true; }

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);

    if (this.isMoving) {
      this.frameCounter++;
      if (this.frameCounter % 10 === 0) {
        this.currentFrame = (this.currentFrame + 1) % this.walkImgs.length;
      }
    } else {
      this.currentFrame = 0;
    }
  }

  display() {
    imageMode(CENTER);
    if (this.isMoving) {
      image(this.walkImgs[this.currentFrame], this.pos.x, this.pos.y, this.size, this.size);
    } else {
      image(this.idleImg, this.pos.x, this.pos.y, this.size, this.size);
    }
  }

  collides(item) {
    let d = dist(this.pos.x, this.pos.y, item.pos.x, item.pos.y);
    return d < (this.size/2 + item.size/2);
  }
}

// ===== PIZZA ITEM =====
class PizzaItem {
  constructor(x, y, isGood) {
    this.pos = createVector(x, y);
    this.size = 30;
    this.health = isGood ? 0 : 3;
    this.isGood = isGood;

    if (!isGood) {
      this.vel = p5.Vector.random2D();
      this.vel.setMag(random(1, 2));
    } else {
      this.vel = createVector(0, 0);
    }
  }

  update() {
    if (!this.isGood) {
      this.pos.add(this.vel);

      if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
      if (this.pos.y < 0 || this.pos.y > height/2) this.vel.y *= -1;

      if (random(1) < 0.02) {
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(1, 2));
      }
    }
  }

  display() {
    imageMode(CENTER);
    if (this.isGood) {
      image(goodPizzaImg, this.pos.x, this.pos.y, this.size, this.size);
    } else {
      image(badPizzaImg, this.pos.x, this.pos.y, this.size, this.size);
    }
  }
}

// ===== THROWN PIZZA =====
class ThrownPizza {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, -7);
    this.size = 20;
  }

  update() { this.pos.add(this.vel); }
  display() { fill('orange'); ellipse(this.pos.x, this.pos.y, this.size); }

  hits(pizzaItem) {
    let d = dist(this.pos.x, this.pos.y, pizzaItem.pos.x, pizzaItem.pos.y);
    return d < (this.size/2 + pizzaItem.size/2);
  }

  offscreen() { return this.pos.y < 0; }
}

// ===== PARTICLE SYSTEM =====
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(2, 5));
    this.lifespan = 255;
    this.size = random(5, 10);
  }

  update() { this.pos.add(this.vel); this.lifespan -= 5; }
  display() { noStroke(); fill(255, 150, 0, this.lifespan); ellipse(this.pos.x, this.pos.y, this.size); }
  isDead() { return this.lifespan <= 0; }
}

function attackPizza(pizza) {
  pizza.health -= 1;
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(pizza.pos.x, pizza.pos.y));
  }
  if (pizza.health <= 0) {
    let index = badPizzas.indexOf(pizza);
    if (index > -1) badPizzas.splice(index, 1);
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function checkWin() {
  if (badPizzas.length === 0) gameOver = true;
}

// ===== THROW PIZZA =====
function keyPressed() {
  if (key === ' ') {
    thrownPizzas.push(new ThrownPizza(ninja.pos.x, ninja.pos.y - ninja.size/2));
  }
}