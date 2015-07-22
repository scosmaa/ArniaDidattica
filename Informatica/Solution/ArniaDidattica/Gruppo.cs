using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ArniaDidattica
{
    class Gruppo
    {
        Bambino[] gruppo;
        Bambino[,] gruppetti;
        public Gruppo(Bambino[] gruppo)
        {
            this.gruppo = gruppo;
            int quanti = gruppo.Length;
            if (quanti < 8)
            {
                gruppetti = new Bambino[quanti, 3];//3 gruppetti
            }
            else
            {
                gruppetti = new Bambino[quanti, 2]; //2 gruppetti
            }

            //riempio le righe
            int colonne = gruppetti.Length / quanti;
            for (int i = 0; i < colonne; i++)
            {
                for (int j = 0; j < quanti; j++)
                {
                    gruppetti[j, i] = gruppo[j];
                }
            }
        }

        public Bambino prendiBimbo(int qualeGruppetto)
        {
            Random r = new Random();
            Bambino b;
            do
            {
                b = gruppetti[r.Next(gruppo.Length), qualeGruppetto];


            } while (!b.haGiocato());
            return b;
        }
    }
}
