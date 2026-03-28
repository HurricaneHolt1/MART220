let player;
let pizzaGroup;
let badPizzaGroup;
let rockGroup;

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
  player = new Sprite(400, 300, 40, 40);
  player.img = ninjaIdle;
  player.scale = 0.4;
  player.rotationLock = true;
  player.drag = 0;
  player.friction = 0;

  // ROCK GROUP (static obstacles)
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = new rockGroup.Sprite(
      random(100, 700),
      random(100, 500)
    );
    rock.img = rockImg;
    rock.scale = 0.3;
    rock.collider = "static";
    rock.width = 55;
    rock.height = 55;
  }

  // GOOD PIZZA GROUP
  pizzaGroup = new Group();
  for (let i = 0; i < 5; i++) {
    let pizza = new pizzaGroup.Sprite(
      random(50, 750),
      random(50, 550)
    );
    pizza.img = pizzaImg;
    pizza.scale = 0.2;
    pizza.collider = "static";
    pizza.width = 30;
    pizza.height = 30;
  }

  // BAD PIZZA GROUP
  badPizzaGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let bad = new badPizzaGroup.Sprite(
      random(50, 750),
      random(50, 550)
    );
    bad.img = badPizzaImg;
    bad.scale = 0.2;
    bad.collider = "static";
    bad.width = 30;
    bad.height = 30;
  }

  // Register collisions/overlaps ONCE using groups
  player.collides(rockGroup);

  player.overlaps(pizzaGroup, (player, pizza) => {
    score++;
    pizza.x = random(50, 750);
    pizza.y = random(50, 550);
  });

  player.overlaps(badPizzaGroup, (player, bad) => {
    health--;
    bad.x = random(50, 750);
    bad.y = random(50, 550);
  });
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();

    if (score >= 10) gameState = "win";
    if (health <= 0)  gameState = "lose";
  } else {
    // stop player on win/lose
    player.vel.x = 0;
    player.vel.y = 0;
  }

  // UI
  fill(0);
  noStroke();
  textSize(24);
  textAlign(LEFT);
  text("Score: "  + score,  20, 30);
  text("Health: " + health, 20, 60);

  // WIN SCREEN
  if (gameState === "win") {
    fill(0, 180, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
  }

  // LOSE SCREEN
  if (gameState === "lose") {
    fill(180, 0, 0, 180);
    rect(0, 0, width, height);
    fill(255);
    textSize(60);
    textAlign(CENTER, CENTER);
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

  player.vel.x = vx;
  player.vel.y = vy;

  // WALK ANIMATION
  if (moving) {
    player.img = (frameCount % 20 < 10) ? ninjaWalk1 : ninjaWalk2;
  } else {
    player.img = ninjaIdle;
  }
}