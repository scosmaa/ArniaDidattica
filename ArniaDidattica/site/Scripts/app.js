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
            templateUrl: 'partials/Home.html',
            controller: 'IntroCtrl'
        })
        .when('/NewBee', {
            templateUrl: 'partials/New_Bee.html',
            controller: 'PlayersCtrl'
        })
        .when('/NextPlayer', {
            templateUrl: 'partials/Next_Player.html',
            controller: 'NewPlayerCtrl'
        })
        .when('/Ask', {
            templateUrl: 'partials/Question.html',
            controller: 'PlayersCtrl'
        })
        .when('/Score', {
            templateUrl: 'partials/Stats.html',
            controller: 'PlayersCtrl'
        })
        .when('/FinalScore', {
            templateUrl: 'partials/Final_Score.html',
            controller: 'PlayersCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
  }]);
