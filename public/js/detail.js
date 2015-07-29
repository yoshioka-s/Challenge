angular.module('challengeApp.detail', [])
.controller('DetailController', ['$scope','$location','$state','$stateParams',
  function($scope,$location,$state,$stateParams){
    $scope.challenge = $stateParams.itemId;
}])
