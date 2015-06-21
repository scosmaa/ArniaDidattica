
'use strict';

/* Controllers */
var beehiveControllers = angular.module('beehiveControllers', []);
var punti = 0;
var ultimoQuadro;
// Gestione dei punteggi per ogni tipo di gioco
var puntiPerDomandaIndovinataQuizA = 1;
var pallineVintePerRispostaGiustaQuizB = 1;
var pallineVintePerPuntoGiocoC = 1;
var puntiPerDomandaIndovinataQuizD = 1;
var valorePuntoGiocoE = 1;
var puntiPerDomandaIndovinataQuizF = 1;

var pallineGiocoC = 0;
var pallineGiocoE = 0;
// Contiene i giocatori che devono ancora giocare
var giocatoriCheDevonoGiocare = [];
// Contiene i giocatori che hanno già giocato
var giocatoriCheHannoGiocato = [];
// numero di giocatori totali
var totaleGiocatori;

var gruppetti;



var GESTIONEGRUPPI = [[], [], [], [], []];

GESTIONEGRUPPI[0][0] = 5; GESTIONEGRUPPI[0][1] = 2; GESTIONEGRUPPI[0][2] = 3; GESTIONEGRUPPI[0][3] = 2; GESTIONEGRUPPI[0][4] = 3; GESTIONEGRUPPI[0][5] = 5;
GESTIONEGRUPPI[1][0] = 5; GESTIONEGRUPPI[1][1] = 2; GESTIONEGRUPPI[1][2] = 3; GESTIONEGRUPPI[1][3] = 2; GESTIONEGRUPPI[1][4] = 2; GESTIONEGRUPPI[1][5] = 5;
GESTIONEGRUPPI[2][0] = 4; GESTIONEGRUPPI[2][1] = 2; GESTIONEGRUPPI[2][2] = 2; GESTIONEGRUPPI[2][3] = 2; GESTIONEGRUPPI[2][4] = 2; GESTIONEGRUPPI[2][5] = 4;
GESTIONEGRUPPI[3][0] = 4; GESTIONEGRUPPI[3][1] = 4; GESTIONEGRUPPI[3][2] = 3; GESTIONEGRUPPI[3][3] = 3; GESTIONEGRUPPI[3][4] = 4; GESTIONEGRUPPI[3][5] = 4; GESTIONEGRUPPI[4][0] = 3; GESTIONEGRUPPI[4][1] = 3; GESTIONEGRUPPI[4][2] = 3; GESTIONEGRUPPI[4][3] = 3; GESTIONEGRUPPI[4][4] = 3; GESTIONEGRUPPI[4][5] = 3;



var nDomandeDaFare;
var domandeFatte;
var domande;
var giusta;

beehiveControllers.controller('home', ['$scope', '$location',
  function ($scope, $location) {


      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.registrazioneGiocatori = function (name) {
          $.connection.hub.stop();
          $location.path('newbee');
          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start()
  }]);


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

          document.getElementById("nomeApe").value = "";
          document.getElementById("nomeApe").focus();
      }

      $scope.End = function () {
          var n_bee = $scope.nomeApe;

          if (giocatoriCheDevonoGiocare.length > 5) {
              if (giocatoriCheDevonoGiocare.length < 8) {
                  gruppetti = new Array(giocatoriCheDevonoGiocare, giocatoriCheDevonoGiocare, giocatoriCheDevonoGiocare);//3 gruppetti
              }
              else {
                  gruppetti = new Array(giocatoriCheDevonoGiocare, giocatoriCheDevonoGiocare);//2 gruppetti
              }
              totaleGiocatori = giocatoriCheDevonoGiocare.length;
              $.connection.hub.stop();
              $location.path('cellclose');
              $scope.$apply();
          }
          else {
              alert("Inserire minimo 6 api!");

              document.getElementById("nomeApe").focus();
          }
      }

  }]);

beehiveControllers.controller('cellclose', ['$scope', '$location',
  function ($scope, $location) {

      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.avvioVideo = function () {
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
          ultimoQuadro = 1;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('quiz', ['$scope', '$location','$http',
function ($scope, $location,$http) {    
// Temporanea
      giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.length != 0 ? giocatoriCheDevonoGiocare : ['1', '2', '3', '4', '5', '6'];
      totaleGiocatori = 6;
      giocatoriCheDevonoGiocare = shuffle(giocatoriCheDevonoGiocare);
      console.log(giocatoriCheDevonoGiocare);
      ultimoQuadro = ultimoQuadro != null ? ultimoQuadro : 1;

      nDomandeDaFare = GESTIONEGRUPPI[(10 - totaleGiocatori)][ultimoQuadro - 1];
      domandeFatte = 0;//contatore

      var domanda;
      var rispostaG;
      var rispostaS;
      var nomeBimbo = giocatoriCheDevonoGiocare.pop();//selezione giocatore random
      giocatoriCheHannoGiocato.push(nomeBimbo);

      $http.get('/domande/' + calcolaDomandeDaFare(ultimoQuadro) + '.json').success(function (domandeQuizCorrente) {
          // Mischio le domande
          domande = shuffle(domandeQuizCorrente);
          
          $scope.nomeBimbo = nomeBimbo;
          $scope.domandaCorrente = domande.pop();

      });
    
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.risposta0 = function (name) {
          if ($scope.domandaCorrente.corretta == 1) {              //gestione risposta 0
              document.getElementById("risp0").style.backgroundColor = "green";
              //risposta corretta
              rispostaGiustaAlQuiz(ultimoQuadro);
              console.log(punti);
              console.log(pallineGiocoC);
          }
          else {
              document.getElementById("risp0").style.backgroundColor = "red";
              //risposta sbagliata
          };
          domandeFatte++;

          if (domandeFatte < nDomandeDaFare) {          //cambio domanda
             
              var nomeBimbo = giocatoriCheDevonoGiocare.pop();//selezione giocatore random
              giocatoriCheHannoGiocato.push(nomeBimbo);

              $scope.nomeBimbo = nomeBimbo;
              $scope.domandaCorrente = domande.pop();
              $scope.$apply();

          };
          if (domandeFatte >= nDomandeDaFare) {
              $.connection.hub.stop();
              var schermataSuccessiva = calcolaPaginaSuccessivaAlQuiz(ultimoQuadro);
              $location.path(schermataSuccessiva);
              $scope.$apply();
          }
      };

      chat.client.risposta1 = function (name) {
          if ($scope.domandaCorrente.corretta == 2) {              //gestione risposta 1
              document.getElementById("risp1").style.backgroundColor = "green";
              //risposta corretta
              rispostaGiustaAlQuiz(ultimoQuadro);
          }
          else {
              document.getElementById("risp1").style.backgroundColor = "red";
              //risposta sbagliata
          }

          domandeFatte++;
          if (domandeFatte < nDomandeDaFare) {          //cambio domanda
              
              var nomeBimbo = nomeBimbo = giocatoriCheDevonoGiocare.pop();//selezione giocatore random
              giocatoriCheHannoGiocato.push(nomeBimbo);
              giusta = 0;

              $scope.nomeBimbo = nomeBimbo;
              $scope.domandaCorrente = domande.pop();
              $scope.$apply();

              domandeFatte++;
          } else {
              $.connection.hub.stop();
              var schermataSuccessiva = calcolaPaginaSuccessivaAlQuiz(ultimoQuadro);
              $location.path(schermataSuccessiva);
              $scope.$apply();
          }
      };

      // Start the connection.
      $.connection.hub.start()

  }]);

beehiveControllers.controller('quadro2', ['$scope', '$location',
  function ($scope, $location) {
      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.avvioVideo2 = function () {
          $.connection.hub.stop();
          $location.path('video2');
          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start()
  }]);

beehiveControllers.controller('video2', ['$scope', '$location',
  function ($scope, $location) {
      var vid = document.getElementById("video2");
      vid.focus();
      vid.play();
      vid.onended = function () {
          ultimoQuadro = 2;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('giocoC', ['$scope', '$location',
  function ($scope, $location) {

      // Temporanea
      pallineGiocoC = 3;
      giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.length != 0 ? giocatoriCheDevonoGiocare : ['1', '2', '3', '4', '5', '6'];
      totaleGiocatori = 6;
      giocatoriCheDevonoGiocare = shuffle(giocatoriCheDevonoGiocare);
      console.log(giocatoriCheDevonoGiocare);


     ultimoQuadro = 3
      $scope.pallineTotali = pallineGiocoC;

      var ripetizioniDaFare = GESTIONEGRUPPI[(10 - totaleGiocatori)][ultimoQuadro - 1];

      if (giocatoriCheDevonoGiocare.length == 0) {
          giocatoriCheDevonoGiocare = shuffle(giocatoriCheHannoGiocato);
          giocatoriCheHannoGiocato = [];
      }

      var giocatoreCorrente = giocatoriCheDevonoGiocare.pop();
      $scope.giocatore = giocatoreCorrente;
      $scope.pallineRimanenti = pallineGiocoC;


      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.puntoGiocoC = function () {
          $scope.esitoTiro = "preso!";
          pallineGiocoE = pallineGiocoE + pallineVintePerPuntoGiocoC;
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 0) {
              var giocatoreCorrente = giocatoriCheDevonoGiocare.pop();
              $scope.giocatore = giocatoreCorrente;
              $scope.pallineRimanenti = pallineGiocoC;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare == 0) {
              $.connection.hub.stop();
              $location.path('quadro3');
              $scope.$apply();
          }

          
      };

      chat.client.tiroGiocoC = function () {
          $scope.esitoTiro = "mancato!";
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 0) {
              var giocatoreCorrente = giocatoriCheDevonoGiocare.pop();
              $scope.giocatore = giocatoreCorrente;
              $scope.pallineRimanenti = pallineGiocoC;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare == 0) {
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
      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.avvioVideo3 = function () {
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
          ultimoQuadro = 4;
          $location.path('quiz');
          $scope.$apply();
      }

  }]);

beehiveControllers.controller('giocoE', ['$scope', '$location',
  function ($scope, $location) {

      // Temporanea
      pallineGiocoC = 3;
      giocatoriCheDevonoGiocare = giocatoriCheDevonoGiocare.length != 0 ? giocatoriCheDevonoGiocare : ['1', '2', '3', '4', '5', '6'];
      totaleGiocatori = 6;
      giocatoriCheDevonoGiocare = shuffle(giocatoriCheDevonoGiocare);
      console.log(giocatoriCheDevonoGiocare);


      ultimoQuadro = 5
      $scope.pallineTotali = pallineGiocoC;

      var ripetizioniDaFare = GESTIONEGRUPPI[(10 - totaleGiocatori)][ultimoQuadro - 1];

      if (giocatoriCheDevonoGiocare.length == 0) {
          giocatoriCheDevonoGiocare = shuffle(giocatoriCheHannoGiocato);
          giocatoriCheHannoGiocato = [];
      }

      var giocatoreCorrente = giocatoriCheDevonoGiocare.pop();
      $scope.giocatore = giocatoreCorrente;
      $scope.pallineRimanenti = pallineGiocoC;


      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.puntoGiocoC = function () {
          $scope.esitoTiro = "preso!";
          pallineGiocoE = pallineGiocoE + pallineVintePerPuntoGiocoC;
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 0) {
              var giocatoreCorrente = giocatoriCheDevonoGiocare.pop();
              $scope.giocatore = giocatoreCorrente;
              $scope.pallineRimanenti = pallineGiocoC;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare == 0) {
              $.connection.hub.stop();
              ultimoQuadro = 6;
              $location.path('quiz');
              $scope.$apply();
          }


      };

      chat.client.tiroGiocoC = function () {
          $scope.esitoTiro = "mancato!";
          $scope.pallineRimanenti--;

          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare > 0) {
              var giocatoreCorrente = giocatoriCheDevonoGiocare.pop();
              $scope.giocatore = giocatoreCorrente;
              $scope.pallineRimanenti = pallineGiocoC;
              ripetizioniDaFare--;
          }
          $scope.$apply();
          if ($scope.pallineRimanenti == 0 && ripetizioniDaFare == 0) {
              $.connection.hub.stop();
              ultimoQuadro = 6;
              $location.path('quiz');
              $scope.$apply();
          }
      };

      // Start the connection.
      $.connection.hub.start()


  }]);

beehiveControllers.controller('risultato', ['$scope', '$location',
  function ($scope, $location) {
      $scope.punteggioFinale = 50;
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
function rispostaGiustaAlQuiz(quadroCorrente) {
    if (quadroCorrente == 1) {
        punti = punti + puntiPerDomandaIndovinataQuizA;
    };
    if (quadroCorrente == 2) {
        pallineGiocoC = pallineGiocoC + pallineVintePerRispostaGiustaQuizB;
    }
}