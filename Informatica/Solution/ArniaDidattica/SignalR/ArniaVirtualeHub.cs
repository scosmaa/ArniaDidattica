﻿using Microsoft.AspNet.SignalR;

namespace ArniaDidattica.SignalR
{
    public class ArniaVirtualeHub : Hub
    {
        public void TornaHome()
        {
            Clients.All.tornaHome();
        }

        public void RegistrazioneGiocatori()
        {
            Clients.All.registrazioneGiocatori();
        }

        public void AvvioVideo2()
        {
            Clients.All.avvioVideo2();
        }

        public void Risposta0()
        {
            Clients.All.risposta0();
        }
        public void Risposta1()
        {
            Clients.All.risposta1();
        }

        public void qualcosaConnesso()
        {
            Clients.All.qualcosaConnesso();
        }
        public void qualcosaSconnesso()
        {
            Clients.All.qualcosaSconnesso();
        }

        public void quadroErrato()
        {
            Clients.All.quadroErrato();
        }



        #region GiocoC

        public void finePallinaGiocoC()
        {
            Clients.All.finePallinaGiocoC();
        }

        public void PuntoGiocoC()
        {
            Clients.All.puntoGiocoC();
        }

        #endregion

        #region Quadro 3

        public void AvvioVideo3()
        {
            Clients.All.avvioVideo3();
        }

        public void PuntoGiocoE()
        {
            Clients.All.puntoGiocoE();
        }

		public void PallaGiocoE()
		{
			Clients.All.pallaGiocoE();
		}

        #endregion


    }
}
