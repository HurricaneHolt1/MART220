// ===== GLOBAL VARIABLES =====
let player;
let pizzaGroup;
let badPizzaGroup;
let rockGroup;
let particles = [];
let attacks = [];

let score = 0;
let health = 5;
let gameState = "play";

let ninjaIdle, ninjaWalk1, ninjaWalk2;
let pizzaImg, badPizzaImg, rockImg, attackImg;

let keys = {};
let prevX, prevY;

// ===== PRELOAD IMAGES =====
function preload() {
  ninjaIdle   = loadImage("images/ninja_idle.png");
  ninjaWalk1  = loadImage("images/ninja_walk1.png");
  ninjaWalk2  = loadImage("images/ninja_walk2.png");
  pizzaImg    = loadImage("images/pizza.png");
  badPizzaImg = loadImage("images/bad_pizza.png");
  rockImg     = loadImage("images/rock.png");
  attackImg   = loadImage("images/pizza.png"); // use same pizza image as projectile
}

function setup() {
  createCanvas(800, 600);

  // key tracking
  window.addEventListener("keydown", e => keys[e.key] = true);
  window.addEventListener("keyup", e => keys[e.key] = false);

  // ===== PLAYER =====
  player = new Sprite(400, 300, 40, 40);
  player.img = ninjaIdle;
  player.scale = 0.4;
  prevX = player.x;
  prevY = player.y;

  // ===== ROCK GROUP =====
  rockGroup = new Group();
  for(let i=0;i<3;i++){
    let rock = new Sprite(random(100,700), random(100,500), 55, 55);
    rock.img = rockImg;
    rock.scale = 0.3;
    rockGroup.add(rock);
  }

  // ===== GOOD PIZZA GROUP =====
  pizzaGroup = new Group();
  for(let i=0;i<5;i++){
    let pizza = new Sprite(random(50,750), random(50,550), 30, 30);
    pizza.img = pizzaImg;
    pizza.scale = 0.2;
    pizza._vx = random([-1.5, 1.5]);
    pizza._vy = random([-1.5, 1.5]);
    pizzaGroup.add(pizza);
  }

  // ===== BAD PIZZA GROUP =====
  badPizzaGroup = new Group();
  for(let i=0;i<3;i++){
    let bad = new Sprite(random(50,750), random(50,550), 30, 30);
    bad.img = badPizzaImg;
    bad.scale = 0.2;
    bad._vx = random([-2,2]);
    bad._vy = random([-2,2]);
    bad.health = 3;
    badPizzaGroup.add(bad);
  }
}

function draw() {
  background(220);

  if(gameState==="play"){
    prevX = player.x;
    prevY = player.y;

    handleMovement();
    movePizzas();
    handleAttacks();
    checkCollisions();
    updateParticles();

    if(badPizzaGroup.length===0) gameState="win";
    if(health<=0) gameState="lose";
  }

  // UI
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Score: "+score, 20,30);
  text("Health: "+health,20,60);

  if(gameState==="win"){
    fill(0,180,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("YOU WIN!", width/2, height/2);
    textSize(24);
    text("Refresh to play again", width/2, height/2+60);
  }

  if(gameState==="lose"){
    fill(180,0,0,180);
    rect(0,0,width,height);
    fill(255);
    textSize(60);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(24);
    text("Refresh to play again", width/2, height/2+60);
  }
}

// ===== PLAYER MOVEMENT & ANIMATION =====
function handleMovement(){
  let moving=false;

  if(keys["ArrowLeft"]||keys["a"]){ player.x-=4; moving=true; player.facing=-1; }
  if(keys["ArrowRight"]||keys["d"]){ player.x+=4; moving=true; player.facing=1; }
  if(keys["ArrowUp"]||keys["w"]){ player.y-=4; moving=true; }
  if(keys["ArrowDown"]||keys["s"]){ player.y+=4; moving=true; }

  player.x = constrain(player.x,20,width-20);
  player.y = constrain(player.y,20,height-20);

  player.img = moving ? (frameCount%20<10?ninjaWalk1:ninjaWalk2) : ninjaIdle;

  // attack
  if(keys[" "]) fireAttack();
}

// ===== MOVE PIZZAS =====
function movePizzas(){
  for(let pizza of pizzaGroup){
    pizza.x += pizza._vx;
    pizza.y += pizza._vy;
    if(pizza.x<20||pizza.x>width-20) pizza._vx*=-1;
    if(pizza.y<20||pizza.y>height-20) pizza._vy*=-1;
  }

  for(let bad of badPizzaGroup){
    bad.x += bad._vx;
    bad.y += bad._vy;
    if(bad.x<20||bad.x>width-20) bad._vx*=-1;
    if(bad.y<20||bad.y>height-20) bad._vy*=-1;

    if(random(1)<0.02){ bad._vx=random([-2,2]); bad._vy=random([-2,2]); }
  }
}

// ===== ATTACKS =====
function fireAttack(){
  if(frameCount % 10 === 0){ // fire rate
    let attack = new Sprite(player.x, player.y, 20, 20);
    attack.img = attackImg;
    attack.scale = 0.2;
    attack.vel = createVector(player.facing*6,0);
    attacks.push(attack);
  }
}

function handleAttacks(){
  for(let i=attacks.length-1;i>=0;i--){
    let atk = attacks[i];
    atk.position.add(atk.vel);

    // remove offscreen
    if(atk.position.x<0 || atk.position.x>width){
      attacks.splice(i,1);
      continue;
    }

    // hit bad pizzas
    for(let j=badPizzaGroup.length-1;j>=0;j--){
      let bad = badPizzaGroup[j];
      if(rectsOverlap(atk.position.x, atk.position.y, 15,15, bad.x,bad.y,30,30)){
        bad.health--;
        for(let k=0;k<10;k++) particles.push(new Particle(bad.x,bad.y));
        attacks.splice(i,1);

        if(bad.health<=0) badPizzaGroup.remove(bad);
        break;
      }
    }
  }

  // draw attacks
  for(let atk of attacks){
    image(atk.img, atk.position.x, atk.position.y, atk.width, atk.height);
  }
}

// ===== COLLISIONS =====
function checkCollisions(){
  let pw=18, ph=18;

  for(let rock of rockGroup){
    if(rectsOverlap(player.x,player.y,pw,ph,rock.x,rock.y,25,25)){
      player.x=prevX;
      player.y=prevY;
    }
  }

  for(let pizza of pizzaGroup){
    if(rectsOverlap(player.x,player.y,pw,ph,pizza.x,pizza.y,13,13)){
      score++;
      pizza.x=random(50,750);
      pizza.y=random(50,550);
    }
  }

  for(let bad of badPizzaGroup){
    if(rectsOverlap(player.x,player.y,pw,ph,bad.x,bad.y,13,13)){
      health--;
      bad.x=random(50,750);
      bad.y=random(50,550);
      for(let i=0;i<10;i++) particles.push(new Particle(player.x,player.y));
    }
  }
}

// ===== PARTICLE SYSTEM =====
class Particle{
  constructor(x,y){
    this.pos=createVector(x,y);
    this.vel=p5.Vector.random2D().mult(random(2,5));
    this.lifespan=255;
    this.size=random(5,10);
  }
  update(){ this.pos.add(this.vel); this.lifespan-=5; }
  display(){ noStroke(); fill(255,150,0,this.lifespan); ellipse(this.pos.x,this.pos.y,this.size); }
  isDead(){ return this.lifespan<=0; }
}

function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    particles[i].update();
    particles[i].display();
    if(particles[i].isDead()) particles.splice(i,1);
  }
}

// ===== HELPER =====
function rectsOverlap(ax,ay,aw,ah,bx,by,bw,bh){
  return abs(ax-bx)<(aw+bw) && abs(ay-by)<(ah+bh);
}