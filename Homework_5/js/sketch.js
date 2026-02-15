// -------- ARRAYS FOR PIZZA --------
let pizzaX = [];
let pizzaY = [];
let totalPizza = 5;

// -------- ANIMATION VARIABLE --------
let lightPulse = 0;

function setup() {
  createCanvas(600, 400);

  // Arrange pizza slices across tables
  let startX = 120;
  let spacing = 100;

  for (let i = 0; i < totalPizza; i++) {
    pizzaX[i] = startX + i * spacing;
    pizzaY[i] = 250;
  }
}

function draw() {
  drawRestaurantBackground();

  // ---- DRAW MULTIPLE PIZZAS USING LOOP ----
  for (let i = 0; i < totalPizza; i++) {
    drawPizza(pizzaX[i], pizzaY[i]);
  }

  // ---- ANIMATION LOOP (Flickering Lights) ----
  drawLights();
}


// -------- PIZZA FUNCTION --------
function drawPizza(x, y) {
  push();
  translate(x, y);

  // crust
  fill(230, 180, 90);
  arc(0, 0, 80, 80, PI, TWO_PI);

  // cheese
  fill(255, 220, 100);
  triangle(-40, 0, 40, 0, 0, -100);

  // pepperoni
  fill(180, 50, 50);
  circle(0, -40, 15);
  circle(-15, -25, 12);
  circle(15, -25, 12);

  pop();
}


// -------- RESTAURANT BACKGROUND --------
function drawRestaurantBackground() {
  // Wall
  background(180, 50, 50);

  // Floor
  fill(140, 90, 50);
  rect(0, 300, width, 100);

  // Tables
  fill(100, 60, 35);
  rect(80, 270, 120, 20);
  rect(200, 270, 120, 20);
  rect(320, 270, 120, 20);
  rect(440, 270, 120, 20);

  // Picture frame
  fill(255);
  rect(250, 70, 100, 60);

  fill(120, 200, 120);
 rect(260, 80, 80, 40);
}


// -------- LIGHT ANIMATION --------
function drawLights() {

  // animation value
  lightPulse = 180 + sin(frameCount * 0.08) * 40;

  // ceiling lights drawn with loop
  for (let i = 100; i < width; i += 200) {
    fill(255, 255, 150, 120);
    circle(i, 50, lightPulse);
  }
}
