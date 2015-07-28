var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');
// require crypto?

var tempAuthInfo = {};

// routing to auth
router.post('/signup', function(req, res) {
	var username = req.body.username;
	tempAuthInfo[username] = {};
	bcrypt.genSalt(10, function(err, salt) {
	  if(err) {
	  	console.log(err);
	  	return;
	  }
	  bcrypt.hash(req.body.password, salt, function(err, hash) {
	    tempAuthInfo[username].password = hash;
	  })
	  
	})
    res.send("good");
});

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var hashed = tempAuthInfo[username].password;
  bcrypt.compare(password, hashed, function(err, res) {
  	console.log("Logged in: ", res)
  })
  res.send("loggedin")
})

// router.get('/logout', function(req, res) {
//   req.logout();
//   if (req.xhr) {
//     res.json({'success': true});
//   } else {
//     res.redirect('/');
//   }
// });

// router.get('/login', function(req, res, next) {
//   if (process.env.TESTING) {
//     req.login({id:1}, function() {
//       res.send();
//     });
//     return;
//   }
//   next();
// }, passport.authenticate('facebook', {'scope': ['email', 'user_friends']}));

// router.get('/facebook/callback', passport.authenticate('facebook'), function(req, res) {
//   var query = {
//     'include': {
//       'model': models.User,
//       'as': 'participants',
//       'where': {
//         'id': req.user.id
//       }
//     }
//   };

//   models.Challenge.count(query).then(function(count) {
//     if (count > 0) {
//       res.redirect('/#/user');
//     } else {
//       res.redirect('/#/challenges');
//     }
//   });
// });

module.exports = {
  'router': router
};
