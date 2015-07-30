angular.module('challengeApp.detail', [])
.controller('DetailController', ['$scope','$location','$state','$stateParams',
  function($scope,$location,$state,$stateParams){
    $scope.challenge = $stateParams.itemId;

    $scope.players = [{
      username:'Bob',
      challengeImage:'../img/empty.jpg',
      score:100
    },{
      username:'Alex',
      challengeImage:'../img/empty.jpg',
      score:200
    },{
      username:'Peter',
      challengeImage:'../img/empty.jpg',
      score:500
    },{
      username:'Marry',
      challengeImage:'../img/empty.jpg',
      score:800
    }]

  $scope.vote = function(player){
    player.score += 100;
  }


}])
