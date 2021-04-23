class Heart {
  constructor(x, y) {
    this.percentage = 100;
    this.duration = 0;
    this.heart = createSprite(x, y);
    this.heart.scale = random(0.15, 0.3);
    this.animation = this.heart.addAnimation(
      "pumping",
      "assets/Health/heart1.png",
      "assets/Health/heart5.png"
    );
    this.animation.looping = false;
  }

  getProperties() {
    return this.heart;
  }
}

class Explosion {
  constructor(x, y) {
    this.damage = 100;
    this.explosion = createSprite(x, y);
    this.explosion.scale = random(1, 1.5);
    this.animation = this.explosion.addAnimation(
      "active",
      "assets/explosion/Frames/E0000.png",
      "assets/explosion/Frames/E0009.png"
    );
    this.animation.looping = false;
  }
}

class HealthBar {}
