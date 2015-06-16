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

        // Si chiama con url/api/potenza/5
        [Route("potenza/{numero}")]
        [HttpGet]
        public int provaPotenza(int numero)
        {
            return numero * numero;
        }

        [Route("leggi/{a}")]
        [HttpGet]
        public string aa(string a)
        {
            return "Hai scritto: " + a;
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
    }
}
