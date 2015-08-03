angular.module('challengeApp.ranking', [])
.controller('RankingController', function ($scope, CreateChallengeFactory) {
  CreateChallengeFactory.getAllUsers().then(function(allusers){
    $scope.users = allusers;
  });

})

