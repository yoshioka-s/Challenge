angular.module('challengeApp.auth', [])
  .controller('AuthController', ['$scope', '$rootScope', '$location', '$window', 'Auth','$state',
    function($scope, $rootScope, $location, $window, Auth,$state) {
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
        // $location.path('/dashboard');
      }

      $scope.login = function(username, password) {
        $scope.user.username = username;
        $scope.user.password = password;
        var name = username;
        Auth.login(username, password)
          .then(function(data) {
            if (data.data === "true") {
              sessionStorage.setItem("loggedIn", "true")

              $state.go("dashboard", {
                username: username
              });

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
