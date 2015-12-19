using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Microsoft.Owin.StaticFiles.ContentTypes;
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


            var fileServerOptions = new FileServerOptions()
            {
                RequestPath = PathString.Empty,
                FileSystem = new PhysicalFileSystem("site/")
            };

            fileServerOptions.StaticFileOptions.ServeUnknownFileTypes = true;


            // Inizializzo il server web che conterrà l'applicazione
            app.UseFileServer(fileServerOptions);

            app.MapSignalR();
        }

        private HttpConfiguration ConfigureWebApi()
        {
            HttpConfiguration config = new HttpConfiguration();
            config.MapHttpAttributeRoutes();

            return config;
        }
    }
}
