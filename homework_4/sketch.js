// Elk in Forest — HW 4
// Author: Josh Holt

let elkX = 300;
let elkY = 330;
let speed = 2;

let leaves = [];

// IMAGES 
let imgOne;
let imgTwo;
let imgThree; //  generative AI

// FONT
let titleFont;

// TIMER VARIABLES
let driftDirection = 1;

function preload() {
  imgOne = loadImage("images/elk.jpeg");   // 
  imgTwo = loadImage("images/long grass.jpeg");   // 
  imgThree = loadImage("images/Firefly_Gemini Flash_an elk herd 508416.png"); //  (AI image)

  titleFont = loadFont("assets/PlaypenSans-Regular.ttf"); // replace
}

function setup() {
  createCanvas(600, 400);
  noStroke();
  textFont(titleFont);

  // floating leaves
  for (let i = 0; i < 15; i++) {
    leaves.push({
      x: random(width),
      y: random(200, 360),
      dx: random(-0.5, 0.5),
      dy: random(-0.3, 0.3)
    });
  }

  // TIMER-BASED MOVEMENT (required)
  setInterval(changeDrift, 2000);
}

function draw() {
  background(135, 206, 235); // sky

  // IMAGE BACKGROUND
  image(imgOne, 0, 0, width, height);

  // TITLE
  fill(0);
  textSize(20);
  text("Elk In Forest", 10, 25);

  // GROUND
  fill(70, 140, 90);
  rect(0, 250, width, 150);

  // OVERLAY IMAGE
  tint(255, 120);
  image(imgTwo, 0, 250, width, 150);
  noTint();

  // FLOATING LEAVES (timer-influenced)
  for (let leaf of leaves) {
    fill(200, 180, 80);
    ellipse(leaf.x, leaf.y, 6, 4);

    leaf.x += leaf.dx * driftDirection;
    leaf.y += leaf.dy;

    if (leaf.x < 0 || leaf.x > width) leaf.dx *= -1;
    if (leaf.y < 240 || leaf.y > 360) leaf.dy *= -1;
  }

  // KEYBOARD MOVEMENT
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) elkX -= speed;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) elkX += speed;
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) elkY -= speed;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) elkY += speed;

  elkX = constrain(elkX, 40, width - 40);
  elkY = constrain(elkY, 290, 350);

  drawElk(elkX, elkY);

  // AI IMAGE ATTACHED TO ELK (symbolic)
  image(imgThree, elkX - 30, elkY - 40, 60, 40);

  // NAME
  fill(0);
  textSize(12);
  text("Josh Holt", width - 90, height - 10);
}

// TIMER FUNCTION
function changeDrift() {
  driftDirection *= -1;
}

// DRAW TREE
function drawTree(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  fill(120, 85, 60);
  rect(-8, 0, 16, 50);

  fill(50, 130, 80);
  triangle(-30, 10, 0, -40, 30, 10);
  triangle(-25, -10, 0, -60, 25, -10);

  pop();
}

// DRAW ELK
function drawElk(x, y) {
  push();
  translate(x, y);

  fill(140, 100, 70);
  ellipse(0, 0, 50, 25);
  ellipse(30, -10, 20, 15);

  rect(-15, 10, 5, 20);
  rect(-5, 10, 5, 20);
  rect(5, 10, 5, 20);
  rect(15, 10, 5, 20);

  stroke(100, 70, 50);
  line(30, -18, 35, -35);
  line(30, -18, 25, -35);
  noStroke();

  pop();
}

// MOUSE INTERACTION
function mousePressed() {
  for (let leaf of leaves) {
    leaf.dx = random(-1, 1);
    leaf.dy = random(-1, 1);
  }
}
