const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressJwt = require('express-jwt');
const expressValidator = require('express-validator');

const config = require('./config/env.config.json')[process.env.NODE_ENV || 'development'];

const app = express();
app.disable('x-powered-by');
app.config = config;
app.use('/secure', expressJwt({ secret: "$token-secret#" }));
cors({ credentials: true, origin: true });
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

app.locals.title = "Login App";
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use('/', require('./server/index'));

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).sendFile(__dirname + '/server/html/401.html');
  }
  next(err);
});
//após tentar casar todas as rotas a ultima rota que sobrou é not found
app.get('*', (req, res) => {
  res.status(404).sendFile(__dirname + '/server/html/404.html');
});

module.exports = app;