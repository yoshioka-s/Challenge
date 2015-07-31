angular.module('challengeApp.profile', ['ngFileUpload', 'base64', 'ngImgur'])
  .controller('ProfileController', ['$scope', '$location', '$state', '$base64', 'Upload', 'ProfileImage', 'Auth', 
    function($scope, $location, $state, $base64, Upload, ProfileImage, Auth) {
      $scope.uploadImage = function() {
        var base64Img = $scope.myPic;
        Auth.uploadImage(base64Img);
      }

      // function previewFile() {
      //   console.log("running")
      //   var preview = document.querySelector('img');
      //   var file = document.querySelector('input[type=file]').files[0];
      //   var reader = new FileReader();

      //   reader.onloadend = function() {
      //     preview.src = reader.result;
      //   }

      //   if (file) {
      //     reader.readAsDataURL(file);
      //   } else {
      //     preview.src = "";
      //   }
      // }
      // var base64;

      var str;
      var base64;
      $scope.displayPic = function() {
        console.log($scope.myPic)
        str = $scope.myPic.base64;
        base64 = btoa($scope.myPic)
        $scope.decoded = str;
        // console.log(str)
        // fileReader.readAsDataURL(str);
      }
    }
  ])
  .factory('ProfileImage', ['$base64', 'Upload', 'imgur', function($base64, Upload, imgur) {
    var upload = function(file) {
      var encoded = $base64.encode(file);
      var decoded = $base64.decode(encoded);
      console.log("encoded: ", encoded);
      console.log("decoded: ", decoded)
      if (file) {
        console.log(file)
        Upload.http({
          method: 'POST',
          url: 'https://api.imgur.com/3/image',
          headers: {
            Authorization: 'Client-ID' + '0d0e307d39198e0'
          },
          data: encoded
        }).then(function(data) {
          console.log("data: ", data)
        })

        // Upload.upload({
        //   url: 'upload/url',
        //   fields: {'username': 'username'},
        //   file: file
        // }).progress(function (evt) {
        //   var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //   console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        // }).success(function (data, status, headers, config) {
        //   console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
        // }).error(function (data, status, headers, config) {
        //   console.log('error status: ' + status);
        // })
      };
    }
    return {
      upload: upload
    };
  }])
