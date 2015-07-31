angular.module('challengeApp.profile', ['ngFileUpload'])
  .controller('ProfileController', ['$scope', '$location', '$state', 'Upload', 'ProfileFactory', 'Auth',
    function($scope, $location, $state, Upload, ProfileFactory, Auth) {
      $scope.update = ProfileFactory.upload;
      $scope.uploadImg = function() {
        var base64Img = $scope.myPic.base64;
        $scope.picture = base64Img;
        Auth.uploadImage(base64Img, $scope.loginUser.id);
      }
    }
  ])
.factory('ProfileFactory', ['Upload','UserFactory', function(Upload,UserFactory){
  var upload = function(userId,file,newname){
    if(newname){
        UserFactory.updateUsername(userId,newname,function(data){
      })
    }
  }
  return {
    upload:upload
  };
}])

