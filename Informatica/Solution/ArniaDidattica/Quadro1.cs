using System;
using System.Net.Sockets;
using System.Threading;

namespace ArniaDidattica
{
    class Quadro1 : Client
    {
        public Quadro1(TcpClient socket)
            : base(socket)
        {
            base.id = 1;
            base.nome = "quadro 1";
        }

        public override void gestioneMsg(string msg)
        {
            switch (msg)
            {
                default:
                    {
                        Console.Write("messaggio non riconosciuto");
                        break;
                    }
            }
        }
    }
}
