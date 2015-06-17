using System;
using System.Net.Sockets;
using System.Threading;

namespace ArniaDidattica
{
    class Quadro1 : Client
    {
        public bool celleChiuse { get; private set; }
        public int risposta;

        public Quadro1(TcpClient socket)
            : base(socket)
        {
            base.id = 1;
            base.nome = "quadro 1";
            celleChiuse = false;
            risposta = -1;
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
                case "0":
                    {
                        risposta = 0;
                        break;
                    }
                case "1":
                    {
                        risposta = 1;
                        break;
                    }
            }
        }
    }
}
