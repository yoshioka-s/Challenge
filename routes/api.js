var express = require('express');
var router = express.Router();
var models = require('../models/index.js');
var Sequelize = require('sequelize');

/**
 * Check if user is logged in and return an error otherwise
 */
var requires_login = function(req, res, next) {
  // if (!req.isAuthenticated()) {
  //     res.status(401).json({'error': 'ENOTAUTH', 'message':'Endpoint requires login.'});
  //   } else {
  //     next();
  //   }

  // Disabled for now
  next();
};

/**
 * Endpoint to get information about logged in user
 *
 * Requires login
 */




  router.post('/user_challenge', requires_login, function(req, res) {
  var userId = req.body.id;
  var challengeId = []
  models.UserChallenge.findAll({
    where:{
      userId:userId
    }
  }).then(function(challenge){
    for(var i = 0; i<challenge.length;i++){
      challengeId.push(challenge[i].dataValues.challengeId);// 1 2 3 10
    }
    res.json(challenge);
  })
});


router.post('/login_user_info', requires_login, function(req, res) {
  var username = req.body.username;
  models.User.findOne({
    where:{
      username:username
    }
  }).then(function(user){
    res.json(user);
  });
});

router.post('/update_username', requires_login, function(req, res) {
  var userId = req.body.userId;
  var newName = req.body.newName;
  models.User.update({username:newName} , {where: {id:userId}})
             .then(function(user){ res.json(user) });
});



/**
 * Endpoint to get a list of all users
 */
router.get('/allUsers', function(req, res) {
  models.User.findAll()
    .then(function(users) {
      var data = [];
      for(var i = 0; i < users.length; i++) {
        data.push({
          id: users[i].get('id'),
          username: users[i].get('username'),
          profile_image: users[i].get('image'),
          coin: users[i].get('coin')
        });
      }
      console.log(data);
      res.json(data);
    })
    .catch(function(err) {
      throw new Error('Failed to GET at /allUsers route: ', err);
    });
});


/**
 * helper function to get challenge obj from challenge model and participants obj
 */
var makeChallengeObj = function (challengeModel, rawParticipants) {
  var participants = [];

  for(var i = 0; i < rawParticipants.length; i++) {
    participants.push({
      id: rawParticipants[i].id,
      first_name: rawParticipants[i].first_name,
      last_name: rawParticipants[i].last_name,
      profile_image: rawParticipants[i].profile_image,
      accepted: rawParticipants[i].usersChallenges.accepted,
      upvote: rawParticipants[i].usersChallenges.upvote
    });
  }

  return {
    id: challengeModel.get('id'),
    title: challengeModel.get('title'),
    message: challengeModel.get('message'),
    wager: challengeModel.get('wager'),
    creator: challengeModel.get('creator'),
    winner: challengeModel.get('winner'),
    complete: challengeModel.get('complete'),
    started: challengeModel.get('started'),
    date_created: challengeModel.get('createdAt'),
    date_completed: challengeModel.get('date_completed'),
    date_started: challengeModel.get('date_started'),
    participants: participants
  };
};




/**
 * Endpoint to get a list of challenges associated with currently logged in user
 *
 * Requires login
 */
router.get('/challenge/user', requires_login, function(req, res) {
  models.User.findOne({where: {id: req.session.user[0].id}})
  .then(function(user) {
    user.getChallenges({
        include: [{
          model: models.User,
          as: 'participants'
        }]
     })
    .then(function(challenges) {
      var data = [];  // Didn't want to use 'response' since that might be confused with http res
      for(var i = 0; i < challenges.length; i++) {
        var rawParticipants = challenges[i].get('participants', {plain: true});
        var challengeObj = makeChallengeObj(challenges[i], rawParticipants);
        data.push(challengeObj);
      }
      res.json(data);
    });
  });
});


/**
 * Endpoint to get a list of public challenges
 */
router.get('/challenge/public', function(req, res) {
  models.Challenge.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']], // must pass an array of tuples
      include: [{
        model: models.User,
        as: 'participants'
      }]
    })
    .then(function(challenges) {

      var data = [];
      for(var i = 0; i < challenges.length; i++) {
        var rawParticipants = challenges[i].get('participants', {plain: true});

        var challengeObj = makeChallengeObj(challenges[i], rawParticipants);

        data.push(challengeObj);
      }

      res.json(data);
    })
    .catch(function(err) {
      throw new Error('Failed to GET at /challenge/public route: ', err);
    });
});


/**
 * Endpoint to get single challenge specified by id
 */
router.get('/challenge/:id', function(req, res) {
  console.log('GET A CHALLENGE');
  var target_id = parseInt(req.params.id);
  // var data = req.db.Challenge.findById(req.params.id);

  models.Challenge.findOne({
      where: {id: target_id},
      include: [{
        model: models.User,
        as: 'participants'
      }]
    })
    .then(function(challenge) {
      var rawParticipants = challenge.get('participants', {plain: true});

      var challengeObj = makeChallengeObj(challenge, rawParticipants);

      res.json(challengeObj);
    });
});


/**
 * Check if the submitted form has all required fields
 */
var challenge_form_is_valid = function(form) {
  var valid = true;
  var required_fields = ['title', 'message'];
  var min_text_length = 3;

  required_fields.forEach(function(field) {
    console.log(form[field]);
    if (form[field] === '' || form[field].length < min_text_length) {
      valid = false;
    }
  });

  return valid;
};


/**
 * Endpoint to post a new challenge
 *
 * Requires login
 */
router.post('/create_challenge', requires_login, function(req, res) {
  var form = req.body.challengeInfo;

  console.log(req.body.challengeInfo);

  // validate form
  if (!challenge_form_is_valid(form)) {
    res.status(400).json({'error': 'EINVALID', 'message': 'Submitted form is invalid.'});
    return;
  }

  models.Challenge.create({
    title: form.title,
    message: form.message,
    wager: form.wager,
    date_started: Date.now(),
    time: form.time
  })
  .then(function(challenge) {
    // insert into usersChallenges
    challenge.addParticipants(form.participants); // form.participants should be an array
    challenge.addParticipant([form.userId], {accepted: true}); // links creator of challenge

    // take the wager from creater
    models.User.update({
      coin: Sequelize.literal('coin -' + form.wager)
    }, { where: { id: form.userId }})
    .then(function () {
      res.status(200).json({
        challenge: challenge
      });
    });
  });
});


/**
 * Endpoint to set a challenge to started
 * Requires login
 */
router.put('/challenge/:id/started', requires_login, function(req, res) {
  var target_id = parseInt(req.params.id);
  var user_id = req.session.user[0].id;

  models.Challenge.update({
    started: true,
    date_started: Date.now()
  }, {
    where: {
      id: target_id,
      creator: user_id,
      started: false,
      complete: false
    }
  })
  .then(function(numChallenges) { // Returns an array with element '0' being number of
    if(numChallenges[0] > 0) {    // rows affected (should not be greater than 1 in our case)
      models.Challenge.findOne({
        where: {
          id: target_id,
          started: true
        }
      })
      .then(function(/*challenge*/) { // May want to do something with newly started challenge
          res.status(201).json({'success': true});
      });
    } else {
      res.status(400).json({'error': 'error at /challenge/:id/started',
        'message': 'Could not update challenge to "started" or could not find challenge'});
    }
  })
  .catch(function(error) {
    if(error) {
      res.status(400).json({'error': error,
        'message': 'database update failed at /challenge/:id/started'});
    }
  });
});


/**
 * Endpoint to set a winner and complete challenge
 *
 * Requires login
 */
router.put('/challenge/:id/complete', requires_login, function(req, res) {
  var target_id = parseInt(req.params.id);
  var winner;
  if(req.body.winner === undefined) {
    winner = null;
  } else {
    winner = parseInt(req.body.winner);
  }

  models.Challenge.update({
    winner: winner,
    complete: true
  }, {
    where: {
      id: target_id,
      creator: req.user.id,
      started: true,
      complete: false
    }
  })
  .then(function(numChallenges) {
    if(numChallenges[0] > 0) {
      models.Challenge.findOne({
        where: {id: target_id},
        complete: true
      })
      .then(function(/*challenge*/) {  // May want to do something with newly created challenge
          res.status(201).json({'success': true});
      });
    } else {
      res.status(400).json({
        'error': 'error at /challenge/:id/complete',
        'message': 'could not update challenge to complete or could not find challenge'
      });
    }
  })
  .catch(function(error) {
    res.status(400).json({'error': error,
      'message': 'Database update failed at /challenge/:id/complete'
    });
  });
});

router.put('/challenge/:id/accept', requires_login, function(req, res) {
  var target_id = parseInt(req.params.id);
  var user_id = req.session.user[0].id;

  // update UsersChallenges.accepted to true
  models.UserChallenge.update({
    accepted: true
  }, {
    where: {
      challengeId: target_id,
      userId: user_id,
      accepted: false
    }
  }).then(function() {
    models.UserChallenge.findOne({
      where: {
        challengeId: target_id,
        userId: user_id
      }
    })
    .then(function(userChallenge) {
      if (!userChallenge.get('accepted')) {
        res.status(200).json({'success': false});
      }

      models.Challenge.findOne({
        where: {
          id: target_id
        }
      })
      .then(function (challenge) {

        // update users.coin
        models.User.update({
          coin: Sequelize.literal('coin -' + challenge.get('wager'))
        }, {
          where: {
            id: user_id
          }
        });

        // update challenges.total_wager
        var newData = {
          total_wager: Sequelize.literal('total_wager +' + challenge.get('wager'))
        };

        // check if this is there is unparticipate users
        models.UserChallenge.count({
          where: {
            challengeId: target_id,
            accepted: false
          }
        }).then(function (count) {

          if (!count) {
            // if there is no more participants to accept, start the challenge!
            console.log('START THE CHALLENGE!');
            newData.started = 'Started';
            newData.date_started = Sequelize.literal('CURRENT_TIMESTAMP');
            newData.date_completed = Sequelize.literal('datetime("now", "+' + challenge.get('time') + ' Seconds")');
          }

          models.Challenge.update(newData, {
            where: {
              id: target_id
            }
          }).then(function () {
            res.status(201).json({'success': true});
          });
        });
      });
    });
  });
});


router.get('/challenge/:id/comments', function(req, res) {
  var target_id = parseInt(req.params.id);

  var query = {
    'where': {
      'challengeId': target_id
    },
    'include': [{
      'model': models.User
    }]
  };

  models.Comment.findAll(query).then(function(comments) {
    var data = [];

    comments.forEach(function(comment) {
      data.push({
        'text': comment.text,
        'date_created': comment.createdAt,
        'user': {
          'id': comment.user.id,
          'username': comment.user.username,
          'profile_image': comment.user.profile_image
        }
      });
    });

    res.json(data);
  });
});

router.post('/challenge/:id/comments', requires_login, function(req, res) {
  var target_id = parseInt(req.params.id);

  if (req.body.text === undefined || req.body.text.length < 3) {
    res.status(400).json({'error': 'EINVALID', 'message': 'Submitted form is invalid.'});
    return;
  }

  models.Comment.create({
    'userId': req.user.id,
    'challengeId': target_id,
    'text': req.body.text
  }).then(function() {
    res.json({'success': true});
  });
});

router.post('/challenge/:id/upvote', requires_login, function(req, res) {
  var challengeId = parseInt(req.params.id);
  var targetId = req.body.targetUserId;
  var userId = req.session.user[0].id;
  models.Upvote.findOne({
    where: {
      userId: userId,
      challengeId: challengeId}
  }).then(function (upvote) {
    if (upvote) {
      models.Upvote.update({
        vote: targetId
      }, {
        where: {
          id: upvote.get('id')
        }
      }
      ).then(function () {
        // update userschallenge
        // substract and add
        updateUserChallengeUpvote(challengeId, upvote.get('vote'), -1);
        updateUserChallengeUpvote(challengeId, targetId, 1)
        .then(function (vote) {
          // TODO return all userschallenge records of the challenge
          res.status(200).json();
        });
      });
    } else {
      models.Upvote.create({
        userId: userId,
        challengeId: challengeId,
        vote: targetId
      }).then(function () {
        // update userschallenge
        // add 1
        updateUserChallengeUpvote(challengeId, targetId, 1)
        .then(function () {
          // TODO return all userschallenge records of the challenge
          res.status(200).json();
        });
      });
    }
  });
});

function updateUserChallengeUpvote(challengeId, userId, number) {
  var numString = number < 0 ? '' + number : '+' + number;
  return models.UserChallenge.update({
    upvote: Sequelize.literal('upvote ' + numString)
  }, {
    where: {
      challengeId: challengeId,
      userId: userId
    }
  });
}



module.exports = {
  'router': router,
  'challenge_form_is_valid': challenge_form_is_valid
};
