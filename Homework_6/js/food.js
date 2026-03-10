class Food {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  display() {
    fill(this.color);
    noStroke();

    // Randomly choose two shapes: circle or square
    if (random(1) < 0.5) {
      ellipse(this.x, this.y, this.size, this.size); // pizza slice as circle
    } else {
      rect(this.x - this.size/2, this.y - this.size/2, this.size, this.size); // pizza as square
    }
  }
}