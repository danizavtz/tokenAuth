    const router = require('express').Router();

    router.use(require('./routes/login.route'));
    router.use(require('./routes/index.route'));

    module.exports = router;