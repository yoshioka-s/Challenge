angular.module('challengeApp.services', [])
  .factory('Auth', function($http) {
    var createUser = function(username, password) {
      $http.post('/auth/signup', {
          username: username,
          password: password
        })
        .success(function(data) {
          return data;
        })
        .error(function(error) {
          console.log("getUserInfoError: ", error)
        })
        // return $http.get('/api/1/user_info').then(function(res) {
        //   return res.data;
        // }, function(error) {
        //   throw Error(error);
        // });
    };

    var login = function(username, password) {
      return $http.post('/auth/login', {
          username: username,
          password: password
        })
        .then(function(data) {
          return data;
        })
        // .error(function(error) {
        //   console.log("login error, ", error);
        // })
    }
    var logout = function() {
      return $http.get('/auth/logout').then(function() {
        return true;
      }, function(error) {
        throw Error(error);
      });
    };
    return {
      'createUser': createUser,
      login: login,
      'logout': logout
    };
  })
  .factory('ChallengeFactory', function($http) {
    var getChallengeInfo = function(challengeId) {
      return $http({
        method: 'GET',
        url: '/api/1/challenge/' + challengeId,
      }).then(function(resp) {
        return resp.data;
      });
    };

    var acceptChallenge = function(challengeId) {
      return $http({
        method: 'PUT',
        url: '/api/1/challenge/' + challengeId + '/accept',
      }).then(function(resp) {
        return resp.data;
      });
    };

    var challengeStart = function(challengeId) {
      return $http({
        method: 'PUT',
        url: '/api/1/challenge/' + challengeId + '/started',
      }).then(function(resp) {
        return resp.data;
      });
    };

    var challengeComplete = function(challengeId, winnerId) {
      console.log(winnerId);
      return $http({
        method: 'PUT',
        url: '/api/1/challenge/' + challengeId + '/complete',
        data: (winnerId !== undefined) ? {
          'winner': parseInt(winnerId)
        } : {}
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getUserChallenges = function() {
      return $http({
        method: 'GET',
        url: '/api/1/challenge/user'
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getChallengeList = function() {
      return $http({
        method: 'GET',
        url: '/api/1/challenge/public'
      }).then(function(resp) {
        return resp.data;
      });
    };

    var getChallengeComments = function(challengeId) {
      return $http({
        method: 'GET',
        url: '/api/1/challenge/' + challengeId + '/comments'
      }).then(function(resp) {
        return resp.data;
      });
    };

    var postChallengeComment = function(challengeId, text) {
      return $http({
        method: 'POST',
        data: {
          'text': text
        },
        url: '/api/1/challenge/' + challengeId + '/comments'
      }).then(function(resp) {
        return resp.data;
      });
    };

    var upvoteUser = function(challengeId, targetUserId) {
      return $http({
        method: 'POST',
        data: {'targetUserId': targetUserId},
        url: 'api/1/challenge/' + challengeId + '/upvote'
      }).then(function (resp) {
        return resp.data;
      });
    };


    return {
      getChallengeInfo: getChallengeInfo,
      acceptChallenge: acceptChallenge,
      challengeStart: challengeStart,
      challengeComplete: challengeComplete,
      getUserChallenges: getUserChallenges,
      getChallengeList: getChallengeList,
      getChallengeComments: getChallengeComments,
      postChallengeComment: postChallengeComment,
      upvoteUser: upvoteUser
    };
  })

.factory('CreateChallengeFactory', function($http) {
  var getAllUsers = function() {
    return $http({
      method: 'GET',
      url: '/api/1/allUsers'
    }).then(function(resp) {
      return resp.data;
    });
  };

  var getCreatorInfo = function() {
    return $http({
      method: 'GET',
      url: '/api/1/user_info'
    }).then(function(resp) {
      return resp.data;
    });
  };

  // POST method for creating a challenge
  var postChallenge = function(challengeInfo) {
    challengeInfo.participants = challengeInfo.participants.map(function(participant) {
      return participant.id;
    });
    return $http({
      method: 'POST',
      url: '/api/1/challenge',
      data: challengeInfo
    }).then(function(resp) {
      return resp.data;
    });
  };

  return {
    getAllUsers: getAllUsers,
    getCreatorInfo: getCreatorInfo,
    postChallenge: postChallenge
  };
});
