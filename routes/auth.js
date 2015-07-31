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
  	userObj = obj;
    hashedPw = obj[0].dataValues.password;
  }).then(function(obj) {
    return compare(password, hashedPw)
      .then(function(data) {
        // data is boolean returned from bcrypt compare
        if (data) {
          req.session.user = userObj;
          req.session.save()
        }
        res.send(data);
      })
  })
});

router.get('/logout', function(req, res) {
  req.session = null;
  res.send('yo delete dat cookie');
})

router.post('/userImage', function(req, res) {
  var base64Img = req.body.image;
  sequelize.User.update({
    image: "IS THIS asdf????"
  }).then(function(obj) {
    console.log("returned obj: ", obj)
  })
  res.send("good")
})

module.exports = {
  'router': router
};
