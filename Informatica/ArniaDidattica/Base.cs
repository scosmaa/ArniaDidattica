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
                        giocoController.risposta0();
                        break;
                    }
                case "1":
                    {
                       // risposta = 1;//pulsande  a dx
                        giocoController.risposta1();
                        break;
                    }
                default:
                    {
                        Console.WriteLine("messaggio non riconosciuto ({0})", msg);
                        break;
                    }
            }
        }
    }
}
