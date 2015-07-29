angular.module('challengeApp.auth', [])
.controller('AuthController', ['$scope','$location', 'Auth', function($scope, $location, Auth){
    $scope.user = {};
    $scope.showLogin = true;
    $scope.showSignup = false;

  $scope.switchToLogin = function(){
    $scope.showLogin = true;
    $scope.showSignup = false;
  }

  $scope.switchToSignup = function(){
    $scope.showLogin = false;
    $scope.showSignup = true;
  }

  $scope.login = function(username, password){
    $scope.user.username = username;
    $scope.user.password = password;
    Auth.login(username, password)
    .then(function(data) {
      if (data) {
         $location.path('/dashboard');    
      } else {
        console.log('Incorrect password');
      }
    })
  }

  $scope.signup = function(username, password){
    $scope.user.username = username;
    $scope.user.password = password;
    Auth.createUser(username, password);
     // $location.path('/dashboard');
  }



}])