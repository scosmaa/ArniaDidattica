
'use strict';

/* Controllers */
var beehiveControllers = angular.module('beehiveControllers', []);
var punti = 0;
var ultimoQuadro;

var giocatori = [];
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
          giocatori.push(n_bee);

          document.getElementById("nomeApe").value = "";
          document.getElementById("nomeApe").focus();
      }

      $scope.End = function () {
          var n_bee = $scope.nomeApe;

          if (giocatori.length > 5) {
              if (giocatori.length < 8) {
                  gruppetti = new Array(giocatori, giocatori, giocatori);//3 gruppetti
              }
              else {
                  gruppetti = new Array(giocatori, giocatori);//2 gruppetti
              }

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

beehiveControllers.controller('quiz', ['$scope', '$location',
  function ($scope, $location) {
      nDomandeDaFare = GESTIONEGRUPPI[(10 - giocatori.length)][ultimoQuadro-1];
      domandeFatte = 0;//contatore

      var domanda;
      var rispostaG;
      var rispostaS;
      var nomeBimbo = giocatori[0];//selezione giocatore random

      $.get("http://localhost:9999/api/domande/" + ultimoQuadro, "", function (domandeRicevute) {
          domande = domandeRicevute;

          domanda = domande[domandeFatte][0];
          rispostaG = domande[domandeFatte][1];
          rispostaS = domande[domandeFatte][2];

          
          giusta = 0;

          $scope.nomeBimbo = nomeBimbo;
          $scope.domanda = domanda;
          $scope.risp0 = rispostaG;
          $scope.risp1 = rispostaS;
          $scope.$apply();
      });


      


      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.risposta0 = function (name) {
          if (giusta == 0) {              //gestione risposta 0
              document.getElementById("risp0").style.backgroundColor = "green";
              //risposta corretta
          }
          else {
              document.getElementById("risp0").style.backgroundColor = "red";
              //risposta sbagliata
          };
          domandeFatte++;
          if (domandeFatte < nDomandeDaFare) {          //cambio domanda
              var domanda = domande[domandeFatte][0];
              var rispostaG = domande[domandeFatte][1];
              var rispostaS = domande[domandeFatte][2];

              var nomeBimbo = giocatori[0];//selezione giocatore random
              giusta = 0;

              $scope.nomeBimbo = nomeBimbo;
              $scope.domanda = domanda;
              $scope.risp0 = rispostaG;
              $scope.risp1 = rispostaS;
              $scope.$apply();

          };
          if (domandeFatte >= nDomandeDaFare) {
              $location.path('next');
              $scope.$apply();
          }
      };

      chat.client.risposta1 = function (name) {
          if (giusta == 1) {              //gestione risposta 1
              document.getElementById("risp1").style.backgroundColor = "green";
              //risposta corretta
          }
          else {
              document.getElementById("risp1").style.backgroundColor = "red";
              //risposta sbagliata
          }


          if (domandeFatte < nDomandeDaFare) {          //cambio domanda
              var domanda = domande[domandeFatte][0];
              var rispostaG = domande[domandeFatte][1];
              var rispostaS = domande[domandeFatte][2];

              var nomeBimbo = giocatori[0];//selezione giocatore random
              giusta = 0;

              $scope.nomeBimbo = nomeBimbo;
              $scope.domanda = domanda;
              $scope.risp0 = rispostaG;
              $scope.risp1 = rispostaS;

              domandeFatte++;
          } else {
              $location.path('next');
              $scope.$apply();
          }
      };

      // Start the connection.
      $.connection.hub.start()

  }]);