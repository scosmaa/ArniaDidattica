const int MAGNETE_1 = 2;
const int MAGNETE_2 = 3;
const int MAGNETE_3 = 4;
const int MAGNETE_4 = 5;
const int MAGNETE_5 = 6;
const int MAGNETE_INIZIO = 7;
const int MAGNETE_FINE = 8;
const int LED_1 = 9;
const int LED_2 = 10;
const int LED_3 = 11;
const int LED_4 = 12;
const int LED_5 = 13;
const int rel=A1;
int FIORE_1 = 0;
int FIORE_2 = 0;
int FIORE_3 = 0;
int FIORE_4 = 0;
int FIORE_5 = 0;
int FINE = 0;


void setup () 
{
  pinMode (rel,OUTPUT);
  delay(1000);
  digitalWrite(rel,HIGH);
  delay(1000);
  
  Serial.begin(9600);
  Serial.println("AT+CWMODE=1");
  delay(1000);
  Serial.println("AT+CIPMUX=1");
  delay(1000);
  Serial.println("AT+CWJAP=\"ArniaDidattica\",\"\"");
  delay(5000);
  Serial.println("AT+CIPSTART=0,\"TCP\",\"192.168.0.200\",2020");
  delay(6000);
  
  pinMode (MAGNETE_1, INPUT);
  pinMode (MAGNETE_2, INPUT);
  pinMode (MAGNETE_3, INPUT);
  pinMode (MAGNETE_4, INPUT);
  pinMode (MAGNETE_5, INPUT);
  pinMode (MAGNETE_FINE, INPUT);
  pinMode (MAGNETE_INIZIO, INPUT);
  pinMode (LED_1, OUTPUT);
  pinMode (LED_2, OUTPUT);
  pinMode (LED_3, OUTPUT);
  pinMode (LED_4, OUTPUT);
  pinMode (LED_5, OUTPUT);
  digitalWrite (LED_1, HIGH);
  digitalWrite (LED_2, HIGH);
  digitalWrite (LED_3, HIGH);
  digitalWrite (LED_4, HIGH);
  digitalWrite (LED_5, HIGH);
}

void loop() 
{
  //VERIFICA MAGNETI
  
  if (digitalRead (MAGNETE_INIZIO) == HIGH)
  {
    FINE = 0;
  }
  
  if (digitalRead (MAGNETE_1) == HIGH && FIORE_1 == 0 && FINE == 0)
  {
    digitalWrite (LED_1, LOW);
    FIORE_1 = 1;
    Serial.println("AT+CIPSEND=0,2");
    delay(100);
    Serial.println("1");
    delay(100);
  }
  
  if (digitalRead (MAGNETE_2) == HIGH && FIORE_2 == 0 && FINE == 0)
  {
    digitalWrite (LED_2, LOW);
    FIORE_2 = 1;
    Serial.println("AT+CIPSEND=0,2");
    delay(100);
    Serial.println("1");
    delay(100);
    
  }
  
  if (digitalRead (MAGNETE_3) == HIGH && FIORE_3 == 0 && FINE == 0)
  {
    digitalWrite (LED_3, LOW);
    FIORE_3 = 1;
    Serial.println("AT+CIPSEND=0,2");
    delay(100);
    Serial.println("1");
    delay(100);
  }
  
  if (digitalRead (MAGNETE_4) == HIGH && FIORE_4 == 0 && FINE == 0)
  {
    digitalWrite (LED_4, LOW);
    FIORE_4 = 1;
    Serial.println("AT+CIPSEND=0,2");
    delay(100);
    Serial.println("1");
    delay(100);
  }
  
  if (digitalRead (MAGNETE_5) == HIGH && FIORE_5 == 0 && FINE == 0)
  {
    digitalWrite (LED_5, LOW);
    FIORE_5 = 1;
    Serial.println("AT+CIPSEND=0,2");
    delay(100);
    Serial.println("1");
    delay(100);
  }
  
  if (digitalRead (MAGNETE_FINE) == HIGH && FINE == 0 && FINE == 0)
  {
    FINE = 1;
    digitalWrite (LED_1, HIGH);
    digitalWrite (LED_2, HIGH);
    digitalWrite (LED_3, HIGH);
    digitalWrite (LED_4, HIGH);
    digitalWrite (LED_5, HIGH);
    FIORE_1 = 0;
    FIORE_2 = 0;
    FIORE_3 = 0;
    FIORE_4 = 0;
    FIORE_5 = 0;
    
    Serial.println("AT+CIPSEND=0,2");
    delay(100);
    Serial.println("0");
    delay(100);
    
  }
}
