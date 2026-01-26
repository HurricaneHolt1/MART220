function setup() {
  createCanvas(600, 400);
  noStroke();
}

function draw() {
  background(135, 206, 235); // sky

  // distant ground
  fill(90, 170, 100);
  rect(0, 250, width, 150);

  // sun
  fill(255, 220, 120);
  ellipse(500, 80, 60, 60);

  // distant trees
  drawTree(100, 260, 0.5);
  drawTree(200, 255, 0.6);
  drawTree(300, 265, 0.5);
  drawTree(400, 250, 0.6);
  drawTree(520, 260, 0.5);

  // midground trees
  drawTree(150, 290, 0.8);
  drawTree(300, 300, 0.9);
  drawTree(450, 295, 0.85);

  // foreground trees
  drawTree(80, 330, 1.2);
  drawTree(260, 340, 1.3);
  drawTree(480, 335, 1.25);

  // foreground grass
  fill(60, 140, 80);
  rect(0, 320, width, 80);
}

function drawTree(x, y, s) {
  push();
  translate(x, y);
  scale(s);

  // trunk
  fill(120, 85, 60);
  rect(-10, 0, 20, 50);

  // foliage layers
  fill(40, 120, 60);
  triangle(-40, 10, 0, -50, 40, 10);

  fill(50, 150, 80);
  triangle(-35, -10, 0, -70, 35, -10);

  fill(30, 100, 50);
  triangle(-30, -30, 0, -90, 30, -30);

  pop();
}
