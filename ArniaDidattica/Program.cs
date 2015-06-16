using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;

namespace ArniaDidattica
{
    class Program
    {
        public const int NMAXQUADRI = 5;//numero massimo consentito di quadri

        static void Main(string[] args)
        {
            string baseUri = "http://localhost:9999";
            Console.WriteLine("Starting web Server...");
            WebApp.Start<Avvio>(baseUri);

            TcpListener server;
            int porta = 2020;

            client[] arduini = new client[NMAXQUADRI + 1];//nel 0 c'è arduino base, negli altri ci sono rispettivamenti i quadri (il quarto quadro sarà in arduini[4])

            server = new TcpListener(porta);//in ascolto
            server.Start();

            while (true)
            {
                client connesso = new client(server.AcceptTcpClient());
                arduini[connesso.id] = connesso;//lo inserisco nel suo preciso posto
                Console.WriteLine(connesso.nome + " connesso");//stampo il nome del quadro
            }
        }
    }
}
