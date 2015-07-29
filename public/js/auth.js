angular.module('challengeApp.auth', [])
  .controller('AuthController', ['$scope', '$rootScope', '$location', 'Auth',
    function($scope, $rootScope, $location, Auth) {
      $scope.user = {};
      $scope.showLogin = true;
      $scope.showSignup = false;

      $scope.swapAuth = function() {
        $scope.showLogin = !$scope.showLogin;
        $scope.showSignup = !$scope.showSignup;
      }

      $scope.login = function(username, password) {
        $scope.user.username = username;
        $scope.user.password = password;
        Auth.login(username, password)
          .then(function(data) {
            if (data.data === "true") {
              $location.path('/dashboard');
            } else {
              console.log('Incorrect password');
            }
          });
      }

      $scope.signup = function(username, password) {
        $scope.user.username = username;
        $scope.user.password = password;
        Auth.createUser(username, password);
        $scope.swapAuth();
        // $location.path('/dashboard');
      }
    }
  ]);
