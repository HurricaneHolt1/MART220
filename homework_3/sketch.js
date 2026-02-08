let elkX = 300;
let elkY = 330;
let speed = 2;

let leaves = [];

function setup() {
  createCanvas(600, 400);
  noStroke();

  // create floating leaves
  for (let i = 0; i < 15; i++) {
    leaves.push({
      x: random(width),
      y: random(200, 360),
      dx: random(-0.5, 0.5),
      dy: random(-0.3, 0.3)
    });
  }
}

function draw() {
  background(135, 206, 235); // sky

  // title
  fill(0);
  textSize(16);
  text("Forest Passage", 10, 20);

  // ground
  fill(70, 140, 90);
  rect(0, 250, width, 150);

  // sun
  fill(255, 220, 120);
  ellipse(520, 80, 60, 60);

  // trees
  for (let x = 60; x < width; x += 120) {
    drawTree(x, 260, 0.8);
  }

  // floating leaves (random motion)
  for (let leaf of leaves) {
    fill(200, 180, 80);
    ellipse(leaf.x, leaf.y, 6, 4);

    leaf.x += leaf.dx;
    leaf.y += leaf.dy;

    if (leaf.x < 0 || leaf.x > width) leaf.dx *= -1;
    if (leaf.y < 240 || leaf.y > 360) leaf.dy *= -1;
  }

  // elk movement
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) elkX -= speed;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) elkX += speed;
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) elkY -= speed;
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) elkY += speed;

  elkX = constrain(elkX, 40, width - 40);
  elkY = constrain(elkY, 290, 350);

  drawElk(elkX, elkY);

  // name (lower-right)
  fill(0);
  textSize(12);
  text("Josh Holt", width - 80, height - 10);
}

// draw tree
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

// draw elk
function drawElk(x, y) {
  push();
  translate(x, y);

  // body
  fill(140, 100, 70);
  ellipse(0, 0, 50, 25);

  // head
  ellipse(30, -10, 20, 15);

  // legs
  rect(-15, 10, 5, 20);
  rect(-5, 10, 5, 20);
  rect(5, 10, 5, 20);
  rect(15, 10, 5, 20);

  // antlers
  stroke(100, 70, 50);
  line(30, -18, 35, -35);
  line(30, -18, 25, -35);
  noStroke();

  pop();
}

// mouse interaction: scatter leaves
function mousePressed() {
  for (let leaf of leaves) {
    leaf.dx = random(-1, 1);
    leaf.dy = random(-1, 1);
  }
}
