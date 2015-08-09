/*
var async = require('async')
var r = require('rethinkdb');
var connection = null;
async.waterfall([
  function(cb){
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        cb(err, conn);
    });
  },
  function(conn, cb){
    connection = conn;
    cb(null)
  },
  function(cb){
    r.db('test').table('authors').filter(r.row('name').eq("William Adama")).
    run(connection, function(err, cursor) {
        if (err) cb(err);
        cursor.toArray(function(err, result) {
            cb(err, result);
        });
    });
  },
  function(result, cb){
    console.log(JSON.stringify(result, null, 2));
    cb(null);
  },
  function(cb){
    connection.close(cb)
  }
], function(){
  console.log("FINISHED")
})
*/

var bcrypt = require('bcrypt-nodejs')
var async = require('async');
var crypto = require('crypto');
var SALT_WORK_FACTOR = 5;

var pass1 = "XXX-999-XXX";
var pass2 = "XXX-999-XXX";
var pass3 = "XXX-999-XXx";

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     console.log(hash);
// });

// bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//   console.log("Salt: ");
//   console.log(salt);
//   bcrypt.hash(pass1, salt, null, function(err, hash) {
//     console.log("First generated hash:")
//     console.log(hash)
//     bcrypt.compare(pass2, hash, function(err, result){
//       console.log("Comparing 1st time:");
//       console.log(result);
//     });
//     bcrypt.compare(pass3, hash, function(err, result){
//       console.log("Comparing 2nd time:");
//       console.log(result);
//     });
//   });
// });

// var hash = "$2a$05$DJ7RIdVZs6XzXm7Z599IZO5ckINTfFkecssAhZnD4Ck.6G4d/9uR6"

// bcrypt.compare(pass2, hash, function(err, result){
//   console.log("Comparing 1st time:");
//   console.log(result);
// });

var async = require('async')
var r = require('rethinkdb');
var connection = null;
async.waterfall([
  function(cb){
    r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
        connection = conn;
        connection.use('slides');
        cb(err);
    });
  },
  // function(cb){
  //   r.table('users').filter(r.row('email').eq("santiago@rmotr.com"))
  //     .run(connection, function(err, cursor) {
  //         if (err) cb(err);
  //         cursor.toArray(function(err, result) {
  //             cb(err, result);
  //         });
  //     });
  // },
  function(cb){
    r.table('users').getAll("santiago@rmotr.com", {index: 'email'}).limit(1).nth(0)
      .run(connection, function(err, user) {
          if (err) return cb(err);
          if(!user){
            console.log("NO user");
            return cb(null);
          }
          bcrypt.compare("123", user.password, function(err, result){
            if(result){
              console.log("Password MATCH!")
            }else{
              console.log("Wrong!")
            }
            cb(null)
          });
      });
  },
  // function(cb){
  //   r.table('users')('email').count('santiago@rmotr.com')
  //     .run(connection, function(err, result) {
  //       if (err) cb(err);
  //       console.log(result);
  //       cb(null)
  //     });
  // },
  // function(result, cb){
  //   console.log(JSON.stringify(result, null, 2));
  //   cb(null);
  // },
  function(cb){
    connection.close(cb)
  }
], function(){
  console.log("FINISHED")
})
