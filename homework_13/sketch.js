let myModel;

let textures = [];
let objects = [];

let titleG, nameG;

// CLASS for orbiting textured objects
class OrbitObject {
  constructor(tex, type) {
    this.texture = tex;
    this.type = type;

    this.radius = random(150, 300);
    this.angle = random(TWO_PI);
    this.speed = random(0.01, 0.03);
    this.yOffset = random(-100, 100);
  }

  update() {
    this.angle += this.speed;
  }

  display() {
    push();

    let x = cos(this.angle) * this.radius;
    let z = sin(this.angle) * this.radius;

    translate(x, this.yOffset, z);
    rotateY(frameCount * 0.02);

    texture(this.texture);

    if (this.type === 0) box(50);
    else if (this.type === 1) sphere(30);
    else if (this.type === 2) cone(30, 60);
    else if (this.type === 3) cylinder(25, 60);
    else torus(30, 10);

    pop();
  }

  randomizePosition() {
    this.radius = random(150, 300);
    this.yOffset = random(-150, 150);
  }
}

function preload() {
  // Load 3D model (from images folder)
  myModel = loadModel('images/pizza.obj', true);

  // Load textures (from images folder)
  textures[0] = loadImage('images/text1.jpg');
  textures[1] = loadImage('images/text2.jpeg');
  textures[2] = loadImage('images/text3.jpg');
  textures[3] = loadImage('images/text4.jpg');
  textures[4] = loadImage('images/text5.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Create 5 orbiting objects using array
  for (let i = 0; i < 5; i++) {
    objects.push(new OrbitObject(textures[i], i));
  }

  // ----- TITLE -----
  titleG = createGraphics(400, 100);
  titleG.background(30);
  titleG.fill(255);
  titleG.textSize(40);
  titleG.textAlign(CENTER, CENTER);
  titleG.text("Orbital Pizza System", 200, 50);

  // ----- NAME -----
  nameG = createGraphics(400, 100);
  nameG.background(30);
  nameG.fill(255);
  nameG.textSize(28);
  nameG.textAlign(CENTER, CENTER);
  nameG.text("By Josh Holt", 200, 50);
}

function draw() {
  background(30);

  // Mouse-controlled camera
  orbitControl();

  // Lighting
  directionalLight(255, 255, 255, 0.6, 1, -1);
  ambientLight(120);

  // ----- CENTRAL MODEL (FOCAL POINT) -----
  push();
  rotateX(-PI / 2); // fix orientation
  rotateY(frameCount * 0.01);
  scale(2);

  model(myModel); // uses .mtl + texture automatically

  pop();

  // ----- ORBITING OBJECTS (ARRAY + LOOP) -----
  for (let obj of objects) {
    obj.update();
    obj.display();
  }

  // ----- TITLE -----
  push();
  translate(0, -height / 2 + 80, 0);
  rotateX(-PI / 6);
  texture(titleG);
  plane(400, 100);
  pop();

  // ----- NAME -----
  push();
  translate(0, height / 2 - 80, 0);
  rotateX(-PI / 6);
  texture(nameG);
  plane(400, 100);
  pop();
}

// ----- INTERACTION -----
function mousePressed() {
  // Move at least two objects randomly
  objects[0].randomizePosition();
  objects[1].randomizePosition();
}