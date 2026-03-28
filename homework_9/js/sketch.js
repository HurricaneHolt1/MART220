let player;
let pizzas = [];
let badPizzas = [];
let obstacles = [];

let score = 0;
let health = 5;
let gameState = "play";

// images
let ninjaIdle;
let ninjaWalk1;
let ninjaWalk2;
let pizzaImg;
let badPizzaImg;
let rockImg;

function preload() {
  ninjaIdle   = loadImage("images/ninja_idle.png");
  ninjaWalk1  = loadImage("images/ninja_walk1.png");
  ninjaWalk2  = loadImage("images/ninja_walk2.png");
  pizzaImg    = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg     = loadImage("images/rock.png");
}

function setup() {
  new Canvas(800, 600);

  // PLAYER
  player = new Sprite(400, 300, 50, 50);
  player.img = ninjaIdle;
  player.scale = 0.4;
  player.rotationLock = true;

  // ROCK OBSTACLES
  for (let i = 0; i < 3; i++) {
    let rock = new Sprite(
      random(100, 700),
      random(100, 500),
      60,
      60,
      "static"
    );
    rock.img = rockImg;
    rock.scale = 0.3;
    obstacles.push(rock);
  }

  // GOOD PIZZAS
  for (let i = 0; i < 5; i++) {
    let pizza = new Sprite(
      random(50, 750),
      random(50, 550),
      30,
      30
    );
    pizza.img = pizzaImg;
    pizza.scale = 0.2;
    pizzas.push(pizza);
  }

  // BAD PIZZAS
  for (let i = 0; i < 3; i++) {
    let bad = new Sprite(
      random(50, 750),
      random(50, 550),
      30,
      30
    );
    bad.img = badPizzaImg;
    bad.scale = 0.2;
    badPizzas.push(bad);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();

    // collide with rocks
    for (let rock of obstacles) {
      player.collides(rock);
    }

    // collect good pizzas
    for (let pizza of pizzas) {
      if (player.overlaps(pizza)) {
        score++;
        pizza.x = random(50, 750);
        pizza.y = random(50, 550);
      }
    }

    // hit bad pizzas
    for (let bad of badPizzas) {
      if (player.overlaps(bad)) {
        health--;
        bad.x = random(50, 750);
        bad.y = random(50, 550);
      }
    }

    if (score >= 10) gameState = "win";
    if (health <= 0)  gameState = "lose";
  }

  // UI
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: "  + score,  20, 30);
  text("Health: " + health, 20, 60);

  // WIN SCREEN
  if (gameState === "win") {
    textSize(50);
    textAlign(CENTER);
    fill(0);
    text("YOU WIN!", width / 2, height / 2);
  }

  // LOSE SCREEN
  if (gameState === "lose") {
    textSize(50);
    textAlign(CENTER);
    fill(0);
    text("GAME OVER", width / 2, height / 2);
  }
}

function handleMovement() {
  let vx = 0;
  let vy = 0;
  let moving = false;

  if (kb.pressing("left")  || kb.pressing("a")) { vx = -4; moving = true; }
  if (kb.pressing("right") || kb.pressing("d")) { vx =  4; moving = true; }
  if (kb.pressing("up")    || kb.pressing("w")) { vy = -4; moving = true; }
  if (kb.pressing("down")  || kb.pressing("s")) { vy =  4; moving = true; }

  player.velocity.x = vx;
  player.velocity.y = vy;

  // WALK ANIMATION
  if (moving) {
    if (frameCount % 20 < 10) {
      player.img = ninjaWalk1;
    } else {
      player.img = ninjaWalk2;
    }
  } else {
    player.img = ninjaIdle;
  }
}
