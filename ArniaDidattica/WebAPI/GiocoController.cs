using ArniaDidattica.SignalR;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace ArniaDidattica.WebAPI
{
    [RoutePrefix("api")]
    public class GiocoController : ApiController
    {
        [Route("home")]
        [HttpGet]
        public static void TornaHome()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.TornaHome();
        }

        public static void RegistrazioneGiocatori()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.RegistrazioneGiocatori();
        }

        public static void AvvioVideo()
        {
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.AvvioVideo();
        }

        [Route(@"invio/{msg}")]
        [HttpGet]
        public static void invioMsgArduino(string msg)
        {
            Program.arduinoBase.invioMsg(msg);
        }
    }
}
