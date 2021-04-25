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
    this.explosion.scale = random(2, 3);
    this.animation1 = this.explosion.addAnimation(
      "active1",
      "assets/explosion/0001.png",
      "assets/explosion/0011.png"
    );

    this.animation2 = this.explosion.addAnimation(
      "active2",
      "assets/explosion/Frames/E0001.png",
      "assets/explosion/Frames/E0009.png"
    );
    this.animation1.looping = false;
    this.animation2.looping = false;
    this.animation1.play();
    this.animation2.play();
  }
}
