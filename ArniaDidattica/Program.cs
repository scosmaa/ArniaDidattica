using ArniaDidattica.WebAPI;
using Microsoft.Owin.Hosting;
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Threading;

namespace ArniaDidattica
{
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
            GiocoController giocoController = new GiocoController();

            WebApp.Start<Avvio>(baseUri);//debug

            int NGIOCATORI;
            int PUNTI = 0;//punti totali

            server = new TcpListener(porta);//in ascolto
            server.Start();

            int q_prec = -1;    //Quadro precedente
            int id = -1;
            TcpClient connesso = null;

            while(true)
            {
                if (q_prec < 0)
                {
                    //Attendo base
                    Console.WriteLine("In attesa della base...");
                    connesso = server.AcceptTcpClient();        
                    id = getId(connesso);
                    if(id == 0)                    
                        q_prec = 0;
                }
                else
                {
                    connesso = server.AcceptTcpClient();
                    id = getId(connesso);

                    //Quadro connesso
                    switch (id)
                    {
                        case 1:
                            if(q_prec == 0)
                            {
                                Console.WriteLine("Quadro 1 connesso.");
                                Console.WriteLine("Starting web Server...");
                                WebApp.Start<Avvio>(baseUri);
                                Process.Start(baseUri);                 //avvio homepage con le tappe
                                q_prec++;
                            }
                            else if (q_prec > 0)
                            {
                                Process.Start(baseUri);                 //Restart
                                q_prec = 0;
                                break;
                            }
                            else
                                Console.WriteLine("Inserito quadro sbagliato.");
                            break;

                        case 2:
                            if(q_prec == 1)
                            {
                                Console.WriteLine("Quadro 2 connesso.");
                                q_prec++;
                                //Niente?
                            }
                            break;

                        case 3:
                            if(q_prec == 2)
                            {
                                Console.WriteLine("Quadro 3 connesso.");
                                q_prec++;
                                //Niente?
                            }
                            break;
                    }
                }
            }
            #region old_connection
            ////faccio connettere l'arduino della base.

            
            //while (id != 0)//controllo se è la base
            //{
            //    connesso = server.AcceptTcpClient();
            //    id = getId(connesso);
            //    if (id != 0)
            //    {
            //        Console.WriteLine("Inserito quadro sbagliato.");
            //        //inviare a video l'errore
            //    }
            //}
            //arduinoBase = new Base(connesso);
            //Console.WriteLine("Base connessa.");


            ////avvio server web
            //Console.WriteLine("Starting web Server...");
            //WebApp.Start<Avvio>(baseUri);
            //Process.Start(baseUri);//avvio homepage con le tappe

            //#region quadro 1
            ////attendo l'arduino quadro 1.

            //Console.WriteLine("In attesa del quadro 1");
            //while (id != 1)//controllo se è il quadro1
            //{
            //    connesso = server.AcceptTcpClient();
            //    id = getId(connesso);
            //    if (id != 1)
            //    {
            //        Console.WriteLine("Inserito quadro sbagliato.");
            //        //inviare a video l'errore
            //    }
            //}
            //arduinoQuadro1 = new Quadro1(connesso);
            //Console.WriteLine("Quadro 1 connesso.");

            //giocoController.RegistrazioneGiocatori();//avvio registrazione giocatori

            ////NGIOCATORI = 8;//inventato, verrà preso dalla reg.
            ////Bambino[] bimbi = new Bambino[NGIOCATORI];
            ////for (int i = 0; i < NGIOCATORI; i++)//per caricare velocemente (per il debug)
            ////{
            ////    bimbi[i] = new Bambino("Ragazzino " + i.ToString());
            ////}
            ////gruppo = new Gruppo(bimbi);
            ////Console.WriteLine("Giocatori inseriti.");

            ////viene stampato di mettere le larve nelle cella

            //while (!arduinoQuadro1.celleChiuse) { Thread.Sleep(500); }//aspetta fino a quando tutte le celle sono chiuse
            //Console.WriteLine("Celle chiuse.");
            ////avvio video
            //Console.WriteLine("Avvio video.");
            //giocoController.AvvioVideo();//avvio registrazione giocatori

            //Thread.Sleep(5000);//aspetto un po'
            //arduinoQuadro1.invioMsg("A");//avvia servomotore
            //Console.WriteLine("Avvio servomotore.");


            //Console.WriteLine("Fine video.");

            ////stampo "prendete le api"
            //Console.WriteLine("Bimbi prendono le api");

            //////carico le domande per il quiz
            ////Domanda[] domande = getDomande(1);

            //////stampo "inizio quiz"
            ////for (int i = 0; i < GESTIONEGRUPPI[10 - NGIOCATORI, 0]; i++)
            ////{
            ////    Thread.Sleep(500);
            ////    Console.WriteLine("Quiz " + i.ToString());
            ////    Bambino bimbo = gruppo.prendiBimbo(0);
            ////    string nomeBimbo = bimbo.nome;
            ////    //stampo a video il nome

            ////    Console.WriteLine("Gioca " + nomeBimbo);

            ////    //prendo domanda e risposte
            ////    Random r = new Random();
            ////    int n = r.Next(domande.Length);
            ////    while (domande[n].uscita) { n = r.Next(domande.Length); }//ne trovo una non uscita

            ////    string domanda = domande[n].domanda;
            ////    Console.WriteLine(domanda);
            ////    string[] risposte = { domande[n].rispostaG, domande[n].rispostaS };//la prima è sempre giusta


            ////    int giusta = -1;//contiene la risposta giusta, 0 o 1
            ////    if (r.Next(2) == 0)//0 o 1
            ////    {
            ////        //giusta  a destra
            ////        giusta = 0;
            ////        Console.WriteLine(risposte[0] + " o " + risposte[1]);
            ////        //invio prima quella giusta
            ////    }
            ////    else
            ////    {
            ////        //giusta a sinistra
            ////        giusta = 1;
            ////        Console.WriteLine(risposte[1] + " o " + risposte[0]);
            ////        //invio prima quella sbaglaita
            ////    }

            ////    arduinoBase.invioMsg("R");

            ////    while (arduinoBase.risposta == -1) { Thread.Sleep(500); }
            ////    if (arduinoBase.risposta == giusta)
            ////    {
            ////        //risposta corretta
            ////        Console.WriteLine("Risposta corretta.");
            ////        //invio all'html che è corretto
            ////        PUNTI += 50;
            ////    }
            ////    else
            ////    {
            ////        //risposta errata
            ////        Console.WriteLine("Risposta sbagliata.");
            ////        //invio all'html che è sbagliato
            ////    }
            ////    arduinoBase.risposta = -1;//contiene la risposta giusta, 0 o 1
            ////}

            ////arduinoQuadro1.invioMsg("F");
            ////Console.WriteLine("Staccare quadro 1.");
            //#endregion


            //secondo quadro
            #endregion
        }

        public static string[,] getDomande(int idQuadro)
        {
            StreamReader sr = File.OpenText(@"..\..\domande\domande.txt");
            int nDomande = 0;

            while (!sr.EndOfStream)
            {
                int id = Convert.ToInt32(sr.ReadLine().Substring(0, 1));//leggo il 1 carattere
                nDomande += id == idQuadro ? 1 : 0;
            }
            sr.Close();
            string[,] domande = new string[nDomande, 3];//domanda | risp vera | risp falsa

            sr = File.OpenText(@"..\..\domande\domande.txt");
            while (!sr.EndOfStream)
            {
                string s = sr.ReadLine();
                string[] parti = s.Split('\t');

                if (parti[0] == idQuadro.ToString())
                {
                    domande[--nDomande, 0] = parti[1];
                    domande[nDomande, 1] = parti[2];
                    domande[nDomande, 2] = parti[3];
                }
            }
            return random(domande);
        }
        public static string[,] random(string[,] vettore)
        {
            //lungo n e largo 3
            Random r = new Random();

            for (int j = 0; j < 5; j++)
            {
                int n = r.Next(vettore.Length / 3);
                int n2 = r.Next(vettore.Length / 3);

                for (int i = 0; i < 3; i++)
                {
                    string temp = vettore[n, i];
                    vettore[n, i] = vettore[n2, i];
                    vettore[n2, i] = temp;
                }
            }

            return vettore;
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
