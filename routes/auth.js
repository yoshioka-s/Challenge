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
  console.log('got in with test', req.body);
  var username = req.body.username;
  // if username already exists in db, send ('username already exists')
  var exists;
  sequelize.User.findOne({
    where: {
      username: username
    }
  }).then(function(user) {
    exists = user;
  }).then(function() {
    if(exists === null) {
      return bcrypt.genSalt(10, function(err, salt) {
        if (err) {
          console.log(err);
          return;
        }
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          sequelize.User.create({
              username: username,
              password: hash
            }).then(function(obj) {
              res.send('done');
            })
        })
      })
    } else {
      res.send('username already exists');
    }
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
  	userObj = obj;
    hashedPw = obj[0].dataValues.password;
console.log('found!!');
  }).then(function(obj) {
    return compare(password, hashedPw)
      .then(function(data) {
        // data is boolean returned from bcrypt compare
console.log('matching!!');
        if (data) {
          req.session.user = userObj;
          req.session.save()
        }
console.log('data', data);
        res.send(data);
      })
  })
});

router.get('/logout', function(req, res) {
  req.session = null;
  res.send('yo delete dat cookie');
})


module.exports = {
  'router': router
};
