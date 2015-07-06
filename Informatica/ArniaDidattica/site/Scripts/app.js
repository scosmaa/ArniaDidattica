'use strict';

/* Iniziallizzazione dell'applicazione angulaJS*/
var beehiveApp = angular.module('beehiveApp', [
  'ngRoute',
  'beehiveControllers'
]);

/* Definisco le pagine da visualizzare in base all'URL richiesto */
beehiveApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider
        .when('/', {
            templateUrl: 'partials/edu_beehive.html',
            controller: 'home'
        })
          .when('/tid', {
              templateUrl: 'partials/home.html',
              controller: 'tid'
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
            templateUrl: 'partials/insert_q2.html',
            controller: 'quadro2'
        })
        .when('/video2', {
            templateUrl: 'partials/video2.html',
            controller: 'video2'
        })
        .when('/giocoC', {
            templateUrl: 'partials/giocoC.html',
            controller: 'giocoC'
        })
        .when('/quadro3', {
            templateUrl: 'partials/insert_q3.html',
            controller: 'quadro3'
        })
        .when('/video3', {
            templateUrl: 'partials/video3.html',
            controller: 'video3'
        })
        .when('/giocoE', {
            templateUrl: 'partials/giocoE.html',
            controller: 'giocoE'
        })
        .when('/risultato', {
            templateUrl: 'partials/final_score.html',
            controller: 'risultato'
        })
        .when('/reset', {
            templateUrl: 'partials/reset.html',
            controller: 'risultato'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);
