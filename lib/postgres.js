let pg = exports; 
const pgLib = require('pg');

pg.initialize = (databaseUrl, cb) => {
  let client = new pgLib.Client(databaseUrl);
  client.connect((err) => {
    if (err) {
      return cb(err);
    }

    pg.client = client;
    cb();
  });
};