#include <SPI.h>
#include <Ethernet.h>

const int button0 = 6;
const int button1 = 7;
int button0state = 0;
int button1state = 0;
int var = 2;


EthernetClient server;
byte mac[] = { 0x02, 0x00, 0x00, 0x00, 0x00, 0x00 };

byte ipserver[] = { 192, 168, 0, 200};
byte buffer[1];
void(* Riavvia)(void) = 0;

void setup()
{
  pinMode (button0, INPUT);
  pinMode (button1, INPUT);
  Serial.begin(9600);


  Serial.println("Tentativo di connessione alla rete");

  Ethernet.begin(mac);


  while (server.connect(ipserver, 2020) != 1)
  {
    Ethernet.begin(mac);

    Serial.println("connessione fallita");
    delay(1000);
  
  }

  Serial.println("connessione riuscita");

}

void loop()
{
  button0state = digitalRead (button0);
  button1state = digitalRead (button1);

  if (button0state == LOW)
  {

    Invia('0');
    delay(1000);


  }

  if (button1state == LOW)     //PULSABTE FALSO
  {
    Invia('1');

    delay(1000);

  }
  if (server.connected() == false)
  {
    Serial.println("Disconnesso");
    Riavvia();


  }

}


void Invia(char mess)
{
  Serial.print("inviato ");
  Serial.println(mess);
  server.write(mess);
}
