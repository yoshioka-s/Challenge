var express = require('express');
var router = express.Router();
var crontab = require('node-crontab');
var Sequelize = require('sequelize');
var models = require('../models/index.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('public/index.html', {'root':__dirname + '/../'});
});

module.exports = router;

/* Back ground job to update winners. */

crontab.scheduleJob('*/1 * * * *', updateWinner);

function updateWinner() {
  console.log('updateWinner!', Date.now());
  models.Challenge.findAll({
    order: [['createdAt', 'DESC']], // must pass an array of tuples
    where: {
      winner: null,
      date_completed: {
        $lt: Sequelize.literal('CURRENT_TIMESTAMP') // I have no idea why Sequelize.NOW() doew not work...
      }
    },
    include: [{
      model: models.User,
      as: 'participants'
    }]
  }).then(function (challenges) {
    console.log('GOT IT!', challenges);
    // set winner to each challenges
    challenges.forEach(setWinner);
  });
}

function setWinner(challenge) {
  var started = 'Completed';
  var newWinner = 0;
  var tie = false;
  var max = 0;

  // compare each users upvote to decide the winner
  challenge.get('participants').forEach(function (participant) {
    if (max === participant.usersChallenges.upvote){
      newWinner = 0;
      tie = true;
    }
    if (max < participant.usersChallenges.upvote){
      newWinner = participant.id;
      max = participant.upvote;
      tie = false;
    }
  });

  if (tie) {
    started = 'Tie';
    newWinner = -1;
  }
  // update the winner of the challenge
  models.Challenge.update({
    winner: newWinner,
    started: started,
    completed: true
  }, {
    where: {
      id: challenge.get('id')
    }
  });

  if (tie) {
    challenge.get('participants').forEach(function (participant) {
      giveCoin(participant.get('id'), challenge.get('wager'));
    });
    return;
  }
  // update the coin fo the winner
  giveCoin(newWinner, challenge.get('wager') * challenge.get('participants').length);
}

function giveCoin(user_id, coin) {
  models.User.update({
    coin: Sequelize.literal('coin +' + coin)
  }, {
    where: {
      id: user_id
    }
  });
}
