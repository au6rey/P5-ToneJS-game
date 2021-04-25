class Player {
  constructor() {
    this.health = 100;
    this.playerImage = loadImage("assets/Player/Idle/skeleton-idle_0.png");
    this.player = createSprite(width / 2, height / 2);

    this.player.scale = 0.4;
    this.player.setCollider("circle", 0, 0, 42);

    this.idleAnim = this.player.addAnimation(
      "idle",
      "assets/Player/Idle/skeleton-idle_0.png",
      "assets/Player/Idle/skeleton-idle_16.png"
    );

    this.moveAnim = this.player.addAnimation(
      "move",
      "assets/Player/Move/skeleton-move_0.png",
      "assets/Player/Move/skeleton-move_16.png"
    );

    this.attackAnim = this.player.addAnimation(
      "attack",
      "assets/Player/Attack/Pick0000.png",
      "assets/Player/Attack/Pick0008.png"
    );

    this.attackAnim.frameDelay = 1.5;
    this.player.rotation = -90;
    this.isAttacking = false;
    this.milee = 10;
  }

  move(speed, joystick) {
    this.moveAnim.frameDelay = 2;
    if (
      (keyDown(LEFT_ARROW) ||
        keyDown(RIGHT_ARROW) ||
        keyDown(UP_ARROW) ||
        keyDown(DOWN_ARROW) ||
        joystick.x !== 0 ||
        joystick.y !== 0 ||
        keyDown("space")) &&
      this.health > 0
    ) {
      this.player.changeAnimation("move");

      if (keyDown(LEFT_ARROW) || joystick.x < 0) {
        this.player.rotation = 180;
        this.player.velocity.x -= speed;
      }
      if (keyDown(RIGHT_ARROW) || joystick.x > 0) {
        this.player.rotation = -360;
        this.player.velocity.x += speed;
      }
      if (keyDown(UP_ARROW) || joystick.y < 0) {
        this.player.rotation = -90;
        //   this.player.addSpeed(5, this.player.mirror);
        this.player.velocity.y -= speed;
      }
      if (keyDown(DOWN_ARROW) || joystick.y > 0) {
        this.player.rotation = 90;
        this.player.velocity.y += speed;
      }

      if (keyDown("space")) {
        this.player.setSpeed(6);
        this.moveAnim.frameDelay = 1.5;
      } else this.player.setSpeed(3);
    } else {
      this.player.setSpeed(0);
      this.player.changeAnimation("idle");
    }
  }

  attack(joystick) {
    let canAttack = this.milee >= 1 && !this.isAttacking && this.health > 0;

    if ((keyWentDown("x") || mouseWentDown() || joystick.btn) && canAttack) {
      this.isAttacking = true;
      this.milee--;
    } else {
      this.isAttacking = false;
      joystick.btn = false;
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

  increaseHealth(amount) {
    this.health += amount;
  }

  getProperties() {
    return this.player;
  }
}
