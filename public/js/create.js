angular.module('challengeApp.createChallenge', ['isteven-multi-select'])
.controller('CreateChallengeController', function ($scope, $state, CreateChallengeFactory) {

  $scope.allUsers = [];
  $scope.challengeInfo = {};
  $scope.challengeInfo.participants = [];
  $scope.selectedParticipant = null;


  $scope.modernBrowsers = [
    { icon: "<img src=[..]/opera.png.. />",               name: "Opera",              maker: "(Opera Software)",        ticked: true  },
    { icon: "<img src=[..]/internet_explorer.png.. />",   name: "Internet Explorer",  maker: "(Microsoft)",             ticked: false },
    { icon: "<img src=[..]/firefox-icon.png.. />",        name: "Firefox",            maker: "(Mozilla Foundation)",    ticked: true  },
    { icon: "<img src=[..]/safari_browser.png.. />",      name: "Safari",             maker: "(Apple)",                 ticked: false },
    { icon: "<img src=[..]/chrome.png.. />",              name: "Chrome",             maker: "(Google)",                ticked: true  }
  ];


  // get array of all users in the database
  CreateChallengeFactory.getAllUsers().then(function(res){
    $scope.allUsers = res.filter(function(user) {
      return (user.id !== $scope.user.id);
    });
  });

  $scope.addParticipant = function() {
    if ($scope.challengeInfo.participants.indexOf($scope.selectedParticipant.id) === -1) {
      $scope.challengeInfo.participants.push($scope.selectedParticipant);
    }
  };

  // method that takes the challengeInfo object as argument and calls the factory POST call
  $scope.postChallenge = function(){
    CreateChallengeFactory.postChallenge($scope.challengeInfo).then(function(res){
      $state.go('challenge_view', {'id': res.id});
    });
  };


});
