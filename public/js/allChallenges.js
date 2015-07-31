angular.module('challengeApp.allChallenges', [])
.controller('AllChallengesController', function ($scope, ChallengeFactory) {
  ChallengeFactory.getChallengeList().then(function(allchallenges){
    $scope.publicChallenges = allchallenges;
  });

});
