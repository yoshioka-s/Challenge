angular.module('challengeApp.profile', ['ngFileUpload'])
  .controller('ProfileController', ['$scope', '$location', '$state', 'Upload', 'Auth', 
    function($scope, $location, $state, Upload, Auth) {
      $scope.uploadImage = function() {
        var base64Img = $scope.myPic.base64;
        $scope.picture = base64Img;
        Auth.uploadImage(base64Img);
      }
    }
  ])
