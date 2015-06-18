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
            controller: 'IntroCtrl'
        })
        .when('/newbee', {
            templateUrl: 'partials/new_bee.html',
            controller: 'PlayersCtrl'
        })
        .when('/nextplayer', {
            templateUrl: 'partials/next_player.html',
            controller: 'NewPlayerCtrl'
        })
        .when('/quiz', {
            templateUrl: 'partials/quiz.html',
            controller: 'PlayersCtrl'
        })
        .when('/score', {
            templateUrl: 'partials/score.html',
            controller: 'PlayersCtrl'
        })
        .when('/finalscore', {
            templateUrl: 'partials/final_score.html',
            controller: 'PlayersCtrl'
        })
        .when('/cellclose', {
            templateUrl: 'partials/close_cells.html',
            controller: 'PlayersCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);
