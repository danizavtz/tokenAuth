const router = require('express').Router();
const loginService = require('../controllers/login.controller');
const loginValidator = require('../validators/login.validator');

router.post('/login', loginValidator.validationBodyRules, loginValidator.checkRules, loginService.hashPassword, loginService.lookupLogin, loginService.logEmployee);

module.exports = router;