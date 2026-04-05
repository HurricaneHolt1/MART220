let player;
let pizzaGroup, badPizzaGroup, rockGroup;
let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdleAnim, ninjaWalkAnim;
let pizzaImg, badPizzaImg, rockImg;

let keys = {};
let prevX, prevY;

function preload() {
  // Load images for animations
  ninjaIdleAnim  = loadAnimation("images/ninja_idle.png");
  ninjaWalkAnim  = loadAnimation("images/ninja_walk1.png","images/ninja_walk2.png");
  pizzaImg       = loadImage("images/pizza.png");
  badPizzaImg    = loadImage("images/bad_pizza.png");
  rockImg        = loadImage("images/rock.png");
}

function setup() {
  createCanvas(800, 600);

  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  // Player setup
  player = createSprite(400, 300, 40, 40);
  player.addAnimation("idle", ninjaIdleAnim);
  player.addAnimation("walk", ninjaWalkAnim);
  player.scale = 0.3;
  prevX = player.position.x;
  prevY = player.position.y;

  // Groups
  rockGroup = new Group();
  pizzaGroup = new Group();
  badPizzaGroup = new Group();

  for (let i=0; i<3; i++){
    let rock = createSprite(random(100,700), random(100,500));
    rock.addImage(rockImg);
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  for (let i=0; i<5; i++){
    let pizza = createSprite(random(50,750), random(50,550));
    pizza.addImage(pizzaImg);
    pizza.scale = 0.2;
    pizza._vx = random([-1.5,1.5]);
    pizza._vy = random([-1.5,1.5]);
    pizzaGroup.add(pizza);
  }

  for (let i=0; i<3; i++){
    let bad = createSprite(random(50,750), random(50,550));
    bad.addImage(badPizzaImg);
    bad.scale = 0.2;
    bad._vx = random([-2,2]);
    bad._vy = random([-2,2]);
    badPizzaGroup.add(bad);
  }
}

function draw() {
  background(220);

  if (gameState === "play") {
    prevX = player.position.x;
    prevY = player.position.y;

    handleMovement();
    movePizzas();
    checkCollisions();

    if(score>=10) gameState="win";
    if(health<=0) gameState="lose";
  }

  drawSprites();

  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: "+score, 20, 30);
  text("Health: "+health, 20, 60);

  if(gameState==="win"){
    fill(0,180,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("YOU WIN!", width/2, height/2);
  }

  if(gameState==="lose"){
    fill(180,0,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
  }
}

function handleMovement(){
  let moving = false;
  let facingRight = true;

  if(keys["ArrowLeft"] || keys["a"]){
    player.position.x -= 4;
    player.mirrorX(-1);
    moving = true;
    facingRight = false;
  }
  if(keys["ArrowRight"] || keys["d"]){
    player.position.x += 4;
    player.mirrorX(1);
    moving = true;
    facingRight = true;
  }
  if(keys["ArrowUp"] || keys["w"]){
    player.position.y -= 4;
    moving = true;
  }
  if(keys["ArrowDown"] || keys["s"]){
    player.position.y += 4;
    moving = true;
  }

  // stay in canvas
  player.position.x = constrain(player.position.x, 20, width-20);
  player.position.y = constrain(player.position.y, 20, height-20);

  if(moving){
    player.changeAnimation("walk");
  } else {
    player.changeAnimation("idle");
  }
}

function movePizzas(){
  for(let pizza of pizzaGroup){
    pizza.position.x += pizza._vx;
    pizza.position.y += pizza._vy;
    if(pizza.position.x<20 || pizza.position.x>width-20) pizza._vx*=-1;
    if(pizza.position.y<20 || pizza.position.y>height-20) pizza._vy*=-1;
  }

  for(let bad of badPizzaGroup){
    bad.position.x += bad._vx;
    bad.position.y += bad._vy;
    if(bad.position.x<20 || bad.position.x>width-20) bad._vx*=-1;
    if(bad.position.y<20 || bad.position.y>height-20) bad._vy*=-1;
  }
}

function checkCollisions(){
  let pw=18, ph=18;

  for(let rock of rockGroup){
    if(abs(player.position.x-rock.position.x)<25 && abs(player.position.y-rock.position.y)<25){
      player.position.x = prevX;
      player.position.y = prevY;
    }
  }

  for(let pizza of pizzaGroup){
    if(abs(player.position.x-pizza.position.x)<20 && abs(player.position.y-pizza.position.y)<20){
      score++;
      pizza.position.x = random(50,750);
      pizza.position.y = random(50,550);
    }
  }

  for(let bad of badPizzaGroup){
    if(abs(player.position.x-bad.position.x)<20 && abs(player.position.y-bad.position.y)<20){
      health--;
      bad.position.x = random(50,750);
      bad.position.y = random(50,550);
    }
  }
}