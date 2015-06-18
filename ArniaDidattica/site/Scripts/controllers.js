'use strict';

/* Controllers */

var beehiveControllers = angular.module('beehiveControllers', []);

beehiveControllers.controller('IntroCtrl', ['$scope','$location',
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
