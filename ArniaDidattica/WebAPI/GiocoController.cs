﻿using ArniaDidattica.SignalR;
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

        public void RegistrazioneGiocatori()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.RegistrazioneGiocatori();
        }

        public void AvvioVideo()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.AvvioVideo();
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

    }
}
