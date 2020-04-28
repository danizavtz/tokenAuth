require('dotenv').config()
const fs = require('fs');
const postgres = require('../lib/postgres');
const sql = fs.readFileSync(__dirname + '/create.sql').toString();

postgres.query(sql, (err) => {
    if (err) {
        throw err;
    }
    done();
});
