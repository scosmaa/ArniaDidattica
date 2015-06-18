'use strict';

/* Controllers */

var beehiveControllers = angular.module('beehiveControllers', []);
var punti = 0;

var giocatori = [];
var  gruppetti ;


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
      $scope.AddNew = function () {
          var n_bee = $scope.nomeApe;

          if (n_bee == "" || n_bee == null) {
              alert("Inserire un nome per l'ape!");
              return false;
          }
          giocatori.push(n_bee);

          document.getElementById("nomeApe").value="";
          document.getElementById("nomeApe").focus();
      }

      $scope.End = function () {
          var n_bee = $scope.nomeApe;

          if (giocatori.length > 5) {
              if (giocatori.length < 8)
              {
                  gruppetti = new Array(giocatori, giocatori,giocatori);//3 gruppetti
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
          }
      }

  }]);

beehiveControllers.controller('cellclose', ['$scope', '$location',
  function ($scope, $location) {    
      $scope.avvioVideo = function () {
          $.connection.hub.stop();
          $location.path('video1');
          $scope.$apply();
      }
  }]);

beehiveControllers.controller('video1', ['$scope', '$location',
  function ($scope, $location) {
     
  }]);

beehiveControllers.controller('quiz', ['$scope', '$location',
  function ($scope, $location) {

  }]);