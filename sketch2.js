var GROUND_Y = 450;
var SCENE_W;
var SCENE_H;
var MIN_OPENING = 300;
let policeCarImage,
  ambulanceImage,
  otherCarImages = [];
let player, ambulance, left_enemy_cars, right_enemy_cars, explosionSheet;
let hearts = [],
  heart,
  heartGroup;
let MARGIN = 20;
let moveX = 0;

function preload() {
  for (let i = 0; i <= 6; i++) {
    otherCarImages[i] = loadImage(`assets/Car${i}.png`);
  }
}

function setup() {
  createCanvas(650, 1200);
  // player_car = new PoliceCar();
  player = new Player();
  left_enemy_cars = new Group();
  right_enemy_cars = new Group();
  heartGroup = new Group();
  SCENE_H = height;
  SCENE_W = width;
}

function draw() {
  background(0);
  player.move(50);

  let player_sprite = player.getProperties();
  player.attack();
  setupCamera(player_sprite);

  //Collision and overlaps
  player_sprite.collide(right_enemy_cars, onCollideWithCar);
  player_sprite.collide(left_enemy_cars, onCollideWithCar);
  player_sprite.overlap(heartGroup, onHeartOverlap);
  left_enemy_cars.bounce(right_enemy_cars);
  right_enemy_cars.bounce(left_enemy_cars);
  right_enemy_cars.bounce(right_enemy_cars);
  left_enemy_cars.bounce(left_enemy_cars);

  if (frameCount % 60 === 0) {
    let { left_lane_car, right_lane_car } = spawnCars(otherCarImages);
    left_enemy_cars.add(left_lane_car);
    right_enemy_cars.add(right_lane_car);

    for (var i = 0; i < left_enemy_cars.length; i++)
      if (left_enemy_cars[i].position.y > height) {
        left_enemy_cars[i].remove();
      }

    for (var i = 0; i < right_enemy_cars.length; i++)
      if (right_enemy_cars[i].position.y < 0 - height - 1000) {
        right_enemy_cars[i].remove();
      }

    let heart = new Heart(
      parseInt(random(0, width)),
      parseInt(random(0, height))
    );
    hearts.push(heart);
    heartGroup.add(heart.getProperties());
    for (var i = 0; i < hearts.length; i++) {
      if (hearts[i].duration >= 5) {
        hearts[i].getProperties().remove();
        heartGroup.remove(hearts[i].getProperties());
      } else hearts[i].duration++;
    }
  }

  drawSprites();
  GUI();
}

function setupCamera(player) {
  //limit the player movements
  if (player.position.x < 0) player.position.x = 0;
  if (player.position.y < 0) player.position.y = 0;
  if (player.position.x > SCENE_W) player.position.x = SCENE_W;
  if (player.position.y > SCENE_H) player.position.y = SCENE_H;
  // camera.zoom = 0.8;
  // camera.zoom = 1;
}

function GUI() {
  push();
  textSize(32);
  fill(0, 102, 153);
  text(`Health: ${player.health}`, 400, 40);
  text(`Attack: ${player.milee}`, 400, 70);
  pop();
}

function onHeartOverlap(spriteA, spriteB) {
  spriteB.remove();
  heartGroup.remove(spriteB);
  player.increaseHealth();
}

function onCollideWithCar(spriteA, car) {
  // console.log(Math.abs(car.velocity.y));
  // if(player.attack())x

  player.decreaseHealth(parseInt(0.15 * Math.abs(car.velocity.y)));
}
