//YOUTUBE LINK

let serial;
let joystick = { x: 0, y: 0, btn: false };
function setupArduino() {
  serial = new p5.SerialPort();

  serial.list();
  serial.open("COM5"); //May be different

  serial.on("connected", serverConnected);

  serial.on("list", gotList);

  serial.on("data", gotData);

  serial.on("error", gotError);

  serial.on("open", gotOpen);

  serial.on("close", gotClose);
}

function serverConnected() {
  print("Connected to Server");
}

function gotList(thelist) {
  print("List of Serial Ports:");

  for (let i = 0; i < thelist.length; i++) {
    print(i + " " + thelist[i]);
  }
}

function gotOpen() {
  print("Serial Port is Open");
}

function gotClose() {
  print("Serial Port is Closed");
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  let data = currentString.split(",");

  //Get joystick mouse positions
  joystick.x = parseInt(data[0]);
  joystick.y = parseInt(data[1]);
  joystick.btn = parseInt(data[2]) == 1 ? false : true;
}

//Locks for Arduino serial comm.
//Only send message to arduino once to display on the LCD.
let toggleR = false,
  toggleS = false,
  toggleO = false;
