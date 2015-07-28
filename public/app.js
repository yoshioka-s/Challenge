angular.module('challengeApp', [
  'challengeApp.challenge',
  'challengeApp.createChallenge',
  'challengeApp.userChallenge',
  'challengeApp.services',
  'ui.router'
])

.config(function($stateProvider, $urlRouterProvider) {
  // TODO: reroute to login/landing page
  $urlRouterProvider.otherwise('/');
  $stateProvider
    // .state('signin', {
    //   url: '/signin',
    //   templateUrl: 'angular/client/challengerApp/auth/signin.html'
    // })

    // .state('signout', {
    //   url: '/signout',
    //   controller: function($scope, $state) {
    //     $scope.logout();
    //     $state.go('signin');
    //   }
    // })

    .state('challenge_create', {
      url: '/challenge/create',
      templateUrl: './html/create.html',
      controller: 'CreateChallengeController'
    })
    .state('challenge_view', {
      url: '/challenge/:id',
      templateUrl: './html/challenge.html',
      controller: 'ChallengeController'
    })
    .state('challenge_list', {
      url: '/challenges',
      templateUrl: './html/list.html',
      controller: 'ChallengeListController'
    })

    .state('user', {
      url: '/user',
      templateUrl: './html/user.html',
      controller: 'UserChallengesController'
    });

}).controller('ChallengeAppController', function($scope, $state, Auth) {
  $scope.user = null;

  $scope.setCurrentUser = function() {
    Auth.getUserInfo().then(function(user) {
      $scope.user = user;
    }, function() {
      $state.go('signin');
    });
  };

  $scope.logout = function() {
    Auth.logout().then(function() {
      $scope.user = null;
    });
  };

  // $scope.setCurrentUser();
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