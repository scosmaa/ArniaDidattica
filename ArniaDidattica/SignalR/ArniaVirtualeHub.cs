using Microsoft.AspNet.SignalR;

namespace ArniaDidattica.SignalR
{
    public class ArniaVirtualeHub : Hub
    {
        public void TornaHome()
        {
            Clients.All.tornaHome();
        }

        public void RegistrazioneGiocatori()
        {
            Clients.All.registrazioneGiocatori();
        }

        public void AvvioVideo()
        {
            Clients.All.avvioVideo();
        }

        public void Risposta0()
        {
            Clients.All.risposta0();
        }

        public void Risposta1()
        {
            Clients.All.risposta1();
        } 
    }
}
