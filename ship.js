class Ship {
  constructor(shipImage) {
    this.ship = createSprite(width / 2, height / 2);
    this.ship.maxSpeed = 6;
    this.ship.friction = 0.98;
    this.ship.setCollider("circle", 0, 0, 20);
    this.ship.addImage("normal", shipImage);
    this.ship.addAnimation(
      "thrust",
      "assets/ship0002.png",
      "assets/ship0007.png"
    );
    this.ship.rotation = -90;
  }

  move() {
    if (keyDown(LEFT_ARROW)) this.ship.velocity.x -= 200;
    if (keyDown(RIGHT_ARROW)) this.ship.velocity.x += 200;
    if (keyDown(UP_ARROW)) {
      this.ship.addSpeed(0.2, this.ship.rotation);
      this.ship.velocity.y -= 70;
      this.ship.changeAnimation("thrust");
    } else if (keyDown(DOWN_ARROW)) {
      this.ship.velocity.y += 70;
    } else this.ship.changeAnimation("normal");
  }

  getProperties() {
    return this.ship;
  }
}
