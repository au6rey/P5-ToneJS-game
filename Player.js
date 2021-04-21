class Player {
  constructor() {
    this.health = 100;
    this.playerImage = loadImage("assets/Player/Idle/skeleton-idle_0.png");
    this.player = createSprite(width / 2, height / 2, 50, 50);
    this.player.maxSpeed = 5;
    this.player.scale = 0.5;

    // this.player.addImage("idle", playerImage)
    this.player.addAnimation(
      "idle",
      "assets/Player/Idle/skeleton-idle_0.png",
      "assets/Player/Idle/skeleton-idle_16.png"
    );

    this.player.addAnimation(
      "move",
      "assets/Player/Move/skeleton-move_0.png",
      "assets/Player/Move/skeleton-move_16.png"
    );
    this.player.rotation = -90;
  }

  idle() {}

  move(speed) {
    // if (keyIspressed)

    if (
      keyDown(LEFT_ARROW) ||
      keyDown(RIGHT_ARROW) ||
      keyDown(UP_ARROW) ||
      keyDown(DOWN_ARROW)
    ) {
      this.player.changeAnimation("move");
      if (keyDown(LEFT_ARROW)) {
        this.player.rotation = 180;
        this.player.velocity.x -= speed;
      }
      if (keyDown(RIGHT_ARROW)) {
        this.player.rotation = -360;
        this.player.velocity.x += speed;
      }
      if (keyDown(UP_ARROW)) {
        this.player.rotation = -90;
        //   this.player.addSpeed(5, this.player.mirror);
        this.player.velocity.y -= speed;
      }
      if (keyDown(DOWN_ARROW)) {
        this.player.rotation = 90;
        this.player.velocity.y += speed;
      }
    } else {
      this.player.setSpeed(0);
      this.player.changeAnimation("idle");
    }
  }

  attack() {}

  getProperties() {
    return this.player;
  }
}
