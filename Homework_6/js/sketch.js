let ninja;
let ninjaIdle = [];
let ninjaWalk = [];
let currentAnimation = [];
let animationFrame = 0;
let animationTimer = 0;
let animationSpeed = 10; // frames per change

let foods = [];

function preload() {
  // Load ninja idle images
  ninjaIdle.push(loadImage("images/ninja_idle_0.png"));
  ninjaIdle.push(loadImage("images/ninja_idle_1.png"));

  // Load ninja walking images
  ninjaWalk.push(loadImage("images/ninja_run_0.png"));
  ninjaWalk.push(loadImage("images/ninja_run_1.png"));

  // Load pizza image (optional for reference)
  pizzaImg = loadImage("images/pizza.png");
}

function setup() {
  createCanvas(800, 600);
  
  // Start with idle animation
  currentAnimation = ninjaIdle;

  // Create 5 food objects
  foods.push(new Food(100, 200, 50, "red"));
  foods.push(new Food(300, 150, 40, "yellow"));
  foods.push(new Food(500, 300, 60, "orange"));
  foods.push(new Food(650, 100, 35, "green"));
  foods.push(new Food(400, 450, 45, "pink"));

  ninja = {
    x: width/2,
    y: height/2,
    speed: 3
  };
}

function draw() {
  background(220);

  // Display all food objects
  for (let food of foods) {
    food.display();
  }

  handleNinja();
}

function handleNinja() {
  // Movement
  let moving = false;
  if (keyIsDown(LEFT_ARROW)) {
    ninja.x -= ninja.speed;
    moving = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    ninja.x += ninja.speed;
    moving = true;
  }
  if (keyIsDown(UP_ARROW)) {
    ninja.y -= ninja.speed;
    moving = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    ninja.y += ninja.speed;
    moving = true;
  }

  // Switch animation based on movement
  currentAnimation = moving ? ninjaWalk : ninjaIdle;

  // Animate ninja
  animationTimer++;
  if (animationTimer % animationSpeed === 0) {
    animationFrame = (animationFrame + 1) % currentAnimation.length;
  }

  imageMode(CENTER);
  image(currentAnimation[animationFrame], ninja.x, ninja.y);
}