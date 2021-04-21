var GROUND_Y = 450;
var SCENE_W;
var SCENE_H;
var MIN_OPENING = 300;
let policeCarImage,
  ambulanceImage,
  otherCarImages = [];
let player, ambulance, left_enemy_cars, right_enemy_cars, explosionSheet;

let MARGIN = 20;
let moveX = 0;

function preload() {
  //   policeCarImage = loadImage("assets/V2/police_animation/2.png");
  ambulanceImage = loadImage("assets/Ambulance.png");
  for (let i = 0; i <= 6; i++) {
    otherCarImages[i] = loadImage(`assets/Car${i}.png`);
  }
  explosionSheet = loadAnimation(
    "assets/explosion/Frames/E0000.png",
    "assets/explosion/Frames/E0009.png"
  );
  // explosionSheet.scale = 5;
}

function setup() {
  createCanvas(650, 1200);
  // player_car = new PoliceCar();
  player = new Player();
  left_enemy_cars = new Group();
  right_enemy_cars = new Group();

  SCENE_H = height;
  SCENE_W = width;
}

function draw() {
  background(0);
  player.move(50);
  setupCamera();
  // camera.position.y = player.getProperties().position.y;
  player.getProperties().collide(right_enemy_cars);
  player.getProperties().collide(left_enemy_cars);
  left_enemy_cars.collide(right_enemy_cars);
  right_enemy_cars.collide(left_enemy_cars);
  right_enemy_cars.collide(right_enemy_cars);
  left_enemy_cars.collide(left_enemy_cars);
  let right_lane_car;
  let left_lane_car;
  if (frameCount % 100 === 0) {
    let rightH = height / 2 + width;
    let rightX = random(20 + width / 2);
    let leftH = height / 2 - 2 * width - random(70, 250);

    right_lane_car = createSprite(random(width / 2, width), height + rightH);
    right_lane_car.addImage(otherCarImages[parseInt(random(0, 6))]);
    // right_lane_car.setCollider("rectangle", 0, 0, 10, 150);
    right_lane_car.velocity.y -= random(8, 13);
    right_enemy_cars.add(right_lane_car);

    left_lane_car = createSprite(rightX, leftH);
    left_lane_car.addImage(otherCarImages[parseInt(random(0, 6))]);
    left_lane_car.mirrorY(-1);
    // left_lane_car.setCollider("rectangle", 0, 0, 10, 150);
    left_lane_car.velocity.y += 5;
    left_enemy_cars.add(left_lane_car);

    // leftLaneCar.getProperties().setSpeed(3, 5);
    // leftLaneCar.getProperties().attractionPoint(0.2, mouseX, mouseY);
    for (var i = 0; i < left_enemy_cars.length; i++)
      if (left_enemy_cars[i].position.y > height) {
        left_enemy_cars[i].remove();
      }
    for (var i = 0; i < right_enemy_cars.length; i++)
      if (right_enemy_cars[i].position.y < 0 - height - 1000) {
        right_enemy_cars[i].remove();
      }
  }

  drawSprites();
}

function explode(spriteA, spriteB) {
  console.log(spriteB.position.x, spriteB.position.y);
  spriteB.setSpeed(0);
  animation(explosionSheet, spriteB.position.x, spriteB.position.y);
  // spriteB.remove();
}

function setupCamera() {
  //limit the player movements
  if (player.getProperties().position.x < 0)
    player.getProperties().position.x = 0;
  if (player.getProperties().position.y < 0)
    player.getProperties().position.y = 0;
  if (player.getProperties().position.x > SCENE_W)
    player.getProperties().position.x = SCENE_W;
  if (player.getProperties().position.y > SCENE_H)
    player.getProperties().position.y = SCENE_H;
  //.5 zoom is zooming out (50% of the normal size)
  // if (mouseIsPressed)
  // camera.zoom = 0.75;
  // camera.zoom = 1;
}
