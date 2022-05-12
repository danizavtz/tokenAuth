const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const loginService = require('../services/login.service');

exports.hashPassword = (req, res, next) => {
    crypto.scrypt(req.body.password.toString(), 'salt', 256, (err, derivedKey) => {
        if (err) {
            return res.status(500).json({ errors: [{ location: req.path, msg: 'Could not do login', param: req.params.id }] });
        }
        req.body.kdfResult = derivedKey.toString('hex');
        next();
    });
};

exports.lookupLogin = async (req, res, next) => {
    try {
        const result = await loginService.lookupLogin(req.body);
        if (result.length === 0) {
            res.status(404).json({ errors: [{ location: req.path, msg: 'User or password does not match', param: req.params.id }] });
            return;
        }
        req.employee = result[0];
        next();
    } catch (err) {
        res.status(500).json({ errors: [{ location: req.path, msg: 'Could not do login', param: null }] });
    }
};

exports.logEmployee = (req, res) => {
    res.status(200).json({ token: 'Bearer ' + jwt.sign(req.employee, process.env.SECRET, { expiresIn: 1800 }) });//expires in 1800 seconds
    res.end();
};
