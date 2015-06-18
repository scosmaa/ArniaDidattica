using ArniaDidattica.WebAPI;
using Microsoft.Owin.Hosting;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace ArniaDidattica
{
    public struct Domanda
    {
        public string domanda, rispostaG, rispostaS;
        public bool uscita;
    }

    class Program
    {
        public const int NMAXQUADRI = 3;//numero massimo consentito di quadri

        static public Base arduinoBase;
        static public Quadro1 arduinoQuadro1;
        static public Quadro2 arduinoQuadro2;
        static public Quadro3 arduinoQuadro3;

        static void Main(string[] args)
        {
            string baseUri = "http://localhost:9999";
            TcpListener server;
            int porta = 2020;

            GiocoController giocoController=new GiocoController();
            
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

            Console.WriteLine("In attesa della base");
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
            Console.WriteLine("Base connessa.");


            //avvio server web
            Console.WriteLine("Starting web Server...");
            WebApp.Start<Avvio>(baseUri);
            Process.Start(baseUri);//avvio homepage con le tappe

            #region quadro 1
            //attendo l'arduino quadro 1.

            Console.WriteLine("In attesa del quadro 1");
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
            Console.WriteLine("Quadro 1 connesso.");

            giocoController.RegistrazioneGiocatori();//avvio registrazione giocatori

            //NGIOCATORI = 8;//inventato, verrà preso dalla reg.
            //Bambino[] bimbi = new Bambino[NGIOCATORI];
            //for (int i = 0; i < NGIOCATORI; i++)//per caricare velocemente (per il debug)
            //{
            //    bimbi[i] = new Bambino("Ragazzino " + i.ToString());
            //}
            //gruppo = new Gruppo(bimbi);
            //Console.WriteLine("Giocatori inseriti.");

            //viene stampato di mettere le larve nelle cella

            while (!arduinoQuadro1.celleChiuse) { Thread.Sleep(500); }//aspetta fino a quando tutte le celle sono chiuse
            Console.WriteLine("Celle chiuse.");
            //avvio video
            Console.WriteLine("Avvio video.");
            giocoController.AvvioVideo();//avvio registrazione giocatori

            Thread.Sleep(5000);//aspetto un po'
            arduinoQuadro1.invioMsg("A");//avvia servomotore
            Console.WriteLine("Avvio servomotore.");


            Console.WriteLine("Fine video.");

            //stampo "prendete le api"
            Console.WriteLine("Bimbi prendono le api");

            ////carico le domande per il quiz
            //Domanda[] domande = getDomande(1);

            ////stampo "inizio quiz"
            //for (int i = 0; i < GESTIONEGRUPPI[10 - NGIOCATORI, 0]; i++)
            //{
            //    Thread.Sleep(500);
            //    Console.WriteLine("Quiz " + i.ToString());
            //    Bambino bimbo = gruppo.prendiBimbo(0);
            //    string nomeBimbo = bimbo.nome;
            //    //stampo a video il nome

            //    Console.WriteLine("Gioca " + nomeBimbo);

            //    //prendo domanda e risposte
            //    Random r = new Random();
            //    int n = r.Next(domande.Length);
            //    while (domande[n].uscita) { n = r.Next(domande.Length); }//ne trovo una non uscita

            //    string domanda = domande[n].domanda;
            //    Console.WriteLine(domanda);
            //    string[] risposte = { domande[n].rispostaG, domande[n].rispostaS };//la prima è sempre giusta


            //    int giusta = -1;//contiene la risposta giusta, 0 o 1
            //    if (r.Next(2) == 0)//0 o 1
            //    {
            //        //giusta  a destra
            //        giusta = 0;
            //        Console.WriteLine(risposte[0] + " o " + risposte[1]);
            //        //invio prima quella giusta
            //    }
            //    else
            //    {
            //        //giusta a sinistra
            //        giusta = 1;
            //        Console.WriteLine(risposte[1] + " o " + risposte[0]);
            //        //invio prima quella sbaglaita
            //    }

            //    arduinoBase.invioMsg("R");

            //    while (arduinoBase.risposta == -1) { Thread.Sleep(500); }
            //    if (arduinoBase.risposta == giusta)
            //    {
            //        //risposta corretta
            //        Console.WriteLine("Risposta corretta.");
            //        //invio all'html che è corretto
            //        PUNTI += 50;
            //    }
            //    else
            //    {
            //        //risposta errata
            //        Console.WriteLine("Risposta sbagliata.");
            //        //invio all'html che è sbagliato
            //    }
            //    arduinoBase.risposta = -1;//contiene la risposta giusta, 0 o 1
            //}

            //arduinoQuadro1.invioMsg("F");
            //Console.WriteLine("Staccare quadro 1.");
            #endregion


            //secondo quadro
        }

        private static Domanda[] getDomande(int idQuadro)
        {
            StreamReader sr = File.OpenText(@"..\..\domande\domande.txt");
            int nDomande = 0;

            while (!sr.EndOfStream)
            {
                int id = Convert.ToInt32(sr.ReadLine().Substring(0, 1));//leggo il 1 carattere
                nDomande += id == idQuadro ? 1 : 0;
            }
            sr.Close();
            Domanda[] domande = new Domanda[nDomande];

            sr = File.OpenText(@"..\..\domande\domande.txt");
            while (!sr.EndOfStream)
            {
                string s = sr.ReadLine();
                string[] parti = s.Split('\t');

                if (parti[0] == idQuadro.ToString())
                {
                    domande[--nDomande].domanda = parti[1];
                    domande[nDomande].rispostaG = parti[2];
                    domande[nDomande].rispostaS = parti[3];
                    domande[nDomande].uscita = false;
                }
            }
            return domande;
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
