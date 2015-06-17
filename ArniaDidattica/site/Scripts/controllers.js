'use strict';

/* Controllers */



var beehiveControllers = angular.module('beehiveControllers', []);

beehiveControllers.controller('IntroCtrl', ['$scope','$location',
  function ($scope, $location) {
     
      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var gioco = $.connection.arniaVirtualeHub;

      // Create a function that the hub can call to broadcast messages.
      gioco.client.CaricaVideoUno = function () {
          $.connection.hub.stop();
          $location.path('videouno');
          $scope.$apply()
      };

      $scope.changePage = function () {
          $location.path('videouno')
      };

      // Start the connection.
      $.connection.hub.start()      
  }]);

beehiveControllers.controller('PlayersCtrl', ['$scope', '$location',
  function ($scope, $location) {
     
  }]);

beehiveControllers.controller('VideoUnoCtrl', ['$scope', '$location',
  function ($scope, $location) {
      ////Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      //// Declare a proxy to reference the hub.
      var gioco = $.connection.arniaVirtualeHub;

      // Create a function that the hub can call to broadcast messages.
      gioco.client.TornaHome = function () {
          console.log('torna home');
          $.connection.hub.stop();
          $location.path('/');
          $scope.$apply()
      };

      // Start the connection.
      $.connection.hub.start()
      $scope.changePage = function () {
          $location.path('/')
      };
  }]);