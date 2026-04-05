let angle1 = 0;
let angle2 = 0;
let angle3 = 0;
let angle4 = 0;
let angle5 = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(30);

  // Lighting
  directionalLight(255, 255, 255, 0.25, 0.25, -1);
  ambientLight(100);

  // ----- BOX -----
  push();
  translate(-200, -100, 0);
  rotateX(angle1);
  rotateY(angle1 * 0.3);
  ambientMaterial(200, 50, 50);
  box(100);
  pop();

  // ----- SPHERE -----
  push();
  translate(150, -150, -100);
  rotateY(angle2);
  specularMaterial(50, 200, 50);
  sphere(60);
  pop();

  // ----- CONE -----
  push();
  translate(-150, 150, 50);
  rotateX(angle3);
  normalMaterial();
  cone(50, 120);
  pop();

  // ----- CYLINDER -----
  push();
  translate(200, 100, 100);
  rotateY(angle4);
  ambientMaterial(50, 50, 200);
  cylinder(40, 120);
  pop();

  // ----- TORUS -----
  push();
  translate(0, 0, 200);
  rotateX(angle5);
  rotateY(angle5 * 0.5);
  specularMaterial(200, 200, 50);
  torus(70, 20);
  pop();

  // Update rotation angles
  angle1 += 0.01;
  angle2 += 0.02;
  angle3 += 0.015;
  angle4 += 0.018;
  angle5 += 0.013;
}