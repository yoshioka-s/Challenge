angular.module('challengeApp.services', [])
  .factory('Auth', function($http, $q) {
    var createUser = function(username, password) {
      var deferred = $q.defer();
      $http.post('/auth/signup', {
          username: username,
          password: password
        })
        .success(function(data) {
          deferred.resolve(data);
        })
        .error(function(error) {
          deferred.reject(error);
        })
      return deferred.promise;
    };

    var login = function(username, password) {
      return $http.post('/auth/login', {
          username: username,
          password: password
        })
        .then(function(data) {
          return data;
        })

    }
    var logout = function() {
      return $http.get('/auth/logout').then(function() {
        return true;
      }, function(error) {
        throw Error(error);
      });
    };
    return {
      createUser: createUser,
      login: login,
      logout: logout
    };
  })
.factory('ChallengeFactory', function($http) {

      var getChallengeUser = function(challengeId,callback){
      $http.post('/api/1/getChallengeUser', {
        challengeId: challengeId
      }).then(function(data) {
        callback(data);
      })
    };



    var getChallengeInfo = function(challengeId) {
      return $http({
        method: 'GET',
        url: '/api/1/challenge/' + challengeId,
      }).then(function(resp) {
        return resp.data;
      });
    };

    var acceptChallenge = function(challengeId, userId) {
      return $http({
        method: 'POST',
        url: '/api/1/challenge/' + challengeId + '/accept',
        data: {user_id: userId}
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

    var upvoteUser = function(challengeId, targetUserId, userId) {
      return $http({
        method: 'POST',
        data: {'targetUserId': targetUserId, user_id: userId},
        url: 'api/1/challenge/' + challengeId + '/upvote'
      }).then(function (resp) {
        return resp.data;
      });
    };


    return {
      getChallengeUser:getChallengeUser,
      getChallengeInfo: getChallengeInfo,
      acceptChallenge: acceptChallenge,
      challengeStart: challengeStart,
      challengeComplete: challengeComplete,
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
  var postChallenge = function(challengeInfo,callback) {
    challengeInfo.participants = challengeInfo.participants.map(function(participant) {
      return participant.id;
    });

    $http.post('/api/1/create_challenge', {
      challengeInfo: challengeInfo
    }).then(function(data) {
      callback(data);
    })
  };

  return {
    getAllUsers: getAllUsers,
    getCreatorInfo: getCreatorInfo,
    postChallenge: postChallenge
  };
})
.factory('UserFactory', ['$http', function($http){
  var getUserInfo = function(username,callback){
    $http.post('/api/1/login_user_info', {
      username: username
    }).then(function(data) {
      callback(data);
    })
  };

  var updateUsername = function(userId,newName,callback){
    $http.post('/api/1/update_username', {
      userId: userId,
      newName: newName
    }).then(function(data) {
      callback(data)
    })
  }

  var getUserChallenges = function(userId,callback) {
  $http.post('/api/1/challenge/user', {
      userId:userId
    }).then(function(data) {
      callback(data);
    })
  };

  var uploadImage = function(image,userId) {
  $http.post('/api/1/userImage', {
      image: image,
      userId:userId
    })
    .success(function(data) {
      return data;
    })
  };

  var uploadChallengeImage = function(image,userId,challengeId) {
    $http.post('/api/1/ChallengeImage', {
      image: image,
      userId:userId,
      challengeId:challengeId
    })
    .success(function(data) {
      return data;
    })
  };

  return {
    uploadChallengeImage:uploadChallengeImage,
    uploadImage:uploadImage,
    getUserChallenges:getUserChallenges,
    getUserInfo: getUserInfo,
    updateUsername:updateUsername
  }
}])
