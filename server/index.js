    const router = require('express').Router();

    router.use(require('./controllers/login.controller'));
    router.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
          res.status(401).sendFile(__dirname + '/html/401.html');
        }
        next(err);
      });

    router.get('/', (req, res) => {
        res.status(200).sendFile(__dirname + '/html/default.html');
    });
      //após tentar casar todas as rotas a ultima rota que sobrou é not found
    router.get('*', (req, res) => {
        res.status(404).sendFile(__dirname + '/html/404.html');
    });

    module.exports = router;