class Player {
  constructor() {
    this.health = 100;
    this.playerImage = loadImage("assets/Player/Idle/skeleton-idle_0.png");
    this.player = createSprite(width / 2, height / 2);
    this.player.maxSpeed = 5;
    this.player.scale = 0.4;
    this.player.setCollider("circle", 0, 0, 42);
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
    this.attackAnim = this.player.addAnimation(
      "attack",
      "assets/Player/Attack/Pick0000.png",
      "assets/Player/Attack/Pick0008.png"
    );
    // this.attackAnim.looping = false;x
    this.player.rotation = -90;
    this.isAttacking = false;
    this.milee = 10;
    this.attack();
  }

  move(speed) {
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
    }
    // if ((mouseDown() || keyDown("x")) && this.milee >= 1) {
    //   // else if (mouseWentDown("LEFT") || keyWentDown("x")) {

    //   this.player.changeAnimation("attack");
    // }
    else {
      this.player.setSpeed(0);
      this.player.changeAnimation("idle");
      // this.isAttacking = false;
    }
  }

  attack() {
    let canAttack = this.milee >= 1 && !this.isAttacking;

    if ((keyWentDown("x") || mouseWentDown()) && canAttack) {
      this.isAttacking = true;
      this.milee--;
    } else {
      this.isAttacking = false;
    }
    if ((keyDown("x") || mouseDown()) && canAttack) {
      this.player.changeAnimation("attack");
    }

    if (canAttack) return this.isAttacking;
    return false;
  }
  decreaseHealth(amount) {
    this.health -= amount;
  }

  increaseHealth() {
    this.health += 10;
  }

  getProperties() {
    return this.player;
  }
}
