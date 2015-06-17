using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArniaDidattica
{
    class Bambino
    {
        bool giocato;
        public string nome { get; private set; }

        public Bambino(string nome)
        {

        }

        public bool haGiocato()
        {
            if (giocato)
                return false;
            else
            {
                giocato = !giocato;

                return true;
            }
        }
    }
}
