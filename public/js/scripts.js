var callsApp = angular.module('callsApp', [])

callsApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
})


callsApp.controller('callsController', function($scope, $http, $interval){
		
		$scope.calls = []
		$scope.totalCalls
		$scope.sortType     = 'Duration'; 
 		$scope.sortReverse  = true;  

  		$scope.getCalls = function(){
			$http.get('/calls').success(function(response) {
		         $scope.calls = response;
		         $scope.totalCalls =$scope.calls.length
			});
  		};

		$scope.getCalls()


		$interval(function () {
		  $scope.getCalls()
		},10000);




		



})