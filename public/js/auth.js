angular.module('challengeApp.auth', [])
.controller('AuthController', ['$scope','$location', '$q', 'Auth', function($scope, $location, $q, Auth){
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
      console.log('login contr', data);
    })
    // var deferLogin = function() {
    //   var defer = $q.defer();
    //   Auth.login(username, password);
    //   return defer.promise; 
    // }

    // deferLogin()
    // .then(function(data) {
    //   console.log('test q ', data);
    // })
    // .catch(function(fallback) {
    //   console.log('fallback ', fallback);
    // })

     // $location.path('/dashboard');
  }

  $scope.signup = function(username, password){
    $scope.user.username = username;
    $scope.user.password = password;
    Auth.createUser(username, password);
     // $location.path('/dashboard');
  }



}])