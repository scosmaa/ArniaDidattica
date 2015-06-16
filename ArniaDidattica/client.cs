using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace ArniaDidattica
{
    class client
    {

        // Prova
        TcpClient socket;
        NetworkStream stream;
        Thread ricezione;

        public IPAddress ip { get; private set; }
        public int id { get; private set; }//id del quadro (0 se base, 1 2 3 4 5 se i quadri)
        public string nome { get; private set; }//nome del quadro



        public client(TcpClient socket)
        {
            this.socket = socket;
            this.ip = ((IPEndPoint)socket.Client.RemoteEndPoint).Address;
            getId(ip);
            stream = socket.GetStream();
            ricezione = new Thread(ricezioneMgs);
            ricezione.Start();
        }

        private void getId(IPAddress ip)
        {
            string stringIP = ip.ToString();
            stringIP = stringIP.Substring(stringIP.LastIndexOf(".") + 1);
            id = Convert.ToInt32(stringIP);

            if (id > 0 && id <= Program.NMAXQUADRI)
            {
                nome = "Quadro " + id.ToString();
            }
            else
            {
                if (id == 100)
                {
                    nome = "Base";
                    id = 0;
                }
                else nome = "sconosciuto";
            }
        }

        void invioMsg(string msg)
        {
            Byte[] sendBytes = Encoding.UTF8.GetBytes(msg);
            stream.Write(sendBytes, 0, sendBytes.Length);
        }

        void ricezioneMgs()
        {
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

                    for (int i = 1; i < Convert.ToInt32(msg); i++)
                        invioMsg("0");
                    invioMsg("1");
                }
            }
            catch (System.IO.IOException)
            { }

            socket.Close();
            Console.WriteLine("Arduino " + nome + " disconnesso ");
        }
    }
}
