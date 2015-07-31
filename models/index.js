var Sequelize = require('sequelize');
var orm = new Sequelize(process.env.DATABASE_URL || 'sqlite://ChallengeDb.sqlite');

orm.authenticate()
  // .then(function() {
  //   console.log('Connection to db successful!');
  //  })
  .catch(function(err) {
    console.log('Connection to db failed: ', err);
  }) 
  .done();

var User = orm.define('users', {
  username: { type: Sequelize.STRING },
  password: { type: Sequelize.STRING },
  image:    { type: Sequelize.TEXT, defaultValue: '/public/img/placeholder.jpg' },
  coin:     { type: Sequelize.INTEGER, defaultValue: 1000 }
});

var Challenge = orm.define('challenges', {
  title:    { type: Sequelize.STRING, allowNull: false },
  message:  { type: Sequelize.STRING, allowNull: false },
  wager:    { type: Sequelize.INTEGER },
  creator:  { type: Sequelize.INTEGER, allowNull: false },
  winner:   { type: Sequelize.INTEGER, defaultValue: 0 },
  complete: { type: Sequelize.BOOLEAN, defaultValue: false },
  started:  { type: Sequelize.STRING, defaultValue: 'Not Started' },
  date_started:   { type: Sequelize.DATE },
  date_completed: { type: Sequelize.DATE },
  total_wager: { type: Sequelize.INTEGER },
  time:     { type: Sequelize.INTEGER, defaultValue: 0 }
});

// Define the join table which joins Users and Challenges
var UserChallenge = orm.define('usersChallenges', {
  accepted: { type: Sequelize.BOOLEAN, defaultValue: false },
  upvote:   { type: Sequelize.INTEGER, defaultValue: 0 }
});

// Setup the many-many relationship through the orm
User.belongsToMany(Challenge, {
  through: UserChallenge
});

Challenge.belongsToMany(User, {
  through: UserChallenge,
  as: 'participants'
});

var Comment = orm.define('comments', {
  text: {
    type: Sequelize.STRING(512)
  }
});

Comment.belongsTo(Challenge);
Comment.belongsTo(User);


// make the database
// delete database file to clear database
orm.sync();

exports.User = User;
exports.Challenge = Challenge;
exports.UserChallenge = UserChallenge;
exports.Comment = Comment;
exports.orm = orm;
