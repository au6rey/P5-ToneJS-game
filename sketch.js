//YOUTUBE LINK
//https://www.youtube.com/watch?v=jd9C-1zQVu4

//Player and car sprites
let player, left_car_group, right_car_group;

//Heart collectibles
let hearts = [],
  heart,
  heartGroup;

//For in game moments
let gameIsOver = false,
  gameStarted = false,
  isAttacking = false;

//Game timer
let timer = 0,
  deficit = 0;

//Images
let bgImage, dialogBox;
let otherCarImages = [];

//For music
let musicplayer,
  introMusicStarted = false,
  outroMusicStarted = false,
  themeStarted = false;

//Locks for Arduino serial comm.
//Only send message to arduino once to display on the LCD.
let toggleR = false,
  toggleS = false,
  toggleO = false;

function preload() {
  for (let i = 0; i <= 6; i++) {
    otherCarImages[i] = loadImage(`assets/Car${i}.png`);
  }
}

function setup() {
  createCanvas(956, 1000);

  //Menu and bacgrond image
  bgImage = loadImage("assets/bgImage.jpg");
  dialogBox = loadImage("assets/Menu/dbox.png");

  //Music controller
  musicplayer = new MusicPlayer();

  //Player sprites and character
  player = new Player();

  //P5.play sprite group
  left_car_group = new Group();
  right_car_group = new Group();
  heartGroup = new Group();

  //Setup controller
  setupArduino();
}

function draw() {
  background(0);
  checkPlayerStats(player);

  //Get character skeleton/sprite
  let player_sprite = player.getProperties();

  setupCamera(player_sprite);

  //Start menu
  let gameOnStart = !gameStarted && !gameIsOver;

  //When game starts
  let gameOnSession = !gameIsOver && gameStarted;

  controlMusic();

  if (gameOnStart) {
    newGame(player_sprite);
  } else if (gameOnSession) {
    //Move character at speed 50 and if joystick available
    player.move(50, joystick);

    //Returns true if player is actively attcaking cars
    isAttacking = player.attack(joystick);

    //Set up collisions and overlaps
    player_sprite.collide(right_car_group, onCollideWithCar);
    player_sprite.collide(left_car_group, onCollideWithCar);
    player_sprite.overlap(heartGroup, onHeartOverlap);
    left_car_group.bounce(right_car_group);
    right_car_group.bounce(left_car_group);
    right_car_group.bounce(right_car_group);
    left_car_group.bounce(left_car_group);

    //Game logic
    gameSession();
  } else gameOver();

  drawSprites();

  //Display Game HUD
  GUI(gameOnStart, gameOnSession);
}

function setupCamera(player) {
  //limit the player movements
  if (player.position.x < 0) player.position.x = 0;
  if (player.position.y < 0) player.position.y = 0;
  if (player.position.x > width) player.position.x = width;
  if (player.position.y > height) player.position.y = height;

  //Background roud image
  camera.off();
  image(bgImage, 0, 0);
  camera.on();
}

//In game timer
let timerId = setInterval(counter, 1000);
function counter() {
  if (!gameIsOver) timer++;

  //Every 10 seconds
  if (timer % 10 === 0) {
    deficit += 10; //Increases car spawns
    player.milee += 5; //Player gets bonus
  }
}

function GUI(gameOnStart, gameOnSession) {
  if (gameOnStart) {
    fill("blue");
    let x = width / 2 - 150;
    let y = height / 2 - 140;
    image(dialogBox, x, y, 300, 200);
    translate(x, y);
    textSize(15);
    text(`Avoid getting hit by the cars`, 60, 50);
    text(`Use arrow keys to move`, 75, 75);
    text(`Hold space to sprint`, 95, 100);
    text(`Press X or left mouse button to destroy car`, 10, 120);
    text(`Collect hearts for health gain`, 55, 145);
    textSize(24);
    text(`PRESS ENTER TO PLAY`, 12, 180);
    pop();

    //Signal Arduino to display Ready to play
    if (!toggleR) serial.write("R");
    toggleR = true;
    push();
  } else if (gameOnSession) {
    push();
    textSize(28);
    fill("blue");
    let x = width - 250;
    let y = 10;
    image(dialogBox, x, y, 200, 120);
    translate(x, y);
    text(`Health: ${player.health}`, 10, 30);
    text(`Attack: ${player.milee}`, 10, 70);
    text(`Timer: ${timer}s`, 10, 110);
    pop();

    //Signal Arduino to display Game has started
    if (!toggleS) serial.write("S");
    toggleS = true;
  } else {
    push();
    textSize(28);
    fill("red");
    let x = width / 2 - 125;
    let y = height / 2 - 140;
    image(dialogBox, x, y, 250, 150);
    translate(x, y);
    text(`GAME OVER`, 35, 50);
    fill("blue");
    textSize(35);
    text(`  ${timer} s`, 80, 90);
    fill("red");
    textSize(17);
    text(`Refresh page to play.`, 40, 120);
    pop();

    //Signal Arduino to display Game has ended.
    if (!toggleO) serial.write("O");
    toggleO = true;
  }
}

//When player overlaps heart they gain health
function onHeartOverlap(spriteA, spriteB) {
  let gain = parseInt(spriteB.scale * 100);
  player.increaseHealth(gain);
  spriteB.remove();
  heartGroup.remove(spriteB);
  musicplayer.pickUpHeart();
  serial.write("U");
}

//When player overlaps car
function onCollideWithCar(spriteA, car) {
  if (isAttacking) {
    new Explosion(car.position.x, car.position.y);
    car.remove();
    musicplayer.explosion();
  } else player.decreaseHealth(parseInt(0.15 * Math.abs(car.velocity.y)));
  musicplayer.pain();
  //If in joystick mode send message to Arduino to beep buzzer
  serial.write("H");
}

//Starts new game
function newGame(player) {
  timer = 0;

  updateSprites(true);
  player.position.x = width / 2;
  player.position.y = height / 2;

  if (keyWentDown("enter")) {
    gameStarted = true;
    gameIsOver = false;
  }
}

//When player health is 0
function gameOver() {
  heartGroup.removeSprites();
  hearts.forEach((heart) => {
    heart.getProperties().remove();
  });

  left_car_group.removeSprites();
  right_car_group.removeSprites();
}

function checkPlayerStats(player) {
  //Check player health and update sprites
  if (player.health <= 0) {
    gameIsOver = true;
    gameStarted = false;
    player.getProperties().setSpeed(0);
    player.getProperties().changeAnimation("idle");
  }
}

//Game logic
function gameSession() {
  if (frameCount % (50 - deficit) === 0) {
    let { left_lane_car, right_lane_car } = spawnCars(otherCarImages);

    left_car_group.add(left_lane_car);
    right_car_group.add(right_lane_car);

    //Remove off screen cars
    for (var i = 0; i < left_car_group.length; i++)
      if (left_car_group[i].position.y > height) {
        left_car_group[i].remove();
      }
    //Remove off screen cars
    for (var i = 0; i < right_car_group.length; i++)
      if (right_car_group[i].position.y < 0 - height - 1000) {
        right_car_group[i].remove();
      }

    //Ambulance spawns when player health falls below 20
    if (player.health <= 20) {
      let { left_lane_amb, right_lane_amb } = spawnMedics();
      left_car_group.add(left_lane_amb);
      right_car_group.add(right_lane_amb);
    }

    //Cops spawns when player health above 200
    if (player.health >= 200) {
      let { left_lane_cop, right_lane_cop } = spawnCops();
      left_car_group.add(left_lane_cop);
      right_car_group.add(right_lane_cop);
    }
  }

  //Spawn hearts
  if (frameCount % (120 + deficit) === 0) {
    let heart = new Heart(
      parseInt(random(0, width)),
      parseInt(random(0, height))
    );

    hearts.push(heart);
    heartGroup.add(heart.getProperties());

    //Remove a heart after 4 units
    for (var i = 0; i < hearts.length; i++) {
      if (hearts[i].duration >= 4) {
        hearts[i].getProperties().remove();
        heartGroup.remove(hearts[i].getProperties());
      } else hearts[i].duration++;
    }
  }
}

//Control in-game music
function controlMusic() {
  if (!introMusicStarted && !gameStarted) {
    musicplayer.startIntro();
    introMusicStarted = true;
  } else if (gameStarted) {
    if (themeStarted) {
      musicplayer.hatPart.stop();
      musicplayer.chordPart.stop();
      musicplayer.bassLinePart.stop();
      musicplayer.introMelody.stop();
    }
    themeStarted = true;
  } else if (!outroMusicStarted && gameIsOver) {
    outroMusicStarted = true;
    musicplayer.stopSounds();
    musicplayer.startOutro();
  }
}
