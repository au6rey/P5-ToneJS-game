class PoliceCar {
  constructor(posX, posY, type) {
    this.health = 100;
    this.car = createSprite(posX, posY);
    this.car.mass = random(80, 85);
    if (type === "left") {
      this.car.mirrorY(-1);
      this.car.velocity.y += random(5, 8);
    } else this.car.velocity.y -= random(5, 8);
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
    this.car.mass = random(80, 85);

    if (type === "left") {
      this.car.mirrorY(-1);
      this.car.velocity.y += random(6, 20);
    } else this.car.velocity.y -= random(6, 20);
    this.car.addImage("normal", carImage);
  }

  getProperties() {
    return this.car;
  }
}

class Ambulance {
  constructor(posX, posY, type) {
    this.health = 100;
    this.car = createSprite(posX, posY);
    this.car.mass = random(80, 85);
    if (type === "left") {
      this.car.mirrorY(-1);
      this.car.velocity.y += random(5, 8);
    } else this.car.velocity.y -= random(5, 8);
    this.car.addAnimation(
      "lightson",
      "assets/AmbulanceAnimation/amb0001.png",
      "assets/AmbulanceAnimation/amb0003.png"
    );
  }

  getProperties() {
    return this.car;
  }
}

function spawnCars(images) {
  let rightH = height / 2 + width;
  let rightX = random(40, width / 2);
  let leftH = height / 2 - 2 * width - random(70, 250);

  let right_lane_car = new RegularCar(
    random(width / 2, width - 40),
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

function spawnMedics() {
  let rightH = height / 2 + width;
  let rightX = random(40, width / 2);
  let leftH = height / 2 - 2 * width - random(70, 250);
  let leftAmb = new Ambulance(
    rightX,
    leftH,

    "left"
  );

  let rightAmb = new Ambulance(
    random(width / 2, width - 40),
    height + rightH,

    "right"
  );

  return {
    left_lane_amb: leftAmb.getProperties(),
    right_lane_amb: rightAmb.getProperties(),
  };
}

function spawnCops() {
  let rightH = height / 2 + width;
  let rightX = random(40, width / 2);
  let leftH = height / 2 - 2 * width - random(70, 250);
  let leftcop = new PoliceCar(rightX, leftH, "left");

  let rightcop = new PoliceCar(
    random(width / 2, width - 40),
    height + rightH,
    "right"
  );
  return {
    left_lane_cop: leftcop.getProperties(),
    right_lane_cop: rightcop.getProperties(),
  };
}
