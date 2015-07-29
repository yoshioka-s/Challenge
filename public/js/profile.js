angular.module('challengeApp.profile', ['ngFileUpload'])
.controller('ProfileController', ['$scope','$location','$state','Upload','ProfileImage',
  function($scope,$location,$state,Upload,ProfileImage){
    $scope.update = ProfileImage.upload;



}])
.factory('ProfileImage', ['Upload', function(Upload){
  var upload = function(file){
    if(file){
      console.log(file)
      Upload.upload({
        url: 'upload/url',
        fields: {'username': 'username'},
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
      }).success(function (data, status, headers, config) {
        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
      }).error(function (data, status, headers, config) {
        console.log('error status: ' + status);
      })
    };
  }
  return {
    upload:upload
  };
}])