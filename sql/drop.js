const { Client } = require('pg');
const fs = require('fs');
const sql = fs.readFileSync(__dirname + '/drop.sql').toString();

const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
});

pgclient.connect();

pgclient.query(sql, (err) => {
    if (err) {
        throw err;
    }
});
