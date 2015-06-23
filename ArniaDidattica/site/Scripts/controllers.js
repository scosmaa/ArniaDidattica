'use strict';

/* Controller utilizzati dall'applicazione di angularJS*/
var beehiveControllers = angular.module('beehiveControllers', []);
/* Punti fatti durante i quiz/giochi */
var punti = 0;
/* Fase del gioco - QuizA = 1, QuizB = 2 ecc. */
var faseDelGioco;


var nDomandeDaFare;//domande da fare, prese dalla matrice riempita manualmente
var domandeFatte;//domande fatte
var domandeCaricate;//vettore contente le domande in ordine random caricate dal file json
var devoRispondere;//indica se la pressone di uno dei pulsanti sulla base è per rispondere o per caricare la prossima domanda

// Gestione dei punteggi per ogni tipo di gioco
var puntiPerDomandaIndovinataQuizA = 1;
var pallineVintePerRispostaGiustaQuizB = 1;
var pallineVintePerPuntoGiocoC = 1;
var puntiPerDomandaIndovinataQuizD = 1;
var valorePuntoGiocoE = 1;
var puntiPerDomandaIndovinataQuizF = 1;

/* Palline guadagnate per i giochi */
var pallineGiocoC = 1;//inizia da 1
var pallineGiocoE = 1;

var numeroTotaleGiocatori;
var gruppetti;//vettore con N volte classe

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
var classe = ["1", "2", "3", "4", "5", "6"];
numeroTotaleGiocatori = classe.length;
creaGruppetti(classe);

/* Home page */
beehiveControllers.controller('home', ['$scope', '$location',
  function ($scope, $location) {
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

beehiveControllers.controller('quiz', ['$scope', '$location', '$http',
function ($scope, $location, $http) {
    nDomandeDaFare = 0;
    domandeFatte = 0;
    devoRispondere = true;

    faseDelGioco = faseDelGioco != null ? faseDelGioco : 1;

    // Leggo le domande che devono essere fatte in questa fase del gioco
    nDomandeDaFare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

    // Carico le domande di questa fase di gioco
    $http.get('/domande/' + calcolaDomandeDaFare(faseDelGioco) + '.json').success(function (domandeQuizCorrente) {
        // Mischio le domande
        domandeCaricate = shuffle(domandeQuizCorrente);

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

/* Primo Quadro */
/* Inserimento api */
beehiveControllers.controller('newbee', ['$scope', '$location',
  function ($scope, $location) {
      var classe = [];//la classe
      document.getElementById("nomeApe").focus();

      $scope.AddNew = function () {
          if (classe.length <= 10) {
              var n_bee = $scope.nomeApe;

              if (n_bee == "" || n_bee == null) {
                  alert("Inserisci un nome!");
                  return false;
              }
              classe.push(n_bee);

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
              $location.path('cellclose');
          }
          else {
              alert("Inserire minimo 6 api!");
              document.getElementById("nomeApe").focus();
          }
      }
  }]);

beehiveControllers.controller('cellclose', ['$scope', '$location',
  function ($scope, $location) {

      hub.client.avvioVideo = function () {
          $.connection.hub.stop();
          $location.path('video1');
          $scope.$apply();
      }
      // Start the connection.
      $.connection.hub.start()
  }]);

beehiveControllers.controller('video1', ['$scope', '$location',
  function ($scope, $location) {
      var vid = document.getElementById("video1");

      vid.play();
      vid.onended = function () {
          faseDelGioco = 1;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

/* Secondo Quadro */
beehiveControllers.controller('quadro2', ['$scope', '$location',
  function ($scope, $location) {
      hub.client.avvioVideo2 = function () {
          $.connection.hub.stop();
          $location.path('video2');
          $scope.$apply();
      };
      // Apro la connessione con signalR
      $.connection.hub.start()
  }]);

beehiveControllers.controller('video2', ['$scope', '$location',
  function ($scope, $location) {
      var vid = document.getElementById("video2");

      vid.play();
      vid.onended = function () {
          faseDelGioco = 2;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('giocoC', ['$scope', '$location',
  function ($scope, $location) {

      faseDelGioco = 3
      $scope.fioriPresi = pallineGiocoC;

      var nBambiniCheDevonoGiocare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

      $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);
      $scope.pallineRimanenti = pallineGiocoC;

      $http.get('invio/2/' + pallineGiocoC).success(function () { });//invio lo start all'arduino

      hub.client.puntoGiocoC = function () {
          $scope.esitoTiro = "preso un fiore!";
          pallineGiocoE = pallineGiocoE + pallineVintePerPuntoGiocoC;
          $scope.fioriPresi++;
      };

      hub.client.finePallinaGiocoC = function () {
          $scope.pallineRimanenti--;//decremento le palline disponibili

          if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare > 1) {
              //cambio giocatore
              $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);

              //azzero scritte
              $scope.fioriPresi = 0;
              $scope.pallineRimanenti = pallineGiocoC;

              //da provare
              $http.get('invio/2/' + pallineGiocoC).success(function () { });//invio lo start all'arduino

              nBambiniCheDevonoGiocare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare - 1 == 0) {//se era l'ultimo bimbo
              //passo al quadro 3
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
      hub.client.avvioVideo3 = function () {
          $.connection.hub.stop();
          $location.path('video3');
          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start()
  }]);

beehiveControllers.controller('video3', ['$scope', '$location',
  function ($scope, $location) {
      var vid = document.getElementById("video3");

      vid.play();
      vid.onended = function () {
          faseDelGioco = 4;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('giocoE', ['$scope', '$location',
  function ($scope, $location) {
      faseDelGioco = 5;
      $scope.puntiFatti = 0;

      var nBambiniCheDevonoGiocare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

      $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);

      $scope.pallineRimanenti = pallineGiocoE;

      $http.get('invio/3/' + pallineGiocoE).success(function () { });//invio lo start all'arduino

      hub.client.puntoGiocoE = function (punto) {
          punti = punti + valorePuntoGiocoE;
          $scope.puntiFatti++;
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare > 1) {
              //cambio giocatore
              $scope.giocatore = prendiProssimoGiocatore(faseDelGioco);
              
              $scope.puntiFatti = 0;
              $scope.pallineRimanenti = pallineGiocoE;

              $http.get('invio/3/' + pallineGiocoE).success(function () { });//invio lo start all'arduino

              nBambiniCheDevonoGiocare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && nBambiniCheDevonoGiocare - 1 == 0) {
              //fine gioco
              $.connection.hub.stop();
              faseDelGioco = 6;
              $location.path('quiz');
              $scope.$apply();
          }
      };

      //console.log(giocatoriCheDevonoGiocare);
      // Start the connection.
      $.connection.hub.start()


  }]);

/* Ultimo Quadro */
beehiveControllers.controller('risultato', ['$scope', '$location',
  function ($scope, $location) {
      $scope.punteggioFinale = punti;

      hub.client.reset = function () {         
          //fine gioco
          $.connection.hub.stop();
          faseDelGioco = 6;
          $location.path('home');
          $scope.$apply();

          //cancello tutte le variabili
      };

  }]);


// Utility


// Gestisce la ripsosta della base (0 o 1)
function gestioneRisposta($scope, $location, risp) {//risp è 0 o 1
    if (devoRispondere) {
        if ($scope.domandaCorrente.corretta == risp + 1) {
            document.getElementById("risp" + risp).style.backgroundColor = "green";
            //risposta corretta
            rispostaGiustaAlQuiz(faseDelGioco);
        }
        else {
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

// Restituisce le pagina corretta da visualizzare una volta terminato il quiz
function calcolaPaginaSuccessivaAlQuiz(quadroCorrente) {
    switch (quadroCorrente) {
        case 1:
            return 'quadro2';
            break;
        case 2:
            return 'giocoC';
            break;
        case 4:
            return 'giocoE';
            break;
        case 6:
            return 'risultato';
            break;
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
        gruppetti = [shuffle(classe), shuffle(classe), shuffle(classe)]; //3 gruppetti
    } else {
        gruppetti = [shuffle(classe), shuffle(classe)];        //2 gruppetti
    }
}

/* Prende il prossimo giocatore dato il gruppetti */
function prendiProssimoGiocatore(gioco) {//dato il numero del gioco ti da il giocatore preso dal gruppo specifico

    switch (numeroTotaleGiocatori) {
        case 6:
            {
                switch (gioco) {
                    case 1: {
                        var giocatore = gruppetti[0].pop();
                        break;
                    }
                    case 2: {
                        var giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 3: {
                        var giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 4: {
                        var giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 5: {
                        var giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 6: {
                        var giocatore = gruppetti[0].pop();
                        break;
                    }
                }
                break;
            }
        case 7:
            {
                switch (gioco) {
                    case 1: {
                        var giocatore = gruppetti[0].pop();
                        break;
                    }
                    case 2: {
                        var giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 3: {
                        var giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 4: {
                        var giocatore = gruppetti[1].pop();
                        break;
                    }
                    case 5: {
                        var giocatore = gruppetti[2].pop();
                        break;
                    }
                    case 6: {
                        var giocatore = gruppetti[0].pop();
                        break;
                    }
                }
                break;
            }
        default:
            {
                switch (gioco) {
                    case 1: {
                        var giocatore = gruppetti[0].pop();
                        break;
                    }
                    case 6: {
                        var giocatore = gruppetti[0].pop();
                        break;
                    }
                    default: {
                        var giocatore = gruppetti[1].pop();
                        break;
                    }
                }
                break;
            }
    }

    return giocatore;
}