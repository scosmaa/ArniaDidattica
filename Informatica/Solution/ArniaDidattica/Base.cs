using ArniaDidattica.WebAPI;
using System;
using System.Net.Sockets;

namespace ArniaDidattica
{
    class Base : Client
    {
        public int risposta;

        public Base(TcpClient socket)
            : base(socket)
        {
            base.id = 0;
            base.nome = "base";
            risposta = -1;
        }

        public override void gestioneMsg(string msg)
        {
            switch (msg)
            {
                case "0":
                    {
                      //  risposta = 0;//pulsande  a sx

                        Console.WriteLine("pulsante di sinistra");
                        giocoController.risposta0();
                        break;
                    }
                case "1":
                    {
                       // risposta = 1;//pulsande  a dx
                        Console.WriteLine("pulsante di destra");
                        giocoController.risposta1();
                        break;
                    }
                case "c"://connesso
                    {
                        Console.WriteLine("un quadro è stato appoggiato");
                        giocoController.qualcosaConnesso();
                        break;
                    }
                case "s"://sconnesso
                    {
                        Console.WriteLine("il quadro è stato rimosso");
                        giocoController.qualcosaSconnesso();
                        break;
                    }
                default:
                    {
                        Console.WriteLine("messaggio non riconosciuto");
                        break;
                    }
            }
        }
    }
}
