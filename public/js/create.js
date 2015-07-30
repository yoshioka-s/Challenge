angular.module('challengeApp.createChallenge', ['isteven-multi-select'])
.controller('CreateChallengeController', function ($scope, $state, CreateChallengeFactory) {

  $scope.allUsers = [];
  $scope.challengeInfo = {};
  $scope.challengeInfo.participants = [];
  $scope.selectedParticipant = null;


  // $scope.modernBrowsers = [
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Bob",                 ticked: false  },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Peter",               ticked: false },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Marry",               ticked: false  },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "Alex",                ticked: false },
  //   { icon: "<img src='../img/placeholder.jpg'/>",            name: "John",                ticked: false  }
  // ];

  // get array of all users in the database
  CreateChallengeFactory.getAllUsers().then(function(res){
     $scope.allUsers = res.filter(function(user) {
      console.log(user)
      return (user.id !== $scope.user.id);
    });
    $scope.modernBrowsers = $scope.allUsers.map(function (user) {
      return {icon: "<img src='../img/placeholder.jpg'/>"/* TODO use user.profile_image */, name: user.username, ticked: false};
    });
     console.log($scope.allUsers);
  });

  $scope.addParticipant = function() {
    console.log($scope.user);
    if ($scope.challengeInfo.participants.indexOf($scope.selectedParticipant.id) === -1) {
      $scope.challengeInfo.participants.push($scope.selectedParticipant);
    }
  };

  // method that takes the challengeInfo object as argument and calls the factory POST call
  $scope.postChallenge = function(){
    if ($scope.user.coin < $scope.challengeInfo.wager) {
      console.log('the wager exceeds your coin');
      $scope.errorMessage = 'make sure the wager does not exceed your coin.';
      return;
    }
    console.log($scope.challengeInfo.participants);
    CreateChallengeFactory.postChallenge($scope.challengeInfo).then(function(res){
      $state.go('challenge_view', {'id': res.id});
    });
  };


});
