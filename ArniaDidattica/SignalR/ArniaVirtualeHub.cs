using Microsoft.AspNet.SignalR;

namespace ArniaDidattica.SignalR
{
    public class ArniaVirtualeHub : Hub
    {
        public void CaricaVideoUno()
        {
            Clients.All.caricaVideoUno();
        }

        public void TornaHome()
        {
            Clients.All.tornaHome();
        }

        public void RegistrazioneGiocatori()
        {
            Clients.All.registrazioneGiocatori();
        }
    }
}
