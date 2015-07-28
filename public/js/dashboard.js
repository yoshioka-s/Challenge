angular.module('challengeApp.dashboard', [])
.controller('dashboardController', ['$scope','$location','$state',
  function($scope,$location,$state){

    $state.transitionTo('dashboard.list');

}])