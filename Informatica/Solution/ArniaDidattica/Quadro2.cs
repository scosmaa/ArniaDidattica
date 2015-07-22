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
                case "0":
                    {//fine pallina
                        Console.WriteLine("fine partita");
                        giocoController.finePallinaGiocoC();
                        break;
                    }
                case "1":
                    {//preso un fiore
                        Console.WriteLine("fiore preso");
                        giocoController.PuntoGiocoC();
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
