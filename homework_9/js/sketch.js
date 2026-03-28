let player;
let pizzas = [];
let badPizzas = [];
let obstacles = [];

let score = 0;
let health = 5;
let gameState = "play";

function setup() {
  new Canvas(800, 600);

  // player
  player = new Sprite(400, 300, 50, 50);
  player.color = "red";

  // rocks
  for (let i = 0; i < 3; i++) {
    let rock = new Sprite(
      random(100, 700),
      random(100, 500),
      60,
      60,
      "static"
    );
    rock.color = "gray";
    obstacles.push(rock);
  }

  // good pizzas
  for (let i = 0; i < 5; i++) {
    let pizza = new Sprite(
      random(50, 750),
      random(50, 550),
      30,
      30
    );
    pizza.color = "yellow";
    pizzas.push(pizza);
  }

  // bad pizzas
  for (let i = 0; i < 3; i++) {
    let bad = new Sprite(
      random(50, 750),
      random(50, 550),
      30,
      30
    );
    bad.color = "green";
    badPizzas.push(bad);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    handleMovement();

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

    fill(0);
    textSize(24);
    text("Score: " + score, 20, 30);
    text("Health: " + health, 20, 60);

    if (score >= 10) gameState = "win";
    if (health <= 0) gameState = "lose";
  }

  if (gameState === "win") {
    textSize(50);
    textAlign(CENTER);
    text("YOU WIN!", width / 2, height / 2);
  }

  if (gameState === "lose") {
    textSize(50);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);
  }
}

function handleMovement() {
  player.vel.x = 0;
  player.vel.y = 0;

  if (kb.pressing("left") || kb.pressing("a")) {
    player.vel.x = -4;
  }

  if (kb.pressing("right") || kb.pressing("d")) {
    player.vel.x = 4;
  }

  if (kb.pressing("up") || kb.pressing("w")) {
    player.vel.y = -4;
  }

  if (kb.pressing("down") || kb.pressing("s")) {
    player.vel.y = 4;
  }
}