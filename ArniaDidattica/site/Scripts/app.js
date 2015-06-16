'use strict';

/* App Module */

var phonecatApp = angular.module('beehiveApp', [
  'ngRoute',
  'beehiveControllers'
]);

phonecatApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/', {
            templateUrl: 'partials/intro.html',
            controller: 'IntroCtrl'
        })
      .when('/players', {
          templateUrl: 'partials/players.html',
          controller: 'PlayersCtrl'
      })
        .otherwise({
            redirectTo: '/'
        });
  }]);
