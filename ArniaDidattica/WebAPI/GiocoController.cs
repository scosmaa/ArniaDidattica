using ArniaDidattica.SignalR;
using Microsoft.AspNet.SignalR;
using System.Web.Http;

namespace ArniaDidattica.WebAPI
{
    [RoutePrefix("api")]
    public class GiocoController : ApiController
    {
        [Route("home")]
        [HttpGet]
        public void TornaHome()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.TornaHome();
        }

        [Route("registrazioneGiocatori")]
        [HttpGet]
        public void RegistrazioneGiocatori()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.RegistrazioneGiocatori();
        }
        [Route("avvioVideo1")]
        [HttpGet]
        public void AvvioVideo()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.AvvioVideo();
        }

        [Route("avvioVideo2")]
        [HttpGet]
        public void AvvioVideo2()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.AvvioVideo2();
        }

        [Route("domande/{nQuadro}")]
        [HttpGet]
        public string[,] getDomande(int nQuadro)
        {
            return Program.getDomande(nQuadro);
        }

        [Route("invio/0/{msg}")]
        [HttpGet]
        public void invioMsgBase(string msg)
        {
            Program.arduinoBase.invioMsg(msg);
        }

        [Route("invio/1/{msg}")]
        [HttpGet]
        public void invioMsgQuadro1(string msg)
        {
            Program.arduinoQuadro1.invioMsg(msg);
        }

        [Route("invio/2/{msg}")]
        [HttpGet]
        public void invioMsgQuadro2(string msg)
        {
            Program.arduinoQuadro2.invioMsg(msg);
        }
        [Route("invio/3/{msg}")]
        [HttpGet]
        public void invioMsgQuadro3(string msg)
        {
            Program.arduinoQuadro3.invioMsg(msg);
        }

        [Route("risposta0")]
        [HttpGet]
        public void risposta0()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.Risposta0();
        }

        [Route("risposta1")]
        [HttpGet]
        public void risposta1()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.Risposta1();
        }

        #region GiocoC

        [Route("tiroGiocoC")]
        [HttpGet]
        public void TiroGiocoC()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.TiroGiocoC();
        }


        [Route("puntoGiocoC")]
        [HttpGet]
        public void PuntoGiocoC()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.puntoGiocoC();
        }

        #endregion

        #region Quadro3

        [Route("avvioVideo3")]
        [HttpGet]
        public void AvvioVideo3()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.AvvioVideo3();
        }

        #endregion
    }
}
