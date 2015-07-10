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
            switch (msg.Substring(0,1))
            {
                case "0":
                    {//fine pallina
                        giocoController.finePallinaGiocoC();
                        break;
                    }
                case "1":
                    {//preso un fiore
                        giocoController.PuntoGiocoC();
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
