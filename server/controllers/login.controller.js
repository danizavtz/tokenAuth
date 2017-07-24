(function() {
  'use strict';

  const express = require('express');
  const router = express.Router();
  const loginService = require('../services/login.service.js');

  router.post('/login', loginService.validateLogin, loginService.lookupLogin, loginService.logEmployee);

  module.exports = router;
}());