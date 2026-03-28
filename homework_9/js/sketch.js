let player;

function setup() {
  new Canvas(800, 600);
  player = new Sprite(400, 300, 40, 40, "none");
  player.color = "red";
}

function draw() {
  background(220);

  // Use plain p5.js keyIsDown instead of kb.pressing
  if (keyIsDown(LEFT_ARROW)  || keyIsDown(65))  player.x -= 4; // 65 = A
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))  player.x += 4; // 68 = D
  if (keyIsDown(UP_ARROW)    || keyIsDown(87))  player.y -= 4; // 87 = W
  if (keyIsDown(DOWN_ARROW)  || keyIsDown(83))  player.y += 4; // 83 = S

  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("keyIsDown LEFT:  " + keyIsDown(LEFT_ARROW),  20, 30);
  text("keyIsDown RIGHT: " + keyIsDown(RIGHT_ARROW), 20, 50);
  text("keyIsDown UP:    " + keyIsDown(UP_ARROW),    20, 70);
  text("keyIsDown DOWN:  " + keyIsDown(DOWN_ARROW),  20, 90);
  text("x: " + round(player.x) + "  y: " + round(player.y), 20, 110);
  text("Click canvas then press arrow keys or WASD", 20, 140);
}