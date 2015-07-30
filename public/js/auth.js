angular.module('challengeApp.auth', [])
  .controller('AuthController', ['$scope', '$rootScope', '$location', '$window', 'Auth',
    function($scope, $rootScope, $location, $window, Auth) {
      $scope.user = {};
      $scope.showLogin = true;
      $scope.showSignup = false;

      $scope.swapAuth = function() {
        $scope.showLogin = !$scope.showLogin;
        $scope.showSignup = !$scope.showSignup;
      }

      $scope.signup = function(username, password) {
        $scope.user.username = username;
        $scope.user.password = password;
        Auth.createUser(username, password);
        $scope.swapAuth();
      }

      $scope.login = function(username, password) {
        $scope.user.username = username;
        $scope.user.password = password;
        Auth.login(username, password)
          .then(function(data) {
            if (data.data === "true") {
              sessionStorage.setItem("loggedIn", "true")
              $location.path('/dashboard');
            } else {
              console.log('Incorrect password');
            }
          });
      }

      $scope.logout = function() {
        sessionStorage.removeItem("loggedIn")
        console.log('logout');
        Auth.logout();
        $location.path('/auth');
      }

    }
  ]);
