angular.module('challengeApp', [
  'challengeApp.detail',
  'challengeApp.challenge',
  'challengeApp.createChallenge',
  'challengeApp.userChallenge',
  'challengeApp.services',
  'challengeApp.dashboard',
  'challengeApp.profile',
  'challengeApp.auth',
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/auth');
  $stateProvider
    .state('auth', {
      url: '/auth',
      templateUrl: 'html/auth.html',
      controller: 'AuthController'
    })
    .state('challenge_create', {
      url: '/challenge/create',
      templateUrl: './html/create.html',
      controller: 'CreateChallengeController',
      resolve: {authorize: isLoggedIn}
    })
    .state('challenge_view', {
      url: '/challenge/:id',
      templateUrl: './html/challenge.html',
      controller: 'ChallengeController',
      resolve: {authorize: isLoggedIn}
    })
    .state('dashboard.detail', {
      url: '/challenge/:itemId',
      templateUrl: './html/detail.html',
      controller: 'DetailController',
      resolve: {authorize: isLoggedIn}
    })
    .state('dashboard.create', {
      url: '/create',
      templateUrl: './html/create.html',
      controller: 'CreateChallengeController',
      resolve: {authorize: isLoggedIn}
    })
    .state('dashboard.profile', {
      url: '/profile',
      templateUrl: './html/profile.html',
      controller: 'ProfileController',
      resolve: {authorize: isLoggedIn}
    })
    .state('dashboard', {
      url: '/dashboard/:username',
      templateUrl: './html/dashboard.html',
      controller: 'dashboardController',
      resolve: {authorize: isLoggedIn}
    })
    .state('user', {
      url: '/user',
      templateUrl: './html/user.html',
      controller: 'UserChallengesController',
      resolve: {authorize: isLoggedIn}
    });

    function isLoggedIn($q, $timeout, $state, $window) {
      if($window.sessionStorage.loggedIn==='true') {
        console.log('Login succeed!');
        return $q.when();
      } else {
        $timeout(function() {
          $state.go('auth');
        });
        return $q.reject();
      }
    }

}).controller('ChallengeAppController', function($scope, $state, Auth) {
  $scope.user = {};

  $scope.signIn = function(username, pw) {
    $scope.user.username = username;
    $scope.user.password = pw;
    Auth.getUserInfo(username, pw);
  }
}).filter('challengeFilter', function() {
  return function(input, accepted, started, complete, user) {
    user = (user !== undefined) ? parseInt(user) : undefined;
    accepted = (accepted !== undefined && user !== undefined) ? !!parseInt(accepted) : null;
    started = (started !== undefined) ? !!parseInt(started) : null;
    complete = (complete !== undefined) ? !!parseInt(complete) : null;

    return input.filter(function(challenge) {
      var has_accepted = true;

      if (accepted !== null) {
        has_accepted = challenge.participants.some(function(participant) {
          return (participant.accepted === accepted && participant.id === user);
        });
      }
      return (
        ((challenge.started === started) || started === null) && ((challenge.complete === complete) || complete === null) && has_accepted
      );
    });
  };
}).directive('challengeTable', function() {
  return {
    'scope': {
      'challenges': '=',
      'user': '@',
      'accepted': '@',
      'started': '@',
      'complete': '@',
      'caption': '@'
    },
    'restrict': 'E',
    'templateUrl': './html/challengeTable.html'
  };
});
