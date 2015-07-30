var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var session = require('express-session');
var compare = Promise.promisify(bcrypt.compare);
// var cookieParser = require('cookie-parser');

var app = express();
// require crypto?

//TODO link with db
var tempAuthInfo = {};

// app.use(express.cookieParser());
// app.use(express.session({secret: "This is a secret"}));
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
  return compare(password, hashed)
  .then(function(data) {
  	if(data) {
  	  req.session.user = username;
  	  req.session.save()
  	}
  	res.send(data);
  })
});

router.get('/logout', function(req, res) {
  delete req.session.user;
})

module.exports = {
  'router': router
};
