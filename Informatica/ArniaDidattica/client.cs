using ArniaDidattica.WebAPI;
using System;
using System.Net;
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
            catch (System.NullReferenceException)
            {
                //quadro non connesso
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
                    msg = msg.Substring(0, msg.IndexOf("\0"));
                    Console.WriteLine("Arduino " + nome + " > " + msg);

                    gestioneMsg(msg);
                }
            }
            catch (System.IO.IOException)
            { }


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
    }

}
