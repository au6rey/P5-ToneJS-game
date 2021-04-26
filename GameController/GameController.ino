//YOUTUBE LINK
//https://youtu.be/jd9C-1zQVu4

#include <LiquidCrystal.h>
int VRx = A0;
int VRy = A1;
int SW = 8;
const int buzzer = 9;
int xPosition = 0;
int yPosition = 0;
int SW_state = 0;
int mapX = 0;
int mapY = 0;
int del_time = 0;
int incomingData;

//LCD variables.
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

void setup() {
  Serial.begin(9600); 
  lcd.begin(16, 2);
  pinMode(VRx, INPUT);
  pinMode(VRy, INPUT);
  pinMode(SW, INPUT_PULLUP); 
  pinMode(buzzer, OUTPUT);
}

void loop() {
  xPosition = analogRead(VRx);
  yPosition = analogRead(VRy);
  SW_state = digitalRead(SW);
  mapX = map(xPosition, 0, 1023, -2, 2);
  mapY = map(yPosition, 0, 1023,-2, 2);
  del_time = 0; //Low delay for joystick accuracy

  //Send data to P5
  Serial.print(mapX);
  Serial.print(",");
  Serial.print(mapY);
  Serial.print(",");
  Serial.println(SW_state);
  

  if(Serial.available() >  0){
    incomingData = Serial.read();
    
    Serial.println("Data   " + incomingData );

    //If a bug is killed
    if(incomingData == 72){
      tone(buzzer, 800); // Send 0.8KHz sound signal...
       del_time = 10 ;  //Play for 10 ms
        lcd.clear();
      lcd.print("HEALTH WARNING"); 
      lcd.setCursor(0, 1);
      lcd.print("Fight!");
    }

    //If pick up heart
    if(incomingData == 85){
      tone(buzzer, 400); // Send 0.8KHz sound signal...
       del_time = 10 ;  //Play for 10 ms
        lcd.clear();
      lcd.print("HEALTH ++"); 
      lcd.setCursor(0, 1);
      lcd.print("Health Upgrade!");
    }

    //When Game is starting
    if(incomingData == 82){
      lcd.clear();
      lcd.print("START PLAYING"); 
      lcd.setCursor(0, 1);
      lcd.print("Good Luck!");
    }

    //When Game has started
     if(incomingData == 83){
      lcd.clear();
      lcd.print("GAME STARTED"); 
      lcd.setCursor(0, 1);
      lcd.print("Play");
     }

    //When Game is ended
     if(incomingData == 79){
      lcd.clear();
      lcd.print("GAME OVER"); 
      lcd.setCursor(0, 1);
      lcd.print("Restart?");
     }
     
  }
  delay(del_time);
  noTone(buzzer); // Stop sound...
 
  
}
