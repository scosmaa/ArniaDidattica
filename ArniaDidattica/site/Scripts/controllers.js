'use strict';

/* Controllers */

var beehiveControllers = angular.module('beehiveControllers', []);

beehiveControllers.controller('IntroCtrl', ['$scope','$location',
  function ($scope, $location) {
      //Set the hubs URL for the connection
      $.connection.hub.url = "http://localhost:9999/signalr";

      // Declare a proxy to reference the hub.
      var chat = $.connection.myHub;

      // Create a function that the hub can call to broadcast messages.
      chat.client.addMessage = function (name) {
          // Html encode display name and message.
          var encodedName = $('<div />').text(name).html();
          var encodedMsg = $('<div />').text(name).html();
          // Add the message to the page.
          $('#discussion').append('<li><strong>' + encodedName
              + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
      };

      $scope.reset = function () {
          $.get("http://localhost:9999/api/Companies", "", function () {
              $('#discussion').html("");
          });
      };

      $scope.changePage = function () {
          $location.path('players')
      };

      // Start the connection.
      $.connection.hub.start()
  }]);

beehiveControllers.controller('PlayersCtrl', ['$scope', '$location',
  function ($scope, $location) {
     
  }]);


beehiveControllers.controller('NewPlayerCtrl', ['$scope', '$location',
  function ($scope, $location) {
     
	$scope.Check_Names = function() {
        	var n_bee = $location.getElementById("bee").value;
        	var n_hive = $location.getElementById("hive").value;
        
        	if(n_bee == "" || n_bee == null)
        	{
            		alert("Inserire un nome per l'ape!");
	    		return false;
        	}
        	else if(n_hive == "" || n_hive == null)
        	{
            		alert("Inserire un nome per l'alveare!");
            		return false;
        	}
				
	}

	$scope.reset = function () {
	    $.get("http://localhost:9999/api/Companies", "", function () {
	        $('#discussion').html("");
	    });
	};
	    
}]);
