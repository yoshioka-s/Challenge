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


router.post('/getChallengeUser',requires_login, function(req, res) {
  var challengeId = req.body.challengeId;
  models.UserChallenge.findAll({
    where: {challengeId: challengeId}
  }).then(function(data) { res.json(data) })
})

router.post('/ChallengeImage',requires_login, function(req, res) {
  var image = req.body.image;
  var userId = req.body.userId;
  var challengeId = req.body.challengeId;
  models.UserChallenge.update({image: image}, {
      where: {
        userId: userId,
        challengeId:challengeId
      }}).then(function(user) { res.json(user) })
})





router.post('/userImage',requires_login, function(req, res) {
  var image = req.body.image;
  var userId = req.body.userId;
  models.User.update({image: image}, {where: {id: userId}})
                .then(function(user) { res.json(user) })
})


router.post('/update_username', requires_login, function(req, res) {
  var userId = req.body.userId;
  var newName = req.body.newName;
  models.User.update({username:newName} , {where: {id:userId}})
             .then(function(user){ res.json(user) });
});



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
      username: rawParticipants[i].username,
      coin: rawParticipants[i].coin,
      image: rawParticipants[i].image,
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
router.post('/challenge/user', requires_login, function(req, res) {
  models.User.findOne({where: {id: req.body.userId}})
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
    form.participants = form.participants.filter(function (id) {
      return id !== form.userId;
    });
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

router.post('/challenge/:id/accept', requires_login, function(req, res) {
  var target_id = parseInt(req.params.id);
  console.log('ACCEPT!!!!!!!!');
  console.log(req.body);
  var user_id = req.body.user_id;

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
      console.log('updated: ', userChallenge);

      models.Challenge.findOne({
        where: {
          id: target_id
        }
      })
      .then(function (challenge) {

        // update users.coin
        console.log('found: ', challenge);

        models.User.update({
          coin: Sequelize.literal('coin -' + challenge.get('wager'))
        }, {
          where: {
            id: user_id
          }
        });

        // update challenges.total_wager
        var newData = {
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
            newData.date_completed = Sequelize.literal('CURRENT_TIMESTAMP + ' + challenge.get('time') + ' * "1 second"::interval');
          }

          models.Challenge.update(newData, {
            where: {
              id: target_id
            }
          }).then(function () {
            res.status(201).json({'success': true});
            console.log('SUCCESS');
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
  var userId = req.body.user_id;
  console.log('UPVOTE!! ', userId);
  // var userId = req.session.user[0].id;
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
