require('dotenv').config()
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const expressJwt = require('express-jwt');

const app = express();
app.use('/secure', expressJwt({ secret: process.env.SECRET, algorithms: ['RS256'] }));
cors({ credentials: true, origin: true });
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') { app.use(logger('dev')); }

app.use(require('./server/index'));

module.exports = app;