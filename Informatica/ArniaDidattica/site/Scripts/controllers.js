'use strict';

var beehiveControllers = angular.module('beehiveControllers', []);/* Controller utilizzati dall'applicazione di angularJS*/

//Variabili
var punti = 0;      /* Punti fatti durante i quiz/giochi */
var faseDelGioco;   /* Fase del gioco - QuizA = 1, QuizB = 2 ecc. */
var nDomandeDaFare;//domande da fare, prese dalla matrice riempita manualmente
var domandeFatte;//domande fatte
var domandeCaricate;//vettore contente le domande in ordine random caricate dal file json
var devoRispondere;//indica se la pressone di uno dei pulsanti sulla base è per rispondere o per caricare la prossima domanda
var numeroTotaleGiocatori;
var gruppetti;//vettore con N volte classe
var classe = [];
var faseVideo = 0;//indica il numero del prossimo video che andrà in esecuzione

//Costanti
// Gestione dei punteggi per ogni tipo di gioco
var puntiPerDomandaIndovinataQuizA = 1;
var pallineVintePerRispostaGiustaQuizB = 1;
var pallineVintePerPuntoGiocoC = 1;
var puntiPerDomandaIndovinataQuizD = 1;
var valorePuntoGiocoE = 1;
var puntiPerDomandaIndovinataQuizF = 1;
var pallineGiocoC = 1;  // Palline guadagnate per i giochi
var pallineGiocoE = 1;

/* Modalità di gioco in base al numero di giocatori */
var GESTIONEGRUPPI = [[], [], [], [], []];

GESTIONEGRUPPI[0][0] = 5; GESTIONEGRUPPI[0][1] = 2; GESTIONEGRUPPI[0][2] = 3; GESTIONEGRUPPI[0][3] = 2; GESTIONEGRUPPI[0][4] = 3; GESTIONEGRUPPI[0][5] = 5;
GESTIONEGRUPPI[1][0] = 5; GESTIONEGRUPPI[1][1] = 2; GESTIONEGRUPPI[1][2] = 3; GESTIONEGRUPPI[1][3] = 2; GESTIONEGRUPPI[1][4] = 2; GESTIONEGRUPPI[1][5] = 5;
GESTIONEGRUPPI[2][0] = 4; GESTIONEGRUPPI[2][1] = 2; GESTIONEGRUPPI[2][2] = 2; GESTIONEGRUPPI[2][3] = 2; GESTIONEGRUPPI[2][4] = 2; GESTIONEGRUPPI[2][5] = 4;
GESTIONEGRUPPI[3][0] = 4; GESTIONEGRUPPI[3][1] = 4; GESTIONEGRUPPI[3][2] = 3; GESTIONEGRUPPI[3][3] = 3; GESTIONEGRUPPI[3][4] = 4; GESTIONEGRUPPI[3][5] = 4;
GESTIONEGRUPPI[4][0] = 3; GESTIONEGRUPPI[4][1] = 3; GESTIONEGRUPPI[4][2] = 3; GESTIONEGRUPPI[4][3] = 3; GESTIONEGRUPPI[4][4] = 3; GESTIONEGRUPPI[4][5] = 3;

/* Inizializzazione signalR (tecnologia che permette al client di ricevere dati dal server) */
$.connection.hub.url = "http://localhost:9999/signalr";
var hub = $.connection.arniaVirtualeHub;


//per il debug
//var classe = ["1", "2", "3", "4", "5", "6"];
//numeroTotaleGiocatori = classe.length;
//creaGruppetti(classe);

/* Home page TID */
beehiveControllers.controller('tid', ['$scope', '$location', '$rootScope',
  function ($scope, $location, $rootScope) {
      $rootScope.bodyClass = 'tid_back';

      /* Quando arriva l'evento del click */
      $scope.eduBeehive = function () {
          // Interrompo la connessione signalR (migliora l'efficienza)
          $.connection.hub.stop();
          // Vado nella pagina successiva

          $rootScope.bodyClass = '';
          faseVideo = 1;//prossimo video sarà la speigazione del eduBeehive
          $location.path('video');

          $scope.$apply();
      }

      /* Quando arriva l'evento  registrazioneGiocatori passo alla pagina successiva*/
      hub.client.registrazioneGiocatori = function (name) {
          // Interrompo la connessione signalR (migliora l'efficienza)
          $.connection.hub.stop();
          // Vado nella pagina successiva

          $rootScope.bodyClass = '';
          faseVideo = 0;//prossimo video sarà la speigazione del eduBeehive
          $location.path('video');

          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start();
  }]);


/**** EDU BEEHIVE ****/
beehiveControllers.controller('eduBeehive', ['$scope', '$location', '$rootScope',
  function ($scope, $location, $rootScope) {

      $scope.statoQuadro = "Inserire quadro numero 1";
      //quadroErrato
      hub.client.quadroErrato = function () { $scope.statoQuadro = "Inserito quadro errato!"; $scope.$apply(); };
      hub.client.qualcosaConnesso = function () { $scope.statoQuadro = "Connessione quadro in corso..."; $scope.$apply(); };
      hub.client.qualcosaSconnesso = function () { $scope.statoQuadro = "Inserire quadro numero 1"; $scope.$apply(); };

      /* Quando arriva l'evento  registrazioneGiocatori passo alla pagina successiva*/
      hub.client.registrazioneGiocatori = function (name) {
          // Interrompo la connessione signalR (migliora l'efficienza)
          $.connection.hub.stop();
          // Vado nella pagina successiva
          $location.path('newbee');
          $scope.$apply();
      };
      // Start the connection.
      $.connection.hub.start();
  }]);

//pagina generica quiz
beehiveControllers.controller('quiz', ['$scope', '$location', '$http',
function ($scope, $location, $http) {
    // $.connection.hub.stop(); da chiedere a Simone

    nDomandeDaFare = 0;
    domandeFatte = 0;
    devoRispondere = true;

    faseDelGioco = faseDelGioco != null ? faseDelGioco : 1;
    console.log("fase :" + faseDelGioco);

    // Leggo le domande che devono essere fatte in questa fase del gioco
    nDomandeDaFare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];
    console.log("domande da fare :" + nDomandeDaFare);

    // Carico le domande di questa fase di gioco
    $http.get('/domande/' + calcolaDomandeDaFare(faseDelGioco) + '.json').success(function (domandeQuizCorrente) {
        // Mischio le domande
        domandeCaricate = shuffle(domandeQuizCorrente);
        console.log("lunghezza vettore domande caricato :" + domandeCaricate.length);
        // Seleziono il giocatore e lo inserisco tra quelli che hanno già giocato
        $scope.nomeBimbo = prendiProssimoGiocatore(faseDelGioco);
        // Estraggo la domanda corrente
        $scope.domandaCorrente = domandeCaricate.pop();
    });


    /* Evento che viene chiamato se il giocatore ha premuto il bottone 0 */
    hub.client.risposta0 = function () { gestioneRisposta($scope, $location, 0); };
    /* Evento che viene chiamato se il giocatore ha premuto il bottone 1 */
    hub.client.risposta1 = function () { gestioneRisposta($scope, $location, 1); };

    // Apro la connessione con signalR
    $.connection.hub.start();
}]);

//pagina generica video
beehiveControllers.controller('video', ['$scope', '$location', '$http', '$rootScope',
function ($scope, $location, $http, $rootScope) {

    var video = document.getElementsByTagName('video')[0];
    var saltaQ1 = false;//se attacco q1 senza selezionare gioco in tid.html
    if (faseVideo == 0) {
        saltaQ1 = true;
        faseVideo = 1;
    }
    video.setAttribute('src', '../video/v' + faseVideo + '.mp4');

    video.focus();
    video.play();
    video.onended = function () {
        $.connection.hub.stop();

        switch (faseVideo) {
            case 1:
                {
                    // Vado nella pagina successiva
                    if (saltaQ1)
                        $location.path('newbee');
                    else
                        $location.path('edu_beehive');
                    break;
                }
            case 2:
                {
                    $location.path('cellclose');
                    break;
                }
            case 3:
                {
                    $http.get('api/invio/1/a').success(function () { });//invio lo start all'arduino
                    faseDelGioco = 1;
                    $location.path('quiz');
                    break;
                }
            case 4:
                {
                    faseDelGioco = 2;
                    $location.path('quiz');
                    break;
                }
            case 5:
                {
                    $location.path('giocoC');
                    break;
                }
            case 6:
                {
                    faseDelGioco = 3;
                    $location.path('quiz');
                    break;
                }
            case 7:
                {
                    $location.path('giocoE');
                    break;
                }
            case 8:
                {
                    $location.path('risultato');
                    break;
                }
        }
        $scope.$apply();
    }

    /*
    v1	 intro
    v2	 spiegazione larve celle
    v3	 video api1
    
    v4	 video api2
    v5	 spiegazione gioco1
    
    v6	 video api3
    v7 	 spiegazione gioco2
    
    v8	 conclusione
    */



}]);


/* Primo Quadro */
beehiveControllers.controller('newbee', ['$scope', '$location',
  function ($scope, $location) {
      classe = [];
      document.getElementById("nomeApe").focus();

      $scope.AddNew = function () {
          if (classe.length < 10) {
              var n_bee = $scope.nomeApe;

              if (n_bee == "" || n_bee == null) {

                  $scope.errore = "Inserire un nome valido!";
                  setTimeout(function () {
                      $scope.errore = "";
                      $scope.$apply();
                  }, 2000); //timeout
                  document.getElementById("nomeApe").focus();
                  return false;
              }

              classe.push(n_bee);

              if ($scope.giocatori == "" || $scope.giocatori == null) {
                  //inserito il primo giocatore
                  $scope.giocatori = n_bee;
                  //   $scope.giocatoriInseriti.style.display = "block";
              }
              else {
                  $scope.giocatori += ', ' + n_bee;
              }

              $scope.nomeApe = "";
              document.getElementById("nomeApe").focus();
          } else {
              alert("Non si possono inserire più di 10 nomi!");
              document.getElementById("btn1").focus();
          }
      }

      $scope.End = function () {
          if (classe.length > 5) {
              numeroTotaleGiocatori = classe.length;
              creaGruppetti(classe);
              $.connection.hub.stop();
              faseVideo = 2;//prossimo video sarà la speigazione dell'inserimento delle larve
              $location.path('video');
              $scope.$apply();
          }
          else {
              $scope.errore = "Inserire minimo 6 nomi!";
              setTimeout(function () {
                  $scope.errore = "";
                  $scope.$apply();
              }, 2000); //timeout

              document.getElementById("nomeApe").focus();
          }
      }


  }]);

beehiveControllers.controller('cellclose', ['$scope', '$location',
  function ($scope, $location) {

      /* Evento che viene chiamato se il giocatore ha premuto il bottone 0 */
      hub.client.risposta0 = function () {
          $.connection.hub.stop();
          faseVideo = 3;//prossimo video sarà la speigazione dell'inserimento delle larve
          $location.path('video');
          $scope.$apply();
      };
      /* Evento che viene chiamato se il giocatore ha premuto il bottone 1 */
      hub.client.risposta1 = function () {
          $.connection.hub.stop();
          faseVideo = 3;//prossimo video sarà la speigazione dell'inserimento delle larve
          $location.path('video');
          $scope.$apply();
      };


      // Start the connection.
      $.connection.hub.start()
  }]);


/* Secondo Quadro */
beehiveControllers.controller('quadro2', ['$scope', '$location',
  function ($scope, $location) {

      $scope.statoQuadro = "Inserire quadro numero 2";
      hub.client.quadroErrato = function () { $scope.statoQuadro = "Inserito quadro errato!"; $scope.$apply(); };
      hub.client.qualcosaConnesso = function () { $scope.statoQuadro = "Connessione quadro in corso..."; $scope.$apply(); };
      hub.client.qualcosaSconnesso = function () { $scope.statoQuadro = "Inserire quadro numero 2"; $scope.$apply(); };

      hub.client.avvioVideo2 = function () {
          $.connection.hub.stop();
          faseVideo = 4;//prossimo video sarà la speigazione dell'inserimento delle larve
          $location.path('video');
          $scope.$apply();
      };

      // Apro la connessione con signalR
      $.connection.hub.start()
  }]);

beehiveControllers.controller('giocoC', ['$scope', '$location', '$http',
function ($scope, $location, $http) {

    faseDelGioco = 3
    // $scope.fioriPresi = 0;

    var nBambiniCheDevonoGiocare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

    $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);
    $scope.pallineRimanenti = pallineGiocoC;
    var tentativi = pallineGiocoC;
    var div = document.getElementById('fiori');

    $http.get('api/invio/2/' + pallineGiocoC).success(function () { });//invio lo start all'arduino

    hub.client.puntoGiocoC = function () {
        $scope.esitoTiro = "preso un fiore!";
        pallineGiocoE = pallineGiocoE + pallineVintePerPuntoGiocoC;
        // $scope.fioriPresi = $scope.fioriPresi + pallineVintePerPuntoGiocoC;

        div.innerHTML = div.innerHTML + '<img class="fiore" src="../img/fiore.png" />';//aggiungo un fiore

        $scope.$apply();
        setTimeout(function () {
            $scope.esitoTiro = "";
            $scope.$apply();
        }, 1500); //timeout
    };

    hub.client.finePallinaGiocoC = function () {
        $scope.pallineRimanenti--;//decremento le palline disponibili

        if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare > 1) {
            setTimeout(function () {
                $scope.esitoTiro = "";

                //cambio giocatore
                $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);

                //azzero scritte
                // $scope.fioriPresi = 0;
                div.innerHTML = "";
                $scope.pallineRimanenti = pallineGiocoC;

                //da provare
                $http.get('api/invio/2/' + pallineGiocoC).success(function () { });//invio lo start all'arduino

                nBambiniCheDevonoGiocare--;
                $scope.$apply();
            }, 2000); //pausa prima del cambio del giocatore
        }
        $scope.$apply();
        if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare - 1 == 0) {//se era l'ultimo bimbo
            //passo al quadro 3
            pallineGiocoE = Math.round(Math.round(pallineGiocoE / tentativi) / 3);//ne verrebbero troppe quindi prendo mediapalline/3
            $.connection.hub.stop();
            $location.path('quadro3');
            $scope.$apply();
        }
    };


    // Start the connection.
    $.connection.hub.start()
}]);


/* Terzo Quadro */
beehiveControllers.controller('quadro3', ['$scope', '$location',
  function ($scope, $location) {

      $scope.statoQuadro = "Inserire quadro numero 3";
      hub.client.quadroErrato = function () { $scope.statoQuadro = "Inserito quadro errato!"; $scope.$apply(); };
      hub.client.qualcosaConnesso = function () { $scope.statoQuadro = "Connessione quadro in corso..."; $scope.$apply(); };
      hub.client.qualcosaSconnesso = function () { $scope.statoQuadro = "Inserire quadro numero 3"; $scope.$apply(); };

      hub.client.avvioVideo3 = function () {
          $.connection.hub.stop();
          faseVideo = 6;//prossimo video sarà la speigazione dell'inserimento delle larve  
          $location.path('video');
          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start()
  }]);

beehiveControllers.controller('giocoE', ['$scope', '$location', '$http',
function ($scope, $location, $http) {
    faseDelGioco = 5;
    $scope.puntiFatti = 0;

    var nBambiniCheDevonoGiocare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

    $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);

    $scope.pallineRimanenti = pallineGiocoE;

    $http.get('api/invio/3/' + pallineGiocoE).success(function () { });//invio lo start all'arduino

    hub.client.puntoGiocoE = function (punto) {
        punti = punti + valorePuntoGiocoE * punto;
        $scope.puntiFatti = $scope.puntiFatti + valorePuntoGiocoE * punto;
        $scope.pallineRimanenti--;

        if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare > 1) {
            //cambio giocatore
            setTimeout(function () {
                $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);

                $scope.puntiFatti = 0;
                $scope.pallineRimanenti = pallineGiocoE;

                $http.get('api/invio/3/' + pallineGiocoE).success(function () { });//invio lo start all'arduino

                nBambiniCheDevonoGiocare--;
                $scope.$apply();
            }, 2000); //pausa prima del cambio del giocatore

        }
        if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare - 1 == 0) {
            //fine gioco
            $.connection.hub.stop();
            faseDelGioco = 6;
            $location.path('quiz');
        }
        $scope.$apply();
    };

    // Start the connection.
    $.connection.hub.start();

}]);


//Reset
beehiveControllers.controller('risultato', ['$scope', '$location', '$http',
  function ($scope, $location, $http) {
      if ($location.url() == "/risultato") {
          //$scope.punteggioFinale = punti;
          setTimeout(function () {
              Reset();
              $.connection.hub.stop();
              //faseDelGioco = 6;

              $http.get('api/reset/0').success(function () { });
              $location.path('home');
              $scope.$apply();
          }, 60000); //timeout
      }
      //fare vasetto
      $scope.BtnReset = function () {
          Reset();
          $.connection.hub.stop();
          //faseDelGioco = 6;

          $http.get('api/reset/0').success(function () { });
          $location.path('home');
          $scope.$apply();
      }

      $scope.BtnReturn = function () {
          window.history.back();
      }
  }]);


// Utility
// Gestisce la ripsosta della base (0 o 1)
function gestioneRisposta($scope, $location, risp) {//risp è 0 o 1

    var correct = document.getElementById("correct");
    var wrong = document.getElementById("wrong");

    if (devoRispondere) {
        if ($scope.domandaCorrente.corretta == risp + 1) {
            correct.play();
            document.getElementById("risp" + risp).style.backgroundColor = "green";
            //risposta corretta
            rispostaGiustaAlQuiz(faseDelGioco);
        }
        else {
            wrong.play();
            document.getElementById("risp" + risp).style.backgroundColor = "red";
            //risposta sbagliata
        };


        document.getElementById("prossimo").style.display = "block";
        devoRispondere = false;
    }
    else {//va qui se la pressione del pulsante corrisponde al caricamento della prossima domanda
        document.getElementById("risp0").style.backgroundColor = "#FFE70A";
        document.getElementById("risp1").style.backgroundColor = "#FFE70A";
        document.getElementById("prossimo").style.display = "none";

        domandeFatte++;
        if (domandeFatte < nDomandeDaFare) {
            // Cambio domanda e giocatore
            $scope.nomeBimbo = prendiProssimoGiocatore(faseDelGioco);
            $scope.domandaCorrente = domandeCaricate.pop();
            $scope.$apply();

        } else {
            //ho finito le domande
            $.connection.hub.stop();
            var schermataSuccessiva = calcolaPaginaSuccessivaAlQuiz(faseDelGioco);
            $location.path(schermataSuccessiva);
            console.log(punti);
            $scope.$apply();
        }

        devoRispondere = true;
    }
}

// Restituisce le pagina corretta da visualizzare una volta terminato il quiz
function calcolaPaginaSuccessivaAlQuiz(quadroCorrente) {
    switch (quadroCorrente) {
        case 1:
            return 'quadro2';
            break;
        case 2:
            {
                faseVideo = 5;//prossimo video sarà la speigazione dell'inserimento delle larve            
                return 'video';
            }
        case 4:
            {
                faseVideo = 7;//prossimo video sarà la speigazione dell'inserimento delle larve            
                return 'video';
            }
        case 6:
            {
                faseVideo = 8;//prossimo video sarà la speigazione dell'inserimento delle larve            
                return 'video';
            }
    }
}

// Restituisce il file json da reperire contenente le domande 
function calcolaDomandeDaFare(quadroCorrente) {
    switch (quadroCorrente) {
        case 1:
            return 'quizA';
        case 2:
            return 'quizB';
        case 4:
            return 'quizD';
        case 6:
            return 'quizF';
    }
}

// Aggiorna il punteggio in base al valore di una risposta giusta
function rispostaGiustaAlQuiz(quizCorrente) {
    if (quizCorrente == 1) {
        punti = punti + puntiPerDomandaIndovinataQuizA;
    };
    if (quizCorrente == 2) {
        pallineGiocoC = pallineGiocoC + pallineVintePerRispostaGiustaQuizB;
    };
    if (quizCorrente == 4) {
        punti = punti + puntiPerDomandaIndovinataQuizD;
    };
    if (quizCorrente == 6) {
        punti = punti + puntiPerDomandaIndovinataQuizF;
    }
}

/* crea i gruppetti */
function creaGruppetti(classe) {
    if (classe.length < 8) {
        gruppetti = [shuffle(classe.slice()), shuffle(classe.slice()), shuffle(classe.slice())];    //3 gruppetti
    } else {
        gruppetti = [shuffle(classe.slice()), shuffle(classe.slice())];                     //2 gruppetti
    }
}

// Randomizza glie elementi di un array (utile per cambiare l'ordine di inserimento dei giocatori)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* Prende il prossimo giocatore dato il gruppetti */
function prendiProssimoGiocatore(gioco) {//dato il numero del gioco ti da il giocatore preso dal gruppo specifico
    var giocatore;
    switch (numeroTotaleGiocatori) {
        case 6:
            {
                switch (gioco) {
                    case 1: {
                        giocatore = gruppetti[0].pop();
                        break;
                    }
                    case 2: {
                        giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 3: {
                        giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 4: {
                        giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 5: {
                        giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 6: {
                        giocatore = gruppetti[0].pop();
                        break;
                    }
                }
                break;
            }
        case 7:
            {
                switch (gioco) {
                    case 1: {
                        giocatore = gruppetti[0].pop();
                        break;
                    }
                    case 2: {
                        giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 3: {
                        giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 4: {
                        giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 5: {
                        giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 6: {
                        giocatore = gruppetti[0].pop();
                        break;
                    }
                }
                break;
            }
        default:
            {
                switch (gioco) {
                    case 1: {
                        giocatore = gruppetti[0].pop();
                        break;
                    }
                    case 6: {
                        giocatore = gruppetti[0].pop();
                        break;
                    }
                    default: {
                        giocatore = gruppetti[1].pop();
                        break;
                    }
                }
                break;
            }
    }

    return giocatore;
}

function Reset() {
    punti = 0;      /* Punti fatti durante i quiz/giochi */
    faseDelGioco = null;   /* Fase del gioco - QuizA = 1, QuizB = 2 ecc. */
    nDomandeDaFare = null;//domande da fare, prese dalla matrice riempita manualmente
    domandeFatte = null;//domande fatte
    domandeCaricate = null;//vettore contente le domande in ordine random caricate dal file json
    devoRispondere = null;//indica se la pressone di uno dei pulsanti sulla base è per rispondere o per caricare la prossima domanda
    numeroTotaleGiocatori = null;
    gruppetti = null;//vettore con N volte classe
    classe = null;
}