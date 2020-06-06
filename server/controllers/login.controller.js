const postgres = require('../../lib/postgres');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.logEmployee = (req, res) => {
    const tk = {};
    tk.token = 'Bearer ' + jwt.sign(req.employee, process.env.SECRET, { expiresIn: 1800 });//expires in 1800 seconds
    res.status(200).json(tk);
    res.end();
};

exports.hashPassword = (req, res, next) => {
    //decodificar MD5, SHA1 ou BASE64
    crypto.scrypt(req.body.password.toString(), 'salt', 256, (err, derivedKey) => {
        if (err) {
            return res.status(500).json({ errors: [{location: req.path, msg: 'Could not do login', param: req.params.id}]});
        }
        req.body.kdfResult = derivedKey;
        return next();
    });
};

exports.lookupLogin = (req, res, next) => {
    const sql = 'SELECT e.employee_id, e.login FROM employee e WHERE e.login=$1 AND e.password = $2';
    postgres.query(sql, [req.body.login, req.body.kdfResult], (err, result) => {
        if (err) {
            return res.status(500).json({ errors: [{location: req.path, msg: 'Could not do login', param: req.params.id}]});
        }
        if (result.rows.length === 0) {
            return res.status(404).json({ errors: [{location: req.path, msg: 'User or password does not match', param: req.params.id}] });
        }

        req.employee = result.rows[0];
        next();
    });
};