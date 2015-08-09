var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
var r = require('rethinkdb');


var getUserByEmail = function(email, callback){
  async.waterfall([
    function(cb){
      r.connect( {host: 'localhost', port: 28015}, function(err, connection) {
        if(err) return cb(err);
        connection.use('slides');
        cb(err, connection);
      });
    },
    function(connection, cb){
      r.table('users').getAll(email, {index: 'email'}).limit(1).nth(0)
        .run(connection, cb);
    }
  ], callback);
};

var getUserById = function(id, callback){
  async.waterfall([
    function(cb){
      r.connect( {host: 'localhost', port: 28015}, function(err, connection) {
        if(err) return cb(err);
        connection.use('slides');
        cb(null, connection);
      });
    },
    function(connection, cb){
      r.table('users').get(id)
        .run(connection, cb);
    }
  ], callback);
};

var validatePassword = function(user, password, callback){
  bcrypt.compare(password, user.password, callback);
};

exports.authStrategy = new LocalStrategy(
  {usernameField: 'email'},
  function(email, password, done) {
    getUserByEmail(email, function(err, user){
      if (err) { return done(err); }
      if(!user){
        return done(null, false);
      }
      validatePassword(user, password, function(err, result){
        if(result) { return done(null, user)};
        return done(null, false);
      });
    });
    // User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
    // async.waterfall([
    //   function(cb){
    //     r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    //         conn.use('slides');
    //         cb(err, conn);
    //     });
    //   }
    // ]);

    //done(null, false);
  }
);

exports.serializeUser = function(user, done) {
  done(null, user.id);
};

exports.deserializeUser = function(id, done) {
  getUserById(id, done);
};
