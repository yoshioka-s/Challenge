angular.module('challengeApp.dashboard', [])
.controller('dashboardController', ['$scope','$location','$state','Auth','UserFactory','$stateParams','ChallengeFactory',
  function($scope,$location,$state,Auth,UserFactory,$stateParams,ChallengeFactory){
    $scope.challenges = [];
    $scope.user.username = $stateParams.username;

    UserFactory.getUserInfo($scope.user.username, function(data){
      $scope.loginUser = data.data;
    });

    UserFactory.getUserChallenges().then(function(data){
        $scope.challenges = data;
    })

    // $state.transitionTo('dashboard.profile');
    $scope.challenges = [];


    $scope.editProfile = function(){
      $state.go("dashboard.profile");
    }

    $scope.createChallenge = function(){
      $state.go("dashboard.create");
    }

    $scope.findDetail = function(challenge) {
      $state.go("dashboard.detail", {
        itemId: challenge.id
      });
    };

      $scope.logout = function() {
      sessionStorage.removeItem("loggedIn")
      console.log('logout');
      Auth.logout();
      $state.go('auth');
  }


}])