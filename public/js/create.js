angular.module('challengeApp.createChallenge', ['isteven-multi-select'])
.controller('CreateChallengeController', function ($scope, $state, CreateChallengeFactory) {

  $scope.participants = [];
  $scope.challengeInfo = {};
  $scope.challengeInfo.participants = [];
  $scope.selectedParticipant = null;


  // $scope.participants = [
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Bob",                 ticked: false },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Peter",               ticked: false },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Marry",               ticked: false },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Alex",                ticked: false },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "John",                ticked: false }
  // ];

  // get array of all users in the database
  CreateChallengeFactory.getAllUsers().then(function(res){
    res.filter(function(user) {
      user.ticked = false;
      $scope.participants.push(user)
    });
     console.log($scope.allUsers);
  });

  $scope.postChallenge = function(challengeInfo){
    challengeInfo.title = challengeInfo.title|| "untitled";
    challengeInfo.time = challengeInfo.time || "300";
    challengeInfo.wager = challengeInfo.wager || "100";
    challengeInfo.message = challengeInfo.message || "no description";

    console.log($scope.user)
    if ($scope.user.coin < $scope.challengeInfo.wager) {
      console.log('the wager exceeds your coin');
      $scope.errorMessage = 'make sure the wager does not exceed your coin.';
      return;
  }
  CreateChallengeFactory.postChallenge(challengeInfo).then(function(res){
      // $state.go('challenge_view', {'id': res.id});
      console.log(res);
  });
};


});
