var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');
var session = require('express-session');
var sequelize = require('../models/index.js')
var compare = Promise.promisify(bcrypt.compare);
var app = express();

router.post('/signup', function(req, res) {
  var username = req.body.username;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      console.log(err);
      return;
    }
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      sequelize.User.create({
          username: username,
          password: hash
        })
        .then(function(obj) {});
    })
  })
});

router.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var hashedPw;
  var userObj;
  sequelize.User.findAll({
    where: {
      username: username
    }
  }).then(function(obj) {
  	userObj = obj
    hashedPw = obj[0].dataValues.password;
  }).then(function(obj) {
  	console.log("obj", userObj)
    return compare(password, hashedPw)
      .then(function(data) {
        if (data) {
          req.session.user = userObj;
          req.session.save()
        }
        res.send(data);
      })
  })
});

router.get('/logout', function(req, res) {
  delete req.session.user;
})

module.exports = {
  'router': router
};
