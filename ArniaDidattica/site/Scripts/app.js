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
        .otherwise({
            redirectTo: '/'
        });
  }]);
