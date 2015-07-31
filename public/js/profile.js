angular.module('challengeApp.profile', ['naif.base64'])
  .controller('ProfileController', ['$scope', '$location', '$state', 'ProfileFactory',
    function($scope, $location, $state, ProfileFactory) {
      $scope.update = ProfileFactory.upload;
      $scope.myPic = {};
    }
  ])
.factory('ProfileFactory', ['UserFactory', function(UserFactory){
  var upload = function(userId,newname,image){
    if(newname){
        UserFactory.updateUsername(userId,newname,function(data){});
    }
    if(image.base64){
      UserFactory.uploadImage(image.base64, userId);
    }
  }
  return {
    upload:upload
  };
}])

