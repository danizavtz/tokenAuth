const router = require('express').Router();
const indexController = require('../controllers/index.controller');

router.get('/secure', indexController.secure_route);
router.get('/', indexController.index);
router.get('*', indexController.fallback);

module.exports = router;