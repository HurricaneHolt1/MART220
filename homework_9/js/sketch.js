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

// manual key tracking — bypasses p5.play kb
let keys = {};

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

  // keyboard listeners on window — no click/focus needed
  window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
    // prevent arrow keys from scrolling the page
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
  });

  // PLAYER
  player = new Sprite(400, 300, 40, 40, "none");
  player.img = ninjaIdle;
  player.scale = 0.4;

  // ROCK GROUP
  rockGroup = new Group();
  for (let i = 0; i < 3; i++) {
    let rock = new rockGroup.Sprite(
      random(100, 700),
      random(100, 500)
    );
    rock.img = rockImg;
    rock.scale = 0.3;
    rock.collider = "none";
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
    pizza.collider = "none";
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
    bad.collider = "none";
    bad.width = 30;
    bad.height = 30;
    // random patrol velocity
    bad._vx = random(-1, 1) < 0 ? -2 : 2;
    bad._vy = random(-1, 1) < 0 ? -2 : 2;
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();
    moveBadPizzas();
    checkCollisions();

    if (score >= 10) gameState = "win";
    if (health <= 0)  gameState = "lose";
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
    textSize(24);
    text("Refresh to play again", width / 2, height / 2 + 60);
  }

  // LOSE SCREEN
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
}

function handleMovement() {
  let moving = false;

  if (keys["ArrowLeft"]  || keys["a"]) { player.x -= 4; moving = true; }
  if (keys["ArrowRight"] || keys["d"]) { player.x += 4; moving = true; }
  if (keys["ArrowUp"]    || keys["w"]) { player.y -= 4; moving = true; }
  if (keys["ArrowDown"]  || keys["s"]) { player.y += 4; moving = true; }

  // keep player inside canvas
  player.x = constrain(player.x, 20, width  - 20);
  player.y = constrain(player.y, 20, height - 20);

  // walk animation
  if (moving) {
    player.img = (frameCount % 20 < 10) ? ninjaWalk1 : ninjaWalk2;
  } else {
    player.img = ninjaIdle;
  }
}

function moveBadPizzas() {
  for (let bad of badPizzaGroup) {
    bad.x += bad._vx;
    bad.y += bad._vy;

    // bounce off edges
    if (bad.x < 20 || bad.x > width  - 20) bad._vx *= -1;
    if (bad.y < 20 || bad.y > height - 20) bad._vy *= -1;
  }
}

function checkCollisions() {
  let pw = 20; // player half-width
  let ph = 20; // player half-height

  // rocks — push player back out
  for (let rock of rockGroup) {
    if (rectsOverlap(player.x, player.y, pw, ph, rock.x, rock.y, 27, 27)) {
      // simple push back to previous position
      if (keys["ArrowLeft"]  || keys["a"]) player.x += 4;
      if (keys["ArrowRight"] || keys["d"]) player.x -= 4;
      if (keys["ArrowUp"]    || keys["w"]) player.y += 4;
      if (keys["ArrowDown"]  || keys["s"]) player.y -= 4;
    }
  }

  // good pizzas
  for (let pizza of pizzaGroup) {
    if (rectsOverlap(player.x, player.y, pw, ph, pizza.x, pizza.y, 15, 15)) {
      score++;
      pizza.x = random(50, 750);
      pizza.y = random(50, 550);
    }
  }

  // bad pizzas
  for (let bad of badPizzaGroup) {
    if (rectsOverlap(player.x, player.y, pw, ph, bad.x, bad.y, 15, 15)) {
      health--;
      bad.x = random(50, 750);
      bad.y = random(50, 550);
    }
  }
}

// axis-aligned bounding box overlap check
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return abs(ax - bx) < (aw + bw) && abs(ay - by) < (ah + bh);
}