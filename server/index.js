
(function() {

    'use strict';

    const express = require('express');
    const router = express.Router();

    router.use(require('./controllers/login.controller'));


    router.get('/', (req, res) => {
        res.status(200).sendFile(__dirname + '/html/default.html');
    });

    module.exports = router;


}());
