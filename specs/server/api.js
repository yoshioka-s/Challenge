var expect = require('chai').expect;
var request = require('request');
var http = require('http');
var assert = require('assert');

process.env.DATABASE_URL = 'sqlite://test.sqlite';
process.env.TESTING = true;

var app = require('../../server');
var models = require('../../models/index');

var api_request = request.defaults({
  'jar': true,
  'baseUrl': 'http://localhost:3030' 
});

describe('API Integration:', function() {
  before(function(done) {
    var server = http.createServer(app);
    app.set('port', 3030);
    server.listen(3030);
    server.on('listening', function() {
      console.log('listening!');
      done();
    })
    server.on('error', function(error) {
      console.error(error);
    })
  });

  describe('challenge functions', function() {
    before(function(done) {
      return models.User.bulkCreate([{
        username:'suz',
        coin: 400
      }]).then(function() {
        return models.Challenge.create({
          title: 'eat chocolate',
          message: 'have 2 squares a day',
          wager: 200,
          creator: 'suz',
          winner: 'shu',
          complete: true,
          started: 'started',
          total_wager: 400,
          date_started: '5/11/1995'
        }).then(function() {
        done();
        })
      })
    })

    after(function(done) {
      models.orm.sync({force: true})
        .then(function() {
          done();
        })
    })

    it('should retrieve values from users table', function(done) {
      var uri = 'http://localhost:3030/api/1/allUsers';
      request({'uri': uri, 'json': true}, function(err, res, body) {
        expect(body).to.be.an('array');
        expect(body[0].username).to.be.eql('suz');
        expect(body[0]).to.contain.all.keys([
          'username', 'coin', 'id', 'profile_image'
        ])
        done();
      })
    }); 


    it('should find created challenges', function(done) {
      var uri = 'http://localhost:3030/api/1/challenge/public';
      request({'uri':uri, 'json': true}, function(err, res, body) {
        expect(body).to.be.an('array');
        expect(body[0]).to.be.an('object');
        expect(body[0].title).to.be.eql('eat chocolate');
        expect(body[0].wager).to.be.eql(200);
        done();
      })
    });

    it('should correctly send post request to get login user info', function(done) {
      var uri = 'http://localhost:3030/api/1/login_user_info';
      var res;
      request({
        uri: uri, 
        json: true, 
        method: 'POST',
        body: {username: 'suz'}
      }, function(err, res, body) {
        expect(body).to.be.an('object');
        expect(body).to.contain.all.keys([
          'username', 'password', 'image', 'coin'
        ])
        expect(body.coin).to.be.eql(400);
        done();
      })
    })
  })

  describe('auth routes', function() {
    before(function(done) {
      return models.User.bulkCreate([{
        username:'suz',
        coin: 400
      }]).then(function() {
        done();
      })
    })

    after(function(done) {
      models.orm.sync({force: true})
        .then(function() {
          done();
        })
    })

    it('should not allow signup if username already exists', function(done) {
      var uri = 'http://localhost:3030/auth/signup';
      request({
        uri: uri,
        json: true,
        method: 'POST',
        body: {username: 'suz'}
      }, function(err, res, body) {
        expect(body).to.be.eql('username already exists');
        done();
      })
    })

    it('should allow signups', function(done) {
      var uri = 'http://localhost:3030/auth/signup';
      request({
        uri: uri,
        json: true,
        method: 'POST',
        body: {username: 'david'}
      }, function(err, res, body) {
        expect(body).to.be.eql('done');
        done();
      })
    })
  })
});