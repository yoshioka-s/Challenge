angular.module('challengeApp.auth', [])
.controller('authController', ['$scope','$location', function($scope,$location){
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

  $scope.login = function(username,password){
     $location.path('/dashboard');
  }

  $scope.signup = function(username,password){
     $location.path('/dashboard');
  }



}])