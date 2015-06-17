using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace ArniaDidattica
{

    class Program
    {
        public const int NMAXQUADRI = 3;//numero massimo consentito di quadri

        static void Main(string[] args)
        {
            string baseUri = "http://localhost:9999";
            TcpListener server;
            int porta = 2020;

            Base arduinoBase;
            Quadro1 arduinoQuadro1;
            Quadro2 arduinoQuadro2;
            Quadro3 arduinoQuadro3;
            Gruppo gruppo;

            int NGIOCATORI;
            int PUNTI = 0;//punti totali


            int[,] GESTIONEGRUPPI;
            GESTIONEGRUPPI = new int[5, 6];

            #region inizializzazione GESTIONEGRUPPI
            GESTIONEGRUPPI[0, 0] = 5;
            GESTIONEGRUPPI[0, 1] = 2;
            GESTIONEGRUPPI[0, 2] = 3;
            GESTIONEGRUPPI[0, 3] = 2;
            GESTIONEGRUPPI[0, 4] = 3;
            GESTIONEGRUPPI[0, 5] = 5;

            GESTIONEGRUPPI[1, 0] = 5;
            GESTIONEGRUPPI[1, 1] = 2;
            GESTIONEGRUPPI[1, 2] = 3;
            GESTIONEGRUPPI[1, 3] = 2;
            GESTIONEGRUPPI[1, 4] = 2;
            GESTIONEGRUPPI[1, 5] = 5;

            GESTIONEGRUPPI[2, 0] = 4;
            GESTIONEGRUPPI[2, 1] = 2;
            GESTIONEGRUPPI[2, 2] = 2;
            GESTIONEGRUPPI[2, 3] = 2;
            GESTIONEGRUPPI[2, 4] = 2;
            GESTIONEGRUPPI[2, 5] = 4;

            GESTIONEGRUPPI[3, 0] = 4;
            GESTIONEGRUPPI[3, 1] = 4;
            GESTIONEGRUPPI[3, 2] = 3;
            GESTIONEGRUPPI[3, 3] = 3;
            GESTIONEGRUPPI[3, 4] = 4;
            GESTIONEGRUPPI[3, 5] = 4;

            GESTIONEGRUPPI[4, 0] = 3;
            GESTIONEGRUPPI[4, 1] = 3;
            GESTIONEGRUPPI[4, 2] = 3;
            GESTIONEGRUPPI[4, 3] = 3;
            GESTIONEGRUPPI[4, 4] = 3;
            GESTIONEGRUPPI[4, 5] = 3;
            #endregion

            server = new TcpListener(porta);//in ascolto
            server.Start();

            //faccio connettere l'arduino della base.
            int id = -1;
            TcpClient connesso = null;
            while (id != 0)//controllo se è la base
            {
                connesso = server.AcceptTcpClient();
                id = getId(connesso);
                if (id != 0)
                {
                    Console.WriteLine("Inserito quadro sbagliato.");
                    //inviare a video l'errore
                }
            }
            arduinoBase = new Base(connesso);


            //avvio server web
            Console.WriteLine("Starting web Server...");
            WebApp.Start<Avvio>(baseUri);
            Process.Start(baseUri);//avvio homepage con le tappe

            #region quadro 1
            //attendo l'arduino quadro 1.
            while (id != 1)//controllo se è il quadro1
            {
                connesso = server.AcceptTcpClient();
                id = getId(connesso);
                if (id != 1)
                {
                    Console.WriteLine("Inserito quadro sbagliato.");
                    //inviare a video l'errore
                }
            }
            arduinoQuadro1 = new Quadro1(connesso);

            //avvio registrazione giocatori

            NGIOCATORI = 8;//inventato, verrà preso dalla reg.
            Bambino[] bimbi = new Bambino[NGIOCATORI];
            for (int i = 0; i < NGIOCATORI; i++)//per caricare velocemente (per il debug)
            {
                bimbi[i] = new Bambino("Ragazzino " + i);
            }
            gruppo = new Gruppo(bimbi);

            //stampo di mettere le larve nelle cella

            while (!arduinoQuadro1.celleChiuse) { Thread.Sleep(500); }//aspetta fino a quando tutte le celle sono chiuse
            //avvio video
            Thread.Sleep(5000);//aspetto un po'
            arduinoQuadro1.invioMsg("A");//avvia servomotore

            //fine video
            arduinoQuadro1.invioMsg("F");//fine video
            //stampo "prendete le api"

            //stampo "inizio quiz"
            for (int i = 0; i < GESTIONEGRUPPI[10 - NGIOCATORI, 0]; i++)
            {
                Bambino bimbo = gruppo.prendiBimbo(0);
                string nomeBimbo = bimbo.nome;
                //stampo a video il nome

                //dal db prendo domanda e risposte
                string domanda = "che colore sono le api?";
                string[] risposte = { "gialle", "nere" };//la prima è sempre giusta
                Random r = new Random(2);
                int giusta = -1;//contiene la risposta giusta, 0 o 1
                if (r.Next() == 1)
                {
                    //giusta  adestra
                    giusta = 0;
                    //invio prima quella giusta
                }
                else
                {
                    //giusta a sinistra
                    giusta = 1;
                    //invio prima quella sbaglaita
                }

                arduinoQuadro1.invioMsg("R");
                while (arduinoQuadro1.risposta == -1) { Thread.Sleep(500); }
                if (arduinoQuadro1.risposta == giusta)
                {
                    //risposta corretta
                    //invio all'html che è corretto
                    PUNTI += 50;
                }
                else
                {
                    //risposta errata

                    //invio all'html che è sbagliato
                }

            }
            #endregion 


            //secondo quadro
        }
        static int getId(TcpClient socket)//da socket a id dell'arduino
        {
            IPAddress ip = ((IPEndPoint)socket.Client.RemoteEndPoint).Address;
            string stringIP = ip.ToString();
            stringIP = stringIP.Substring(stringIP.LastIndexOf(".") + 1);
            int id = Convert.ToInt32(stringIP);
            if (id == 100) id = 0;
            return id;
        }

    }
}
