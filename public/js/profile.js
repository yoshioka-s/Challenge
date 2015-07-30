angular.module('challengeApp.profile', ['ngFileUpload', 'base64', 'ngImgur'])
.controller('ProfileController', ['$scope', '$location', '$state', '$base64', 'Upload', 'ProfileImage', 
  function($scope, $location, $state, $base64, Upload, ProfileImage){
    $scope.update = ProfileImage.upload;
}])
.factory('ProfileImage', ['$base64', 'Upload', 'imgur', function($base64, Upload, imgur){
  var upload = function(file){
    // console.log("is running")
    var encoded = $base64.encode(file);
    var decoded = $base64.decode(encoded);
    console.log("encoded: ", encoded);
    console.log("decoded: ", decoded)
    if(file){
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
    upload:upload
  };
}])