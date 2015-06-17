using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ArniaDidattica
{
    class Base : Client
    {
        
        public Base(TcpClient socket)
            : base(socket)
        {
            base.id = 0;
            base.nome = "base";
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
