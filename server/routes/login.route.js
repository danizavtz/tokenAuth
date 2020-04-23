  const router = require('express').Router();
  const loginService = require('../controllers/login.controller');

  router.post('/login', loginService.validateLogin, loginService.lookupLogin, loginService.logEmployee);

  module.exports = router;