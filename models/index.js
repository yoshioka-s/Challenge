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
  image:    { type: Sequelize.STRING, defaultValue: '/public/img/placeholder.jpg' },
  coin:     { type: Sequelize.INTEGER, defaultValue: 1000 }
});

var Challenge = orm.define('challenges', {
  title:    { type: Sequelize.STRING, allowNull: false },
  message:  { type: Sequelize.STRING, allowNull: false },
  started:  { type: Sequelize.STRING, defaultValue: 'Not Started' },
  wager:    { type: Sequelize.INTEGER, defaultValue: 100},
  winner:   { type: Sequelize.INTEGER, allowNull: true },
  time:     { type: Sequelize.INTEGER, defaultValue: 300 },
  date_started:   { type: Sequelize.DATE,allowNull: false },
  date_completed: { type: Sequelize.DATE,allowNull: true},
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

var Upvote = orm.define('upvote', {
  vote: { type: Sequelize.INTEGER, defaultValue: 0 }
});
Upvote.belongsTo(Challenge);
Upvote.belongsTo(User);

// make the database
// delete database file to clear database
orm.sync();

exports.User = User;
exports.Challenge = Challenge;
exports.UserChallenge = UserChallenge;
exports.Comment = Comment;
exports.Upvote = Upvote;
exports.orm = orm;
