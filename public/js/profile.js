angular.module('challengeApp.profile', ['ngFileUpload'])
.controller('ProfileController', ['$scope','$location','$state','Upload','ProfileFactory',
  function($scope,$location,$state,Upload,ProfileFactory){
    $scope.update = ProfileFactory.upload;
}])
.factory('ProfileFactory', ['Upload','UserFactory', function(Upload,UserFactory){
  var upload = function(userId,file,newname){
    if(newname){
      UserFactory.updateUsername(userId,newname,function(data){
        // $scope.loginUser.username = data.data.username;
      })
    }
    if(file){
      console.log(file)
      Upload.upload({
        url: 'upload/url',
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
      }).success(function (data, status, headers, config) {
        console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
      }).error(function (data, status, headers, config) {
        console.log('error status: ' + status);
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
