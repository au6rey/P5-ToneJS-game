class Player {
  constructor() {
    this.health = 100;
    this.playerImage = loadImage("assets/Player/Idle/skeleton-idle_0.png");
    this.playerSprite = createSprite(width / 2, height / 2);
    this.playerSprite.scale = 0.4;
    this.playerSprite.setCollider("circle", 0, 0, 42);
    this.idleAnim = this.playerSprite.addAnimation(
      "idle",
      "assets/Player/Idle/skeleton-idle_0.png",
      "assets/Player/Idle/skeleton-idle_16.png"
    );

    this.moveAnim = this.playerSprite.addAnimation(
      "move",
      "assets/Player/Move/skeleton-move_0.png",
      "assets/Player/Move/skeleton-move_16.png"
    );

    this.attackAnim = this.playerSprite.addAnimation(
      "attack",
      "assets/Player/Attack/Pick0000.png",
      "assets/Player/Attack/Pick0008.png"
    );

    this.attackAnim.frameDelay = 1.5;
    this.playerSprite.rotation = -90;
    this.isAttacking = false;
    this.milee = 10; //Initial attacks
  }

  //Control player movement
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
      this.playerSprite.changeAnimation("move");

      if (keyDown(LEFT_ARROW) || joystick.x < 0) {
        this.playerSprite.rotation = 180;
        this.playerSprite.velocity.x -= speed;
      }
      if (keyDown(RIGHT_ARROW) || joystick.x > 0) {
        this.playerSprite.rotation = -360;
        this.playerSprite.velocity.x += speed;
      }
      if (keyDown(UP_ARROW) || joystick.y < 0) {
        this.playerSprite.rotation = -90;
        this.playerSprite.velocity.y -= speed;
      }
      if (keyDown(DOWN_ARROW) || joystick.y > 0) {
        this.playerSprite.rotation = 90;
        this.playerSprite.velocity.y += speed;
      }

      if (keyDown("space")) {
        this.playerSprite.setSpeed(6);
        this.moveAnim.frameDelay = 1.5;
      } else this.playerSprite.setSpeed(3);
    } else {
      this.playerSprite.setSpeed(0);
      this.playerSprite.changeAnimation("idle");
    }
  }

  //When player attacks
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
      this.playerSprite.changeAnimation("attack");
    }

    if (canAttack) return this.isAttacking;
    return false;
  }

  //Decrease player health
  decreaseHealth(amount) {
    this.health -= amount;
  }

  //Inrease player health
  increaseHealth(amount) {
    this.health += amount;
  }

  //Get player skeleton
  getProperties() {
    return this.playerSprite;
  }
}
