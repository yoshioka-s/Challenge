angular.module('challengeApp.dashboard', [])
.controller('dashboardController', ['$scope','$location','$state','Auth','UserFactory','$stateParams','ChallengeFactory',
  function($scope,$location,$state,Auth,UserFactory,$stateParams,ChallengeFactory){
    $scope.user.username = $stateParams.username;

    UserFactory.getUserInfo($scope.user.username, function(data){
      $scope.loginUser = data.data;
      console.log($scope.loginUser)
    });
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