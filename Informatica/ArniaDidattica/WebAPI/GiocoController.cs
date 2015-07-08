using ArniaDidattica.SignalR;
using Microsoft.AspNet.SignalR;
using System.Web.Http;

namespace ArniaDidattica.WebAPI
{
    [RoutePrefix("api")]
    public class GiocoController : ApiController
    {
        [Route("registrazioneGiocatori")]
        [HttpGet]
        public void RegistrazioneGiocatori()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.RegistrazioneGiocatori();
        }

        [Route("avvioVideo2")]
        [HttpGet]
        public void AvvioVideo2()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.AvvioVideo2();
        }

        #region messaggi agli arduini
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
            if (Program.arduinoQuadro1 != null)
            {
                Program.arduinoQuadro1.invioMsg(msg);
            }
        }

        [Route("invio/2/{msg}")]
        [HttpGet]
        public void invioMsgQuadro2(string msg)
        {
            if (Program.arduinoQuadro2 != null)
            {
                Program.arduinoQuadro2.invioMsg(msg);
            }
        }
        [Route("invio/3/{msg}")]
        [HttpGet]
        public void invioMsgQuadro3(string msg)
        {
            if (Program.arduinoQuadro3 != null)
            {
                Program.arduinoQuadro3.invioMsg(msg);
            }
        }
        #endregion

        #region messaggi
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
        #endregion

        #region GiocoC
        [Route("puntoC")]
        [HttpGet]
        public void PuntoGiocoC()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.puntoGiocoC();
        }

        [Route("fineC")]
        [HttpGet]
        public void finePallinaGiocoC()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.finePallinaGiocoC();
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

        [Route("puntoE/{p}")]
        [HttpGet]
        public void PuntoGiocoE(int p)
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.puntoGiocoE(p);
        }

        #endregion

        public void ResetConfirm()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.resetcofirm();
        }

        public void Reset()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.reset();
        }
    }
}
