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
