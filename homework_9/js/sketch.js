let player;
let keys = {};

function setup() {
  new Canvas(800, 600);
  player = new Sprite(400, 300, 40, 40, "none");
  player.color = "red";

  // attach key listeners directly to the window
  window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
  });
  window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
  });
}

function draw() {
  background(220);

  if (keys["ArrowLeft"]  || keys["a"]) player.x -= 4;
  if (keys["ArrowRight"] || keys["d"]) player.x += 4;
  if (keys["ArrowUp"]    || keys["w"]) player.y -= 4;
  if (keys["ArrowDown"]  || keys["s"]) player.y += 4;

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("ArrowLeft:  " + !!keys["ArrowLeft"],  20, 30);
  text("ArrowRight: " + !!keys["ArrowRight"], 20, 50);
  text("ArrowUp:    " + !!keys["ArrowUp"],    20, 70);
  text("ArrowDown:  " + !!keys["ArrowDown"],  20, 90);
  text("x: " + round(player.x) + "  y: " + round(player.y), 20, 110);
  text("Press arrow keys - no click needed", 20, 140);
}