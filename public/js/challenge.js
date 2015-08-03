angular.module('challengeApp.challenge', [])
.controller('ChallengeController', function ($scope, ChallengeFactory, $stateParams) {
  $scope.challengeData = {};
  $scope.creator = null;
  $scope.started = false;
  $scope.complete = false;
  $scope.winner = null;
  $scope.canBeStarted = false;
  $scope.isParticipant = false;
  $scope.hasAccepted = false;
  $scope.comments = [];
  $scope.newComment = '';

  $scope.getChallengeInfo = function(id) {
    ChallengeFactory.getChallengeInfo(id).then(function(res) {
      $scope.challengeData = res;

      $scope.creator = res.participants.filter(function(participant) { return participant.id === res.creator; })[0];
      $scope.winner = res.participants.filter(function(participant) { return participant.id === res.winner; })[0] || null;

      $scope.started = res.started;
      $scope.complete = res.complete;
      $scope.canBeStarted = res.participants.reduce(function(num, participant) {
        return (participant.accepted) ? ++num : num;
      }, 0) > 1;

      if ($scope.user !== null) {
        $scope.isParticipant = res.participants.some(function(participant) { return participant.id === $scope.user.id; });
        $scope.hasAccepted = res.participants.some(function(participant) { return participant.id === $scope.user.id && participant.accepted; });
      }
    });
  };
  $scope.getChallengeInfo($stateParams.id);

  $scope.getChallengeComments = function(id) {
    ChallengeFactory.getChallengeComments(id).then(function(res) {
      $scope.comments = res;
    });
  };
  $scope.getChallengeComments($stateParams.id);

  $scope.postChallengeComment = function() {
    ChallengeFactory.postChallengeComment($stateParams.id, $scope.newComment).then(function() {
      $scope.newComment = '';
      $scope.getChallengeComments($stateParams.id);
    });
  };

  $scope.challengeAccept = function() {
    ChallengeFactory.acceptChallenge($scope.challengeData.id).then(function() {
      $scope.getChallengeInfo($stateParams.id);
    });
  };

  $scope.challengeStart = function() {
    ChallengeFactory.challengeStart($scope.challengeData.id).then(function() {
      $scope.getChallengeInfo($stateParams.id);
    });
  };

  $scope.challengeComplete = function(winnerId) {
    ChallengeFactory.challengeComplete($scope.challengeData.id, winnerId).then(function() {
      $scope.getChallengeInfo($stateParams.id);
    });
  };

  $scope.upvoteUser = function (targetUserId) {
    console.log('upvote ', $scope.challengeData.id, targetUserId);
    ChallengeFactory.upvoteUser($scope.challengeData.id, targetUserId).then(function (upvote) {
      $scope.challengeData.participants.forEach(function (participant) {
        if(participant.id === targetUserId){
          participant.upvote = upvote;
        }
      });
    });
  };
}).controller('ChallengeListController', function ($scope, ChallengeFactory) {
  $scope.challenges = [];

  $scope.getChallengeList = function() {
    ChallengeFactory.getChallengeList().then(function(challenges) {
      $scope.challenges = challenges;
    });
  };
  $scope.getChallengeList();

});
