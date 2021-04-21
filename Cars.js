class PoliceCar {
  constructor() {
    policeCarImage = loadImage("assets/PoliceAnimation/police0002.png");
    this.health = 100;
    this.car = createSprite(width / 2, height / 2);
    this.car.maxSpeed = 6;
    this.car.friction = 0.98;

    this.car.addImage("normal", policeCarImage);
    this.car.addAnimation(
      "lights",
      "assets/PoliceAnimation/police0001.png",
      "assets/PoliceAnimation/police0003.png"
    );

    // camera.position.y = this.car.position.y - 200;
  }

  move() {
    // this.car.addSpeed(0.2, this.car.rotation);

    this.car.velocity.y -= 70;
    this.car.changeAnimation("lights");
    // if (keyDown(LEFT_ARROW)) this.car.velocity.x -= 200;
    // if (keyDown(RIGHT_ARROW)) this.car.velocity.x += 200;
    // if (keyDown(UP_ARROW)) {
    //   this.car.addSpeed(5, this.car.rotation);
    //   this.car.velocity.y -= 100;
    //   this.car.changeAnimation("lights");
    // } else if (keyDown(DOWN_ARROW)) {
    //   this.car.velocity.y += 100;
    // } else this.car.changeAnimation("normal");
  }

  getProperties() {
    return this.car;
  }
}

class RegularCar {
  constructor(posX, posY, carImage) {
    this.health = 100;
    this.car = createSprite(posX, posY, 10, 150);
    this.car.maxSpeed = 6;
    // this.car.friction = 0.98;
    this.car.mass = 20;
    this.car.setCollider("circle", 0, 0, 20);
    this.car.addImage("normal", carImage);
    this.explosion = this.car.addAnimation("explode", "");
  }

  move() {
    this.car.addSpeed(0.5, this.car.rotation);
    this.car.velocity.y -= 70;
    // this.car.velocity.y += 70;
  }

  getProperties() {
    return this.car;
  }
}

class Ambulance {
  constructor(carImage) {
    this.health = 100;
    this.car = createSprite(width / 2, height / 2);
    this.car.maxSpeed = 6;
    this.car.friction = 0.98;
    this.car.setCollider("circle", 0, 0, 20);
    this.car.addImage("normal", carImage);
    this.car.addAnimation(
      "thrust",
      "assets/V2/ambulance_animation/1.png",
      "assets/V2/ambulance_animation/3.png"
    );
    //   this.car.rotation = -90;
  }

  move() {
    this.car.addSpeed(0.2, this.car.rotation);
    //   this.car.velocity.y -= 70;
    //   this.car.changeAnimation("thrust");

    this.car.velocity.y += 70;
    // this.car.changeAnimation("normal");
  }

  getProperties() {
    return this.car;
  }
}

class Explosion {
  constructor() {
    this.explosionSheet = loadAnimation(
      "assets/explosion/Frames/E0000.png",
      "assets/explosion/Frames/E0009.png"
    );
  }
}
