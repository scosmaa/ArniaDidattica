'use strict';

/* Controllers */

var beehiveControllers = angular.module('beehiveControllers', []);

beehiveControllers.controller('IntroCtrl', ['$scope', '$location',
  function ($scope, $location) {
      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.arniaVirtualeHub;

      chat.client.registrazioneGiocatori = function (name) {
          $.connection.hub.stop();
          $location.path('NewBee');
          $scope.$apply();
      };

      // Start the connection.
      $.connection.hub.start()
  }]);


beehiveControllers.controller('PlayersCtrl', ['$scope', '$location',
  function ($scope, $location) {

      var giocatori = [];
      $scope.AddNew = function () {
          var n_bee = $scope.nomeApe;

          if (n_bee == "" || n_bee == null) {
              alert("Inserire un nome per l'ape!");
              return false;
          }
          giocatori.push(n_bee);
      }

      $scope.End = function () {
          var n_bee = $scope.nomeApe;

          if (giocatori > 6) {
              $.connection.hub.stop();
              $location.path('NewBee');
              $scope.$apply();
          }
          else {
              alert("Inserire minimo 6 api!");
          }
      }

      $scope.reset = function () {
          $.get("http://localhost:9999/api/Companies", "", function () {
              $('#discussion').html("");
          });
      };

  }]);
