angular.module('challengeApp.profile', ['naif.base64'])
  .controller('ProfileController', ['$scope', '$location', '$state', 'ProfileFactory',
    function($scope, $location, $state, ProfileFactory) {
      $scope.update = ProfileFactory.upload
      $scope.myPic = {};
    }
  ])
.factory('ProfileFactory', ['UserFactory','$state', function(UserFactory,$state){
  var returnImage;
  var upload = function(username,userId,newname,image){
    if(newname){
        console.log('update name')
        UserFactory.updateUsername(userId, newname);
    }
    if(image){
      console.log(image)
      UserFactory.uploadImage(image.base64, userId);
    }
    if(newname){
      $state.go("dashboard", {username: newname});
    }else if(image){
      $state.reload();
    }
  }
  return {
    upload:upload,
  };
}])

