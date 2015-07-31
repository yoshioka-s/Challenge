angular.module('challengeApp.dashboard', [])
.controller('dashboardController', ['$scope','$location','$state','Auth','UserFactory','$stateParams','ChallengeFactory',
  function($scope,$location,$state,Auth,UserFactory,$stateParams,ChallengeFactory){
    $scope.challengeNumber = 4;
    $scope.challenges = [];
    $scope.user.username = $stateParams.username;

    UserFactory.getUserInfo($scope.user.username, function(data){
      $scope.loginUser = data.data;
      UserFactory.getUserChallenges($scope.loginUser.id, function(data){
        $scope.challenges = data.data;
      })
    });

    $scope.challenges = [];

      $scope.showAllChallenges = function() {
        $state.go("dashboard.allChallenges");
      }

      $scope.showRanking = function() {
        $state.go("dashboard.ranking");
      }

      $scope.editProfile = function() {
        $state.go("dashboard.profile");
      }

      $scope.createChallenge = function() {
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


    }
  ])
