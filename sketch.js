let ship, bullets, barriers;
var GROUND_Y = 450;
var MIN_OPENING = 300;
let shipImage, bulletImage, particleImage, barrierImg;
let MARGIN = 20;

let moveX = 0;
function preload() {
  shipImage = loadImage("assets/ship0001.png");
  bulletImage = loadImage("assets/bullet.png");
  particleImage = loadImage("assets/particle.png");
  barrierImg = loadImage("assets/barrier.png");
}

function setup() {
  createCanvas(600, 800);
  ship = new Ship(shipImage);
  bullets = new Group();
  barriers = new Group();
  // players = new Group();
  // ship.getProperties().setCollider("circle", -2, 2, 55);

  // players.add(ship.getProperties());
}

function draw() {
  background(0);

  // fill(255);
  // textAlign(CENTER);
  // text("Controls: Arrow Keys + X", width / 2, 20);

  // handleMargins(ship.getProperties());
  ship.move();

  //spawn barries
  if (frameCount % 120 == 0) {
    let difference = random(-50, 185);
    let rightH = ship.getProperties().position.y - 2 * width;
    let rightX = width - difference;
    let leftH = ship.getProperties().position.y - 2 * width - random(70, 250);

    // if (Math.abs(rightH - leftH) < 100) leftH += 50;
    var barrierR = createSprite(rightX, rightH);
    // ship.getProperties().bounce(barrierR);
    barrierR.addImage(barrierImg);
    barrierR.rotation = -90;
    barrierR.immovable = true;

    barrierR.velocity.y += 4;
    barriers.add(barrierR);

    var barrierL = createSprite(difference, leftH);
    // ship.getProperties().bounce(barrierL);
    barrierL.addImage(barrierImg);
    barrierL.rotation = -90;
    barrierL.mirrorX(-1);
    barrierL.immovable = true;
    barrierL.velocity.y += 4;
    barriers.add(barrierL);
  }
  ship.getProperties().bounce(barriers);
  //get rid of passed pipes
  for (var i = 0; i < barriers.length; i++)
    if (barriers[i].position.y > height + 100) {
      barriers[i].remove();
    }
  // ship.getProperties().bounce(barriers);
  // camera.position.y = ship.getProperties().position.y;

  if (keyWentDown("x")) {
    var bullet = createSprite(
      ship.getProperties().position.x,
      ship.getProperties().position.y
    );
    bullet.addImage(bulletImage);
    bullet.setSpeed(
      3 + ship.getProperties().getSpeed(),
      ship.getProperties().rotation
    );
    bullet.life = 80;
    bullets.add(bullet);
  }

  drawSprites();
}

function handleMargins(s) {
  if (s.position.x < MARGIN) s.position.x = MARGIN;
  if (s.position.x > width - MARGIN) s.position.x = width - MARGIN;
  if (s.position.y < MARGIN) s.position.y = MARGIN;
  if (s.position.y > height - MARGIN) s.position.y = height - MARGIN;
}
