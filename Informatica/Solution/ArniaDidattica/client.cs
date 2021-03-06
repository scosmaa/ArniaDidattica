﻿using ArniaDidattica.WebAPI;
using System;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace ArniaDidattica
{
    abstract class Client
    {
        protected GiocoController giocoController;

        protected TcpClient socket;
        protected NetworkStream stream;
        protected Thread ricezione;
        public int id { get; protected set; }//id del quadro (0 se base, 1 2 3 4 5 se i quadri)
        public string nome { get; protected set; }//nome del quadro

        public Client(TcpClient socket)
        {
            giocoController = new GiocoController();
            this.socket = socket;

            stream = socket.GetStream();
            ricezione = new Thread(ricezioneMsgs);
            ricezione.Start();
        }


        public void invioMsg(string msg)
        {
            try
            {
                //vedo se è online, in caso riaspetto la connessione
                Byte[] sendBytes = Encoding.UTF8.GetBytes(msg);
                stream.Write(sendBytes, 0, sendBytes.Length);
            }
            catch
            {
                Console.WriteLine("errore");
                //quadro non connesso System.NullReferenceException || System.ObjectDisposedException
            }
        }


        void ricezioneMsgs()//thread
        {
            // stream.ReadTimeout = 3000;

            try
            {
                while (stream.CanRead)
                {
                    // Preparo il buffer
                    byte[] bytes = new byte[socket.ReceiveBufferSize];

                    // riempio il buffer
                    stream.Read(bytes, 0, (int)socket.ReceiveBufferSize);// controllo se è ancora connesso

                    // mando il messaggio su console 
                    string msg = Encoding.UTF8.GetString(bytes);
                    msg = msg.Substring(0, 1);
                    Console.Write("Arduino " + nome + " > " + msg + " -> ");

                    gestioneMsg(msg);
                }
            }
            catch (System.IO.IOException)
            {
            }


            socket.Close();
            Console.WriteLine("Arduino " + nome + " disconnesso ");
            if (nome == "base")
            {
                Program.base_connessa = false;
            }
        }

        public abstract void gestioneMsg(string msg);

        void disconnetti()
        {
            socket.Close();
        }

        //public bool isConnected()
        //{
        //    IPGlobalProperties ipProperties = IPGlobalProperties.GetIPGlobalProperties();
        //    TcpConnectionInformation[] tcpConnections = ipProperties.GetActiveTcpConnections().Where(x => x.LocalEndPoint.Equals(socket.Client.LocalEndPoint) && x.RemoteEndPoint.Equals(socket.Client.RemoteEndPoint)).ToArray();

        //    if (tcpConnections != null && tcpConnections.Length > 0)
        //    {
        //        TcpState stateOfConnection = tcpConnections.First().State;
        //        if (stateOfConnection == TcpState.Established)
        //        {
        //            // Connection is OK
        //        }
        //        else
        //        {
        //            // No active tcp Connection to hostName:port
        //        }

        //    }
        //}
    }

}
