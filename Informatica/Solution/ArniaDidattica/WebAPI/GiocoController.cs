﻿using ArniaDidattica.SignalR;
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

        [Route("qualcosaConnesso")]
        [HttpGet]
        public void qualcosaConnesso()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.qualcosaConnesso();
        }

        [Route("qualcosaSconnesso")]
        [HttpGet]
        public void qualcosaSconnesso()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.qualcosaSconnesso();
        }


        [Route("quadroErrato")]
        [HttpGet]
        public void quadroErrato()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.quadroErrato();
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

		[Route("pallaE")]
		[HttpGet]
		public void PallaGiocoE()
		{
			var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
			hubContext.Clients.All.pallaGiocoE();
		}

        [Route("puntoE")]
        [HttpGet]
        public void PuntoGiocoE()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.puntoGiocoE();
        }

        #endregion

        [Route("reset/{n}")]
        [HttpGet]
        public void modificaQ_prec(int n)
        {
            Program.q_prec = (n);
        }
    }
}
