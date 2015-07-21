
#include <Servo.h>

const int InfraredTx = 7;
const int InfraredRx = A2;
const int rel = 2;
const int Button1 = 4;
//const int Button2 = 7;
//int pos = 0;
int val;


Servo myservo;

//String debug = String ("A");

void setup()
{
  pinMode(InfraredTx, OUTPUT);
  pinMode(InfraredRx, INPUT);
  pinMode(rel, OUTPUT);
  pinMode(Button1, INPUT);
  pinMode(7, INPUT);

  //establish motor direction toggle pins
  pinMode(12, OUTPUT); //CH A -- HIGH = forwards and LOW = backwards???
  pinMode(13, OUTPUT); //CH B -- HIGH = forwards and LOW = backwards???

  //establish motor brake pins
  pinMode(9, OUTPUT); //brake (disable) CH A
  pinMode(8, OUTPUT); //brake (disable) CH B

  myservo.attach(6);

  Serial.begin(9600);

  delay(1000);
  digitalWrite(rel, HIGH);

  Serial.println("AT+CWMODE=1");
  delay(1000);
  Serial.println("AT+CIPMUX=1");
  delay(1000);
  Serial.println("AT+CWJAP=\"ArniaDidattica\",\"\"");
  delay(5000);
  Serial.println("AT+CIPSTART=0,\"TCP\",\"192.168.0.200\",2020");
  delay(6000);

  digitalWrite(InfraredTx, HIGH);


  while (1)
  {
    if (digitalRead(Button1) == LOW)
      break;
  }
    
  myservo.write(40);
  for (int I = 0; I < 6; I++)
  {
    stepperun();
  }

  myservo.write(0);
  for (int I = 0; I < 6; I++)
  {
    stepperun();
  }



}

void loop()
{

  stepperun();

  if (digitalRead(7) == LOW)
  {
    //Serial.println("AT+CIPSEND=0,2");
    for (int I = 0; I < 5; I++)
    {
      stepperun();
    }
    
    Serial.println("AT+CIPSEND=0,2");
    delay(20);
    Serial.println("3");
    for (int I = 0; I < 5; I++)
    {
      stepperun();
    }
  }
  
  /*if (val > 650 && val < 660)
  {
    Serial.println("AT+CIPSEND=0,3");
    for (int I = 0; I < 5; I++)
    {
      stepperun();
    }

    Serial.println("3");
    for (int I = 0; I < 5; I++)
    {
      stepperun();
    }
  }*/ 

  /*  String debug = String ("A");
   // debug = Serial.readString();
    Serial.println(digitalRead(Button1));
    Serial.println(digitalRead(Button2));
    Serial.println("");*/

  if (digitalRead(Button1) == LOW)
  {
    //Serial.println("AT+CIPSEND=0,2");
    myservo.write(40);
    for (int I = 0; I < 6; I++)
    {
      stepperun();
    }
    
    Serial.println("AT+CIPSEND=0,2");
    delay(20);
    Serial.println("2");
    myservo.write(0);
    for (int I = 0; I < 6; I++)
    {
      stepperun();
    }  
  }

}

void stepperun() {

  digitalWrite(9, LOW);  //ENABLE CH A
  digitalWrite(8, HIGH); //DISABLE CH B

  digitalWrite(12, HIGH);   //Sets direction of CH A
  analogWrite(3, 255);   //Moves CH A

  delay(5);

  digitalWrite(9, HIGH);  //DISABLE CH A
  digitalWrite(8, LOW); //ENABLE CH B

  digitalWrite(13, LOW);   //Sets direction of CH B
  analogWrite(11, 255);   //Moves CH B

  delay(5);

  digitalWrite(9, LOW);  //ENABLE CH A
  digitalWrite(8, HIGH); //DISABLE CH B

  digitalWrite(12, LOW);   //Sets direction of CH A
  analogWrite(3, 255);   //Moves CH A

  delay(5);

  digitalWrite(9, HIGH);  //DISABLE CH A
  digitalWrite(8, LOW); //ENABLE CH B

  digitalWrite(13, HIGH);   //Sets direction of CH B
  analogWrite(11, 255);   //Moves CH B
  delay(5);
}

