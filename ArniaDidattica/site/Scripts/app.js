'use strict';

/* App Module */

var phonecatApp = angular.module('beehiveApp', [
  'ngRoute',
  'beehiveControllers'
]);

phonecatApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'home'
        })
        .when('/newbee', {
            templateUrl: 'partials/new_bee.html',
            controller: 'newbee'
        })
        .when('/cellclose', {
            templateUrl: 'partials/close_cells.html',
            controller: 'cellclose'
        })
           .when('/video1', {
               templateUrl: 'partials/video1.html',
               controller: 'video1'
           })
          .when('/quiz', {
              templateUrl: 'partials/quiz.html',
              controller: 'quiz'
          })
          .when('/quadro2', {
              templateUrl: 'partials/inserimento_quadro_2.html',
              controller: 'quadro2'
          })
          .when('/video2', {
              templateUrl: 'partials/video2.html',
              controller: 'video2'
          })
          .when('/next', {
              templateUrl: 'partials/next_player.html',
              controller: 'next'
          })
        .otherwise({
            redirectTo: '/'
        });
  }]);
