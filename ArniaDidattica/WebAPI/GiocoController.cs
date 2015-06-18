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
        // Si chiama con url/api
        [Route("")]
        [HttpGet]
        public string GetMetodo()
        {
            return "Funziona!";
        }

        [Route("uno")]
        [HttpGet]
        public void CaricaVideoUno()
        {        
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<ArniaVirtualeHub>();
            hubContext.Clients.All.CaricaVideoUno();
        }

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
    }
}
