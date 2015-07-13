using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace ArniaDidattica
{
    class Quadro3 : Client
    {
        public Quadro3(TcpClient socket)
            : base(socket)
        {
            base.id = 3;
            base.nome = "quadro 3";
        }

        public override void gestioneMsg(string msg)
        {
            switch (msg)
            {
                case "0":
                    {
                        Console.WriteLine("fine partita");
                        break;
                    }
                case "1":
                    {
                        Console.WriteLine("punto fatto");
                        giocoController.PuntoGiocoE();
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
