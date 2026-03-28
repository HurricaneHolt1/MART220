let player;

function setup() {
  new Canvas(800, 600);
  player = new Sprite(400, 300, 40, 40, "none");
  player.color = "red";
}

function draw() {
  background(220);

  if (kb.pressing("left"))  player.x -= 4;
  if (kb.pressing("right")) player.x += 4;
  if (kb.pressing("up"))    player.y -= 4;
  if (kb.pressing("down"))  player.y += 4;

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("left:  " + kb.pressing("left"),  20, 30);
  text("right: " + kb.pressing("right"), 20, 50);
  text("up:    " + kb.pressing("up"),    20, 70);
  text("down:  " + kb.pressing("down"),  20, 90);
  text("x: " + round(player.x) + "  y: " + round(player.y), 20, 110);
  text("Click the canvas first, then use arrow keys or WASD", 20, 140);
}