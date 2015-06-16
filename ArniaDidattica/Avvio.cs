using Microsoft.AspNet.SignalR;
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
        // This method is required by Katana:
        public void Configuration(IAppBuilder app)
        {
            var webApiConfiguration = ConfigureWebApi();

            // Use the extension method provided by the WebApi.Owin library:
            app.UseWebApi(webApiConfiguration);

            //app.UseFileServer(new FileServerOptions()
            //{
            //    RequestPath = PathString.Empty,
            //    FileSystem = new PhysicalFileSystem(@".\site"),
            //});

            //app.MapSignalR();
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
            //public void Send(string value)
            //{
            //    Clients.All.addMessage(value);
            //}
        }
    }
}
