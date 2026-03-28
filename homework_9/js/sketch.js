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
  ninjaIdle = loadImage(
    "images/ninja_idle.png",
    () => console.log("idle loaded"),
    () => console.log("idle FAILED")
  );

  ninjaWalk1 = loadImage(
    "images/ninja_walk1.png",
    () => console.log("walk1 loaded"),
    () => console.log("walk1 FAILED")
  );

  ninjaWalk2 = loadImage(
    "images/ninja_walk2.png",
    () => console.log("walk2 loaded"),
    () => console.log("walk2 FAILED")
  );

  pizzaImg = loadImage(
    "images/pizza.png",
    () => console.log("pizza loaded"),
    () => console.log("pizza FAILED")
  );

  badPizzaImg = loadImage(
    "images/bad_pizza.png",
    () => console.log("bad pizza loaded"),
    () => console.log("bad pizza FAILED")
  );

  rockImg = loadImage(
    "images/rock.png",
    () => console.log("rock loaded"),
    () => console.log("rock FAILED")
  );
}

function setup() {
  new Canvas(800, 600);

  // PLAYER
  player = new Sprite(400, 300, 50, 50);
  player.img = ninjaIdle;
  player.scale = 0.4;

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

    // win / lose
    if (score >= 10) {
      gameState = "win";
    }

    if (health <= 0) {
      gameState = "lose";
    }
  }

  // UI
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: " + score, 20, 30);
  text("Health: " + health, 20, 60);

  // WIN SCREEN
  if (gameState === "win") {
    textSize(50);
    textAlign(CENTER);
    text("YOU WIN!", width / 2, height / 2);
  }

  // LOSE SCREEN
  if (gameState === "lose") {
    textSize(50);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);
  }
}

function handleMovement() {
  player.vel.x = 0;
  player.vel.y = 0;

  let moving = false;

  // LEFT
  if (kb.pressing("left") || kb.pressing("a")) {
    player.vel.x = -4;
    moving = true;
  }

  // RIGHT
  if (kb.pressing("right") || kb.pressing("d")) {
    player.vel.x = 4;
    moving = true;
  }

  // UP
  if (kb.pressing("up") || kb.pressing("w")) {
    player.vel.y = -4;
    moving = true;
  }

  // DOWN
  if (kb.pressing("down") || kb.pressing("s")) {
    player.vel.y = 4;
    moving = true;
  }

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