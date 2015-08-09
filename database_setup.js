var r = require('rethinkdb');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');

var connection = null;

var DATABASE_NAME = 'slides';
var HOST = 'localhost';
var PORT = 28015;
var SALT_WORK_FACTOR = 10;


var usersTestData =[
  {
    email: 'santiago@rmotr.com',
    password: '123',
    name: 'Santiago Basulto'
  },
  {
    email: 'martin@rmotr.com',
    password: '123',
    name: 'Martin Zugnoni'
  },
];

function connectionSetup(cb){
  r.connect( {host: HOST, port: PORT}, function(err, conn) {
    if(err) return cb(err);
    connection = conn;
    cb(null);
  });
}

function databaseSetup(callback){
  async.series([
    function(cb){
      r.dbDrop(DATABASE_NAME).run(connection, function(err, result){
        cb(null);
      });
    },
    function(cb){
      r.dbCreate(DATABASE_NAME).run(connection, cb);
    },
    function(){
      var cb = arguments[arguments.length - 1];
      connection.use(DATABASE_NAME);
      cb(null);
    },
  ], callback);
}

function createTables(callback){
  async.parallel([
    function(cb){
      r.tableCreate('users').run(connection, cb);
    },
    function(cb){
      r.tableCreate('decks').run(connection, cb);
    },
    function(cb){
      r.tableCreate('pitches').run(connection, cb);
    },
    // Indexes
    // function(cb){
    //   r.table("users").indexCreate("last_name").run(connection, cb);
    // }
  ], callback);
}

function insertTestData(callback){
  async.waterfall([
    function(cb){
      async.map(usersTestData, function(user, _cb){
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if(err) return _cb(err);
          bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) return _cb(err);
            user.password = hash;
            _cb(null, user);
          });
        });
      }, function(err, users){
        r.table('users').insert(users).run(connection, cb);
      });

    }
  ], callback);
}

async.series([
  connectionSetup,
  databaseSetup,
  createTables,
  insertTestData
], function(err){
  if(err){
    console.log(err);
  }else{
    console.log("Done.");
    connection.close();
  }
})
