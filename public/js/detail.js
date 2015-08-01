angular.module('challengeApp.detail', [])
.controller('DetailController', ['$scope','$location','$state','$stateParams', 'ChallengeFactory','UserFactory',
  function($scope,$location,$state,$stateParams,ChallengeFactory,UserFactory){

    $scope.challenge = $stateParams.itemId;
    $scope.userChallenges = [];
    $scope.getChallengeInfo = function(id,callback) {
      ChallengeFactory.getChallengeInfo(id).then(function(res) {
        $scope.challengeData = res;
        $scope.winner = res.participants.filter(function(participant) { return participant.id === res.winner; })[0] || null;
        $scope.started = res.started;
        $scope.canUpvote = $scope.started === 'Started';
        $scope.complete = res.complete;
        $scope.isParticipant = res.participants.some(function(participant) { return participant.id === $scope.loginUser.id; });
        $scope.hasAccepted = res.participants.some(function(participant) { return participant.id === $scope.loginUser.id && participant.accepted; });
        callback(res.participants);

      });
    };

    $scope.getChallengeInfo($stateParams.itemId,function(players){
        ChallengeFactory.getChallengeUser($stateParams.itemId,function(data){
        $scope.userChallenges = data.data;

        for(var i=0;i<$scope.userChallenges.length;i++){
          for(var j=0;j<players.length;j++){
            if(players[j].id === $scope.userChallenges[i].userId){
              $scope.userChallenges[i].player = players[j];
              if($scope.userChallenges[i].userId === $scope.loginUser.id){
                $scope.userIsplaying = true
              }
              // $scope.accept = $scope.userChallenges[i]
            }
          }
        }
        console.log($scope.userChallenges)

      });
    });

    $scope.uploadimage = function(myPic,userId,challengeid){
      UserFactory.uploadChallengeImage(myPic.base64,userId,challengeid)
      $state.reload();
    }

    $scope.acceptFunc = function(accept){
      if(accept){
        return 'red'
      }else{
        return 'green'
      }
    }



  $scope.vote = function(player){
    if ($scope.loginUser.id === player.id) {
      return;
    }
    console.log('VOTE');
    ChallengeFactory.upvoteUser($scope.challenge, player.id, $scope.loginUser.id)
    .then(function () {
      $state.reload();
    });
  };

  $scope.accept = function () {
    console.log('accept clicked!');
    ChallengeFactory.acceptChallenge($scope.challenge, $scope.loginUser.id)
    .then(function () {
      $state.reload();
    });
    $scope.hasAccepted = true;
  };

}]);
