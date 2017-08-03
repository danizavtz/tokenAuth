(function() {
    const postgres = require('../../lib/postgres');
    const jwt = require('jsonwebtoken');
    const scrypt = require('scrypt');
    const scryptParam = scrypt.paramsSync(0.01);

    exports.logEmployee = (req, res) => {
        //remove dados sensíveis da resposta
        delete req.employee.password;
        delete req.body.password;
        delete req.body.kdfResult;
        const tk = {};
        tk.token = 'Bearer '+jwt.sign(req.employee, 'meutokensecreto', { expiresIn: 1800 });//expires in 1800 seconds
        res.status(200).json(tk);
        res.end();
    };

    exports.validateLogin = (req, res, next) => {
        req.checkBody('login', 'login is required').notEmpty();
        req.checkBody('password', 'password is required').notEmpty();
        req.getValidationResult().then((result) => {
            if (!result.isEmpty()) {
                return res.status(400).json({errors: result.array()});       
            }
        //decodificar MD5, SHA1 ou BASE64
        req.body.kdfResult = scrypt.kdfSync(req.body.password.toString(), scryptParam);
        return next();
        });
    };

    exports.lookupLogin = (req, res, next) => {
        const sql = 'SELECT e.employee_id, e.login, e.password FROM employee e WHERE e.login=$1';
        postgres.client.query(sql, [req.body.login], (err, result) => {
            if (err) {
                return res.status(500).json({ errors: ['Could not do login'] });
            }
            if (result.rows.length === 0) {
                return res.status(404).json({ errors: ['User or password does not match'] });
            }

            if (!(scrypt.verifyKdfSync(result.rows[0].password, req.body.password.toString()))) {
                return res.status(404).json({ errors: ['User or password does not match'] });
            }

            req.employee = result.rows[0];
            next();
        });
    };

}());
