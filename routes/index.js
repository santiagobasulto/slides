var express = require('express');
var router = express.Router();
var async = require('async');
var r = require('rethinkdb');


/* GET home page. */
router.get('/', function(req, res, next) {
  //return res.render('index', { title: 'Express'});

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
      r.db('test').table('authors').
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
  ], function(err, res){
    if (err) return next(err);
    res.render('index', { title: 'ExpressITO' });
  });

});

module.exports = router;
