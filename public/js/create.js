angular.module('challengeApp.createChallenge', ['isteven-multi-select'])
.controller('CreateChallengeController', function ($scope, $state, CreateChallengeFactory) {

  $scope.participants = [];
  $scope.challengeInfo = {};
  $scope.challengeInfo.participants = [];
  $scope.selectedParticipant = null;

  // get array of all users in the database
  CreateChallengeFactory.getAllUsers().then(function(res){
    res.filter(function(user) {
      user.ticked = false;
      $scope.participants.push(user)
    });
  });
  console.log($scope.loginUser)

  $scope.postChallenge = function(challengeInfo){
    challengeInfo.title = challengeInfo.title|| "untitled";
    challengeInfo.time = Number(challengeInfo.time) || 300;
    challengeInfo.wager = Number(challengeInfo.wager) || 100;
    challengeInfo.message = challengeInfo.message || "no description";
    challengeInfo.userId = $scope.loginUser.id;
    if (Number($scope.user.coin) < Number(challengeInfo.wager)) {
      console.log('the wager exceeds your coin');
      $scope.errorMessage = 'make sure the wager does not exceed your coin.';
    }
    else{
        CreateChallengeFactory.postChallenge(challengeInfo,function(data){
          $scope.challenges.push(data.data.challenge);
          $state.go("dashboard.detail", {
            itemId: data.data.challenge.id
          });
        })
    }

};



});
