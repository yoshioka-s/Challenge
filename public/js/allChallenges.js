angular.module('challengeApp.allChallenges', ['ngFx','ngAnimate'])
.controller('AllChallengesController', function ($scope, ChallengeFactory) {
  ChallengeFactory.getChallengeList().then(function(allchallenges){
    $scope.publicChallenges = allchallenges;
  });

});
