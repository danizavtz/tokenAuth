    const router = require('express').Router();

    router.use(require('./controllers/login.controller'));


    router.get('/', (req, res) => {
        res.status(200).sendFile(__dirname + '/html/default.html');
    });

    module.exports = router;