( function () {
  'use strict';

  var express = require( 'express' );
  var router = express.Router();
  var loginService = require( '../services/login.service.js' );

  router.post( '/login', loginService.validateLogin, loginService.lookupLogin , loginService.logEmployee);

  module.exports = router;
}() );