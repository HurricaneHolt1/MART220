// MINIMAL DEBUG SKETCH
// Tests: 1) does the sprite move with vel.x, 2) does kb.pressing work

let player;

function setup() {
  new Canvas(800, 600);
  player = new Sprite(400, 300, 40, 40);
  player.color = "red";
  player.rotationLock = true;
  player.drag = 0;
  player.friction = 0;
}

function draw() {
  background(220);

  // try direct position nudge as a fallback
  if (kb.pressing("left"))  { player.x -= 4; }
  if (kb.pressing("right")) { player.x += 4; }
  if (kb.pressing("up"))    { player.y -= 4; }
  if (kb.pressing("down"))  { player.y += 4; }

  // show kb state on screen
  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("left:  " + kb.pressing("left"),  20, 30);
  text("right: " + kb.pressing("right"), 20, 50);
  text("up:    " + kb.pressing("up"),    20, 70);
  text("down:  " + kb.pressing("down"),  20, 90);
  text("player x: " + player.x, 20, 110);
  text("player y: " + player.y, 20, 130);
  text("Press arrow keys or WASD", 20, 160);
}