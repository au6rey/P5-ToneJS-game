class PoliceCar {
  constructor() {
    policeCarImage = loadImage("assets/PoliceAnimation/police0002.png");
    this.health = 100;
    this.car = createSprite(width / 2, height / 2);
    this.car.maxSpeed = 6;
    this.car.friction = 0.98;
    this.car.addAnimation(
      "lights",
      "assets/PoliceAnimation/police0001.png",
      "assets/PoliceAnimation/police0003.png"
    );
  }

  getProperties() {
    return this.car;
  }
}

class RegularCar {
  constructor(posX, posY, carImage, type) {
    this.health = 100;
    this.car = createSprite(posX, posY);

    // this.car.friction = 0.98;

    this.car.mass = random(80, 85);
    this.car.scale = 0.8;
    if (type === "left") {
      this.car.mirrorY(-1);
      this.car.velocity.y += random(6, 20);
    } else this.car.velocity.y -= random(6, 20);

    // this.car.setCollider("rectangle", 0, 0, 100, 100);
    // console.log(this.car.height, this.car.width);
    this.car.addImage("normal", carImage);
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

function spawnCars(images) {
  let rightH = height / 2 + width;
  let rightX = random(20 + width / 2);
  let leftH = height / 2 - 2 * width - random(70, 250);

  let right_lane_car = new RegularCar(
    random(width / 2, width),
    height + rightH,
    images[parseInt(random(0, 6))],
    "right"
  );

  let left_lane_car = new RegularCar(
    rightX,
    leftH,
    images[parseInt(random(0, 6))],
    "left"
  );

  return {
    left_lane_car: left_lane_car.getProperties(),
    right_lane_car: right_lane_car.getProperties(),
  };
}
