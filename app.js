var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressJwt = require('express-jwt');

var config = require('./config/env.config.json')[process.env.NODE_ENV || 'development'];

var app = express();
app.disable('x-powered-by');
app.config = config;
app.use('/ingefood/secure', expressJwt({ secret: "ingefood-api" }));
cors({ credentials: true, origin: true });
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.locals.title = "Login App";
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

app.use('/', require('./server/index'));

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(403).send('<html><head><style>body {font-family: Helvetica, Arial, Sans-Serif;margin-top: 5em;}h1 {font-size: 3em;}h2 {font-size: 2em}</style></head></body><center><h1>Acesso Negado (Forbidden)</h1><h2>(╯°□°）╯︵ ┻━┻</h2><br>Não foi encontrado o token de autenticação necessário para interagir com a aplicação.<br>Execute o login para poder usar o aplicativo normalmente<br><h2>Erro: 401</h2></center></body></html>');
    }
    next(err);
});
//após tentar casar todas as rotas a ultima rota que sobrou é not found
app.get('*', function(req, res) {
    res.status(404).send('<html><head><style>body {font-family: Helvetica, Arial, Sans-Serif;margin-top: 5em;}h1 {font-size: 3em;}h2 {font-size: 2em}</style></head></body><center><h1>Página não encontrada (Not Found)</h1><h2>(╯°□°）╯︵ ┻━┻</h2><br>O endereço solicitado não foi encontrado nesse servidor.<br>Verifique o url e tente novamente<br><h2>Erro: 404</h2></center></body></html>');
});

module.exports = app;
