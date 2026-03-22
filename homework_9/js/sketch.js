let player;
let pizzas;
let badPizzas;
let obstacles;

let score = 0;
let health = 5;
let gameState = "play";

function preload() {
  idleImg = loadImage("images/ninja_idle.png");
  walk1 = loadImage("images/ninja_walk1.png");
  walk2 = loadImage("images/ninja_walk2.png");

  pizzaImg = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg = loadImage("images/rock.png");
}

function setup() {
  createCanvas(800, 600);

  // Player sprite
  player = createSprite(400, 300, 50, 50);
  player.addAnimation("idle", idleImg);
  player.addAnimation("walk", walk1, walk2);
  player.scale = 0.5;

  // Groups
  pizzas = new Group();
  badPizzas = new Group();
  obstacles = new Group();

  // Spawn pizzas
  for (let i = 0; i < 5; i++) {
    let p = createSprite(random(width), random(height), 30, 30);
    p.addImage(pizzaImg);
    pizzas.add(p);
  }

  // Spawn bad pizzas
  for (let i = 0; i < 3; i++) {
    let b = createSprite(random(width), random(height), 30, 30);
    b.addImage(badPizzaImg);
    badPizzas.add(b);
  }

  // Spawn obstacles (immovable)
  for (let i = 0; i < 3; i++) {
    let o = createSprite(random(width), random(height), 60, 60);
    o.addImage(rockImg);
    o.immovable = true;
    obstacles.add(o);
  }
}

function draw() {
  background(200);

  if (gameState === "play") {
    handleMovement();

    // Collisions
    player.collide(obstacles);

    player.overlap(pizzas, collectPizza);
    player.overlap(badPizzas, hitBad);

    drawSprites();

    // UI
    fill(0);
    textSize(20);
    text("Score: " + score, 20, 30);
    text("Health: " + health, 20, 60);

    // Win/Lose conditions
    if (score >= 10) {
      gameState = "win";
    }
    if (health <= 0) {
      gameState = "lose";
    }
  }

  else if (gameState === "win") {
    textSize(40);
    textAlign(CENTER);
    text("YOU WIN!", width/2, height/2);
  }

  else if (gameState === "lose") {
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2);
  }
}

function handleMovement() {
  let moving = false;

  player.velocity.x = 0;
  player.velocity.y = 0;

  if (keyDown("LEFT_ARROW") || keyDown("a")) {
    player.velocity.x = -4;
    moving = true;
  }
  if (keyDown("RIGHT_ARROW") || keyDown("d")) {
    player.velocity.x = 4;
    moving = true;
  }
  if (keyDown("UP_ARROW") || keyDown("w")) {
    player.velocity.y = -4;
    moving = true;
  }
  if (keyDown("DOWN_ARROW") || keyDown("s")) {
    player.velocity.y = 4;
    moving = true;
  }

  // Switch animation
  if (moving) {
    player.changeAnimation("walk");
  } else {
    player.changeAnimation("idle");
  }
}

// Collect good pizza
function collectPizza(player, pizza) {
  score++;
  pizza.position.x = random(width);
  pizza.position.y = random(height);
}

// Hit bad pizza
function hitBad(player, bad) {
  health--;
  bad.position.x = random(width);
  bad.position.y = random(height);
}