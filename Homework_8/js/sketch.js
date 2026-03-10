let ninja;

let pizzaImg;
let badFoodImg;

let goodFood;
let badFood;

let goodSound;
let badSound;
let music;

let score = 0;
let health = 5;

let musicStarted = false;

function preload(){

  pizzaImg = loadImage("images/pizza.png");
  badFoodImg = loadImage("images/poison.png");

  goodSound = loadSound("sounds/good.wav");
  badSound = loadSound("sounds/bad.wav");
  music = loadSound("sounds/music.mp3");

}

function setup(){

  createCanvas(800,600);

  ninja = createVector(width/2,height/2);

  goodFood = createVector(random(width),random(height));
  badFood = createVector(random(width),random(height));

}

function draw(){

  background(30);

  movePlayer();

  drawPlayer();
  drawFood();

  checkCollisions();

  displayUI();

}

function movePlayer(){

  if(keyIsDown(LEFT_ARROW)) ninja.x -= 5;
  if(keyIsDown(RIGHT_ARROW)) ninja.x += 5;
  if(keyIsDown(UP_ARROW)) ninja.y -= 5;
  if(keyIsDown(DOWN_ARROW)) ninja.y += 5;

}

function drawPlayer(){

  fill(255);
  circle(ninja.x,ninja.y,40);

}

function drawFood(){

  image(pizzaImg, goodFood.x, goodFood.y,40,40);
  image(badFoodImg, badFood.x, badFood.y,40,40);

}

function checkCollisions(){

  let goodDist = dist(ninja.x,ninja.y,goodFood.x,goodFood.y);

  if(goodDist < 30){

    score++;

    goodSound.play();

    goodFood.x = random(width);
    goodFood.y = random(height);

  }

  let badDist = dist(ninja.x,ninja.y,badFood.x,badFood.y);

  if(badDist < 30){

    health--;

    badSound.play();

    badFood.x = random(width);
    badFood.y = random(height);

  }

}

function displayUI(){

  fill(255);
  textSize(20);

  text("Score: " + score,20,30);
  text("Health: " + health,20,60);

}

function mousePressed(){

  if(!musicStarted){

    music.loop();
    musicStarted = true;

  }

}