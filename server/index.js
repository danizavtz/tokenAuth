    const router = require('express').Router();
    const swaggerUi = require('swagger-ui-express');
    const swaggerDocument = require('../docs/swagger.json');
    var options = {
      customCss: '.swagger-ui .topbar { display: none }'
    };

    router.use('/api-docs', swaggerUi.serve);
    router.get('/api-docs', swaggerUi.setup(swaggerDocument, options));
    router.use(require('./routes/login.route'));
    router.get('/secure', (req, res) => {
        req.sucesso = { msg: 'server up and running secure route'};
        res.status(200).json(req.sucesso);
    });

    router.get('/', (req, res) => {
        res.status(200).json({msg: "server up and running"});
    });
      //após tentar casar todas as rotas a ultima rota que sobrou é not found
    router.get('*', (req, res) => {
        res.status(404).json({ errors: [{location: req.path, msg: 'Not found', param: null}]});
    });

    module.exports = router;