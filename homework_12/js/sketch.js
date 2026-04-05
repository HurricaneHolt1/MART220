let angle1 = 0;
let angle2 = 0;
let angle3 = 0;
let angle4 = 0;
let angle5 = 0;

let titleGraphics;
let nameGraphics;
let textAngle = 0; // rotation for floating effect

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // --- TITLE OFFSCREEN GRAPHICS ---
  titleGraphics = createGraphics(400, 100);
  titleGraphics.background(30); // match canvas background
  titleGraphics.fill(255);
  titleGraphics.textSize(48);
  titleGraphics.textAlign(CENTER, CENTER);
  titleGraphics.text("3D Exploration", 200, 50);
  titleGraphics.textFont('Arial');

  // --- NAME OFFSCREEN GRAPHICS ---
  nameGraphics = createGraphics(400, 100);
  nameGraphics.background(30); // match canvas background
  nameGraphics.fill(255);
  nameGraphics.textSize(32);
  nameGraphics.textAlign(CENTER, CENTER);
  nameGraphics.text("By Josh Holt", 200, 50);
  nameGraphics.textFont('Arial');
}

function draw() {
  background(30);

  // Lighting
  directionalLight(255, 255, 255, 0.25, 0.25, -1);
  ambientLight(100);

  // ----- 3D SHAPES -----
  push();
  translate(-200, -100, 0);
  rotateX(angle1);
  rotateY(angle1 * 0.3);
  ambientMaterial(200, 50, 50);
  box(100);
  pop();

  push();
  translate(150, -150, -100);
  rotateY(angle2);
  specularMaterial(50, 200, 50);
  sphere(60);
  pop();

  push();
  translate(-150, 150, 50);
  rotateX(angle3);
  normalMaterial();
  cone(50, 120);
  pop();

  push();
  translate(200, 100, 100);
  rotateY(angle4);
  ambientMaterial(50, 50, 200);
  cylinder(40, 120);
  pop();

  push();
  translate(0, 0, 200);
  rotateX(angle5);
  rotateY(angle5 * 0.5);
  specularMaterial(200, 200, 50);
  torus(70, 20);
  pop();

  // Update rotations
  angle1 += 0.01;
  angle2 += 0.02;
  angle3 += 0.015;
  angle4 += 0.018;
  angle5 += 0.013;

  // ----- FLOATING TEXT (WITH ROTATION) -----
  textAngle += 0.005; // slow rotation

  // Title
  push();
  translate(0, -height / 2 + 80, 0);
  rotateX(-PI / 6);
  rotateY(textAngle);
  texture(titleGraphics);
  plane(400, 100);
  pop();

  // Name
  push();
  translate(0, height / 2 - 80, 0);
  rotateX(-PI / 6);
  rotateY(-textAngle); // opposite direction for contrast
  texture(nameGraphics);
  plane(400, 100);
  pop();
}