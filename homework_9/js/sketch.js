let player;
let pizzas = [];
let badPizzas = [];
let obstacles = [];

let score = 0;
let health = 5;
let gameState = "play";

let idleAnim, walkAnim;
let pizzaImg, badPizzaImg, rockImg;

// debug/version tag to ensure browser loads the updated file
console.log('sketch.js loaded — v2');

// Groups (p5.play)
let pizzasGroup, badPizzasGroup, obstaclesGroup, playersGroup;

// manual key state tracking (fallback if kb isn't available)
let inputStates = { left: false, right: false, up: false, down: false };

function keyPressed() {
  if (key === 'a' || key === 'A' || keyCode === LEFT_ARROW) inputStates.left = true;
  if (key === 'd' || key === 'D' || keyCode === RIGHT_ARROW) inputStates.right = true;
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) inputStates.up = true;
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) inputStates.down = true;
}

function keyReleased() {
  if (key === 'a' || key === 'A' || keyCode === LEFT_ARROW) inputStates.left = false;
  if (key === 'd' || key === 'D' || keyCode === RIGHT_ARROW) inputStates.right = false;
  if (key === 'w' || key === 'W' || keyCode === UP_ARROW) inputStates.up = false;
  if (key === 's' || key === 'S' || keyCode === DOWN_ARROW) inputStates.down = false;
}

function preload() {
  // Load animations
  idleAnim = loadAnimation("images/ninja_idle.png");
  walkAnim = loadAnimation("images/ninja_walk1.png", "images/ninja_walk2.png");

  // Load images
  pizzaImg = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg = loadImage("images/rock.png");
}

function setup() {
  createCanvas(800, 600);
  // prevent p5.play from auto-drawing sprites (we draw groups manually)
  this.p5play.autoDrawSprites = false;

  // Player setup
  player = createSprite(400, 300, 50, 50);
  player.addAnimation("idle", idleAnim);
  player.addAnimation("walk", walkAnim);
  player.scale = 0.5;
  playersGroup = new Group();
  playersGroup.add(player);

  // Obstacles
  for (let i = 0; i < 3; i++) {
    let o = createSprite(random(width), random(height), 60, 60);
    o.addImage(rockImg);
    o.static = true; // prevent moving on collision (p5.play uses `static` now)
    o.scale = 0.5;
    obstacles.push(o);
    if (!obstaclesGroup) obstaclesGroup = new Group();
    obstaclesGroup.add(o);
  }

  // Good pizzas
  for (let i = 0; i < 5; i++) {
    let p = createSprite(random(width), random(height), 30, 30);
    p.addImage(pizzaImg);
    p.scale = 0.2;
    pizzas.push(p);
    if (!pizzasGroup) pizzasGroup = new Group();
    pizzasGroup.add(p);
  }

  // Bad pizzas
  for (let i = 0; i < 3; i++) {
    let b = createSprite(random(width), random(height), 30, 30);
    b.addImage(badPizzaImg);
    b.scale = 0.2;
    badPizzas.push(b);
    if (!badPizzasGroup) badPizzasGroup = new Group();
    badPizzasGroup.add(b);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();

    // Debug overlay: show key states and player velocity
    fill(0);
    textSize(14);
    let leftState = (kb && kb.pressing) ? kb.pressing('ArrowLeft') : inputStates.left;
    let rightState = (kb && kb.pressing) ? kb.pressing('ArrowRight') : inputStates.right;
    let upState = (kb && kb.pressing) ? kb.pressing('ArrowUp') : inputStates.up;
    let downState = (kb && kb.pressing) ? kb.pressing('ArrowDown') : inputStates.down;
    text(`Left:${leftState} Right:${rightState} Up:${upState} Down:${downState}`, 20, 90);
    text(`Vel x:${player.velocity.x.toFixed(2)} y:${player.velocity.y.toFixed(2)}`, 20, 110);

    // Collisions with obstacles
    if (obstaclesGroup) player.collide(obstaclesGroup);

    // Collect pizzas (group-based)
    if (pizzasGroup) {
      player.overlap(pizzasGroup, function(pl, p) {
        score++;
        p.position.x = random(width);
        p.position.y = random(height);
      });
    }

    // Hit bad pizzas (group-based)
    if (badPizzasGroup) {
      player.overlap(badPizzasGroup, function(pl, b) {
        health--;
        b.position.x = random(width);
        b.position.y = random(height);
      });
    }

    // UI
    fill(0);
    textSize(20);
    text("Score: " + score, 20, 30);
    text("Health: " + health, 20, 60);

    // Win/Lose
    if (score >= 10) gameState = "win";
    if (health <= 0) gameState = "lose";

  } else if (gameState === "win") {
    textSize(40);
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
  } else if (gameState === "lose") {
    textSize(40);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
  }

  // draw groups (drawSprites is deprecated)
  if (obstaclesGroup) obstaclesGroup.draw();
  if (pizzasGroup) pizzasGroup.draw();
  if (badPizzasGroup) badPizzasGroup.draw();
  if (playersGroup) playersGroup.draw();
}

function handleMovement() {
  let moving = false;
  player.velocity.x = 0;
  player.velocity.y = 0;

  if (kb.pressing('ArrowLeft') || kb.pressing('a')) {
    player.velocity.x = -4;
    moving = true;
  }
  if (kb.pressing('ArrowRight') || kb.pressing('d')) {
    player.velocity.x = 4;
    moving = true;
  }
  if (kb.pressing('ArrowUp') || kb.pressing('w')) {
    player.velocity.y = -4;
    moving = true;
  }
  if (kb.pressing('ArrowDown') || kb.pressing('s')) {
    player.velocity.y = 4;
    moving = true;
  }
  // fallback to manual input tracking
  if (inputStates.left) { player.velocity.x = -4; moving = true; }
  if (inputStates.right) { player.velocity.x = 4; moving = true; }
  if (inputStates.up) { player.velocity.y = -4; moving = true; }
  if (inputStates.down) { player.velocity.y = 4; moving = true; }

  if (moving) {
    player.changeAnimation("walk");
  } else {
    player.changeAnimation("idle");
  }
}