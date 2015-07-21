const int InfraredTx = 5;
const int InfraredRx = A2;
int val;

void setup() {
  pinMode (InfraredTx, OUTPUT);
  pinMode (InfraredRx, INPUT);
  pinMode (3, OUTPUT);
  digitalWrite (InfraredTx, HIGH);
  digitalWrite (3, HIGH);
  Serial.begin(9600);
  
  // put your setup code here, to run once:

}

void loop() {
  val = analogRead (InfraredRx);
  Serial.println(val);
  if (val > 625)
  {
    digitalWrite (3, LOW);
    //delay(1000);
  }
  else
  {
    digitalWrite (3, HIGH);
  }
  // put your main code here, to run repeatedly:

}
