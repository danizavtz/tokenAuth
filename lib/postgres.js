var pg = exports; 
var pgLib = require('pg');

pg.initialize = function(databaseUrl, cb) {
  var client = new pgLib.Client(databaseUrl);
  client.connect(function(err) {
    if (err) {
      return cb(err);
    }

    pg.client = client;
    cb();
  });
};