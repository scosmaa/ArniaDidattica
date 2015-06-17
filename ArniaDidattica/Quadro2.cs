using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ArniaDidattica
{
    class Quadro2 : Client
    {
        public Quadro2(TcpClient socket)
            : base(socket)
        {
            base.id = 2;
            base.nome = "quadro 2";

        }

        public override void gestioneMsg(string msg)
        {
            switch (msg)
            {
                case "":
                    { break; }
            }
        }
    }
}
