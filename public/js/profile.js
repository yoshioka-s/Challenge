angular.module('challengeApp.profile', ['naif.base64'])
  .controller('ProfileController', ['$scope', '$location', '$state', 'Upload', 'ProfileFactory',
    function($scope, $location, $state, Upload, ProfileFactory) {
      $scope.update = ProfileFactory.upload;
      $scope.uploadImg = function() {
        console.log($scope.myPic.base64)
        $scope.picture = $scope.myPic.base64;
      }
    }
  ])
.factory('ProfileFactory', ['Upload','UserFactory', function(Upload,UserFactory){
  var upload = function(userId,file,newname){
    if(newname){
        UserFactory.updateUsername(userId,newname,function(data){});
        UserFactoryuploadImage(base64Img, $scope.loginUser.id);
    }
  }
  return {
    upload:upload
  };
}])

