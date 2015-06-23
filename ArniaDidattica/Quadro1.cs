using System;
using System.Net.Sockets;
using System.Threading;

namespace ArniaDidattica
{
    class Quadro1 : Client
    {
        public bool celleChiuse { get; private set; }

        public Quadro1(TcpClient socket)
            : base(socket)
        {
            base.id = 1;
            base.nome = "quadro 1";
            celleChiuse = false;
        }

        public override void gestioneMsg(string msg)
        {
            switch (msg)
            {
                case "C":
                    {
                        celleChiuse = true;
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
