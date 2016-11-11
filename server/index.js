
(function() {

    'use strict';

    var express = require('express');
    var router = express.Router();

    router.use(require('./controllers/login.controller'));


    router.get('/', function(req, res) {
        res.json('Home page<br>Microservice login app for token generation<br> By: Danizavtz');
    });

    module.exports = router;


}());
