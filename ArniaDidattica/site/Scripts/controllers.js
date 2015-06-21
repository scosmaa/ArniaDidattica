'use strict';

/* Controller utilizzati dall'applicazione di angularJS*/
var beehiveControllers = angular.module('beehiveControllers', []);
/* Punti fatti durante i quiz/giochi */
var punti = 0;
/* Fase del gioco - QuizA = 1, QuizB = 2 ecc. */
var faseDelGioco;

// Gestione dei punteggi per ogni tipo di gioco
var puntiPerDomandaIndovinataQuizA = 1;
var pallineVintePerRispostaGiustaQuizB = 1;
var pallineVintePerPuntoGiocoC = 1;
var puntiPerDomandaIndovinataQuizD = 1;
var valorePuntoGiocoE = 1;
var puntiPerDomandaIndovinataQuizF = 1;

/* Palline guadagnate per i giochi */
var pallineGiocoC = 0;
var pallineGiocoE = 0;

// Contiene i giocatori che devono ancora giocare
var giocatoriCheDevonoGiocare = [];
// Contiene i giocatori che hanno già giocato
var giocatoriCheHannoGiocato = [];
// numero di giocatori totali
var numeroTotaleGiocatori;

var gruppetti;

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

/* Inserimento api */
beehiveControllers.controller('newbee', ['$scope', '$location',
  function ($scope, $location) {
      document.getElementById("nomeApe").focus();

      $scope.AddNew = function () {
          var n_bee = $scope.nomeApe;

          if (n_bee == "" || n_bee == null) {
              alert("Inserire un nome per l'ape!");
              return false;
          }
          giocatoriCheDevonoGiocare.push(n_bee);

          $scope.nomeApe = "";
          document.getElementById("nomeApe").focus();
      }

      $scope.End = function () {
          var n_bee = $scope.nomeApe;

          if (giocatoriCheDevonoGiocare.length > 5) {
              numeroTotaleGiocatori = giocatoriCheDevonoGiocare.length;
              giocatoriCheDevonoGiocare = shuffle(giocatoriCheDevonoGiocare);
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
      vid.focus();
      vid.play();
      vid.onended = function () {
          faseDelGioco = 1;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('quiz', ['$scope', '$location', '$http',
function ($scope, $location, $http) {

    var nDomandeDaFare = 0;
    var domandeFatte = 0;
    var domandeCaricate;

    // Temporanea
    //giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.length != 0 ? giocatoriCheDevonoGiocare : ['1', '2', '3', '4', '5', '6'];
    //numeroTotaleGiocatori = 6;
    //faseDelGioco = faseDelGioco != null ? faseDelGioco : 1;

    // Leggo le domande che devono essere fatte in questa fase del gioco
    nDomandeDaFare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

    // Carico le domande di questa fase di gioco
    $http.get('/domande/' + calcolaDomandeDaFare(faseDelGioco) + '.json').success(function (domandeQuizCorrente) {
        // Mischio le domande
        domandeCaricate = shuffle(domandeQuizCorrente);

        // Seleziono il giocatore e lo inserisco tra quelli che hanno già giocato
        $scope.nomeBimbo = prendiProssimoGiocatore();            
        // Estraggo la domanda corrente
        $scope.domandaCorrente = domandeCaricate.pop();
    });
    /* Evento che viene chiamato se il giocatore ha premuto il bottone 0 */
    hub.client.risposta0 = function() {
        if ($scope.domandaCorrente.corretta == 1) {
            document.getElementById("risp0").style.backgroundColor = "green";
            //risposta corretta
            rispostaGiustaAlQuiz(faseDelGioco);
        }
        else {
            document.getElementById("risp0").style.backgroundColor = "red";
            //risposta sbagliata
        };
        domandeFatte++;

        if (domandeFatte < nDomandeDaFare) {          //cambio domanda
            // Cambio domanda e giocatore
            $scope.nomeBimbo = prendiProssimoGiocatore();
            $scope.domandaCorrente = domandeCaricate.pop();
            $scope.$apply();

        }else {
            $.connection.hub.stop();
            var schermataSuccessiva = calcolaPaginaSuccessivaAlQuiz(faseDelGioco);
            $location.path(schermataSuccessiva);
            console.log(punti);
            $scope.$apply();
        }
    };
    /* Evento che viene chiamato se il giocatore ha premuto il bottone 1 */
    hub.client.risposta1 = function (name) {
        if ($scope.domandaCorrente.corretta == 2) {              //gestione risposta 1
            document.getElementById("risp1").style.backgroundColor = "green";
            //risposta corretta
            rispostaGiustaAlQuiz(faseDelGioco);
        }
        else {
            document.getElementById("risp1").style.backgroundColor = "red";
            //risposta sbagliata
        }

        domandeFatte++;
        if (domandeFatte < nDomandeDaFare) {          //cambio domanda
            // Cambio domanda e giocatore
            $scope.nomeBimbo = prendiProssimoGiocatore();
            $scope.domandaCorrente = domandeCaricate.pop();
            $scope.$apply();
        } else {
            $.connection.hub.stop();
            var schermataSuccessiva = calcolaPaginaSuccessivaAlQuiz(faseDelGioco);
            $location.path(schermataSuccessiva);
            console.log(punti);
            $scope.$apply();
        }
    };
    // Apro la connessione con signalR
    $.connection.hub.start()
}]);

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
      vid.focus();
      vid.play();
      vid.onended = function () {
          faseDelGioco = 2;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('giocoC', ['$scope', '$location',
  function ($scope, $location) {

      // Temporanea
      //pallineGiocoC = 3;
      //giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.length != 0 ? giocatoriCheDevonoGiocare : ['1', '2', '3', '4', '5', '6'];
      //numeroTotaleGiocatori = 6;
      //giocatoriCheDevonoGiocare = shuffle(giocatoriCheDevonoGiocare);
      //console.log(giocatoriCheDevonoGiocare);

      faseDelGioco = 3
      $scope.pallineTotali = pallineGiocoC;

      var ripetizioniDaFare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

      $scope.giocatore = prendiProssimoGiocatore();
      $scope.pallineRimanenti = pallineGiocoC;

      hub.client.puntoGiocoC = function () {
          $scope.esitoTiro = "preso!";
          pallineGiocoE = pallineGiocoE + pallineVintePerPuntoGiocoC;
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 1) {              
              $scope.giocatore = prendiProssimoGiocatore();
              $scope.pallineRimanenti = pallineGiocoC;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare-1 == 0) {
              $.connection.hub.stop();
              $location.path('quadro3');
              $scope.$apply();
          }


      };

      hub.client.tiroGiocoC = function () {
          $scope.esitoTiro = "mancato!";
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 1) {              
              $scope.giocatore = prendiProssimoGiocatore();
              $scope.pallineRimanenti = pallineGiocoC;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare-1 == 0) {
              $.connection.hub.stop();
              $location.path('quadro3');
              $scope.$apply();
          }
      };

      // Start the connection.
      $.connection.hub.start()


  }]);

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
      vid.focus();
      vid.play();
      vid.onended = function () {
          faseDelGioco = 4;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('giocoE', ['$scope', '$location',
  function ($scope, $location) {

      // Temporanea
      //pallineGiocoC = 3;
      //giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.length != 0 ? giocatoriCheDevonoGiocare : ['1', '2', '3', '4', '5', '6'];
      //numeroTotaleGiocatori = 6;
      //giocatoriCheDevonoGiocare = shuffle(giocatoriCheDevonoGiocare);
      //console.log(giocatoriCheDevonoGiocare);
      
      faseDelGioco = 5
      $scope.pallineTotali = pallineGiocoE;

      var ripetizioniDaFare = GESTIONEGRUPPI[(10 - numeroTotaleGiocatori)][faseDelGioco - 1];

      if (giocatoriCheDevonoGiocare.length == 0) {
          giocatoriCheDevonoGiocare = shuffle(giocatoriCheHannoGiocato);
          giocatoriCheHannoGiocato = [];
      }

      $scope.giocatore = prendiProssimoGiocatore();
      $scope.pallineRimanenti = pallineGiocoE;

      hub.client.puntoGiocoC = function () {
          $scope.esitoTiro = "preso!";
          punti = punti + valorePuntoGiocoE;
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 1) {              
              $scope.giocatore = prendiProssimoGiocatore();
              $scope.pallineRimanenti = pallineGiocoE;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare-1 == 0) {
              $.connection.hub.stop();
              faseDelGioco = 6;
              $location.path('quiz');
              $scope.$apply();
          }


      };

      hub.client.tiroGiocoC = function () {
          $scope.esitoTiro = "mancato!";
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 1) {              
              $scope.giocatore = prendiProssimoGiocatore();
              $scope.pallineRimanenti = pallineGiocoE;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare-1 == 0) {
              $.connection.hub.stop();
              faseDelGioco = 6;
              $location.path('quiz');
              $scope.$apply();
          }
      };

      // Start the connection.
      $.connection.hub.start()


  }]);

beehiveControllers.controller('risultato', ['$scope', '$location',
  function ($scope, $location) {
      $scope.punteggioFinale = punti;
  }]);


// Utility

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
            break;
        case 2:
            return 'quizB';
            break;
        case 4:
            return 'quizD';
            break;
        case 6:
            return 'quizF'
            break;
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

/* Calcola il prossimo giocatore in maniera random */
function prendiProssimoGiocatore() {    
    if (giocatoriCheDevonoGiocare.length == 0) {
        giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.concat(shuffle(giocatoriCheHannoGiocato));
        giocatoriCheHannoGiocato.length = 0;
    };
    var giocatore = giocatoriCheDevonoGiocare.pop();
    giocatoriCheHannoGiocato.push(giocatore);
    return giocatore;
}