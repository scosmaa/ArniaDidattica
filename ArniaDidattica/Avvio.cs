using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http;

namespace ArniaDidattica
{
    public class Avvio
    {
        // Configuro OWIN (libreria per integrare in una console application sia le web api che un sito web)
        public void Configuration(IAppBuilder app)
        {
            var webApiConfiguration = ConfigureWebApi();

            // Inizializzo le web api
            app.UseWebApi(webApiConfiguration);

            // Inizializzo il server web che conterrà l'applicazione
            app.UseFileServer(new FileServerOptions()
            {
                RequestPath = PathString.Empty,
                FileSystem = new PhysicalFileSystem(@"..\..\site"),
            });

            app.MapSignalR();
        }

        private HttpConfiguration ConfigureWebApi()
        {
            var config = new HttpConfiguration();
            config.Routes.MapHttpRoute(
                "DefaultApi",
                "api/{controller}/{id}",
                new { id = RouteParameter.Optional });

            return config;
        }

        public class MyHub : Hub
        {
            // Esempio
            public void Send(string value)
            {
                Clients.All.addMessage(value);
            }
        }
    }
}
