require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');

const app = express();
app.use('/secure', jwt({ secret: process.env.SECRET, algorithms: ['HS256'] }));
cors({ credentials: true, origin: true });
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') { app.use(logger('dev')); }

app.use(require('./server/index'));

module.exports = app;