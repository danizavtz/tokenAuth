(function() {
    var postgres = require('../../lib/postgres');
    var jwt = require('jsonwebtoken');
    var scrypt = require('scrypt');
    var scryptParam = scrypt.paramsSync(0.01);

    exports.logEmployee = function(req, res) {
        //remove dados sensíveis da resposta
        delete req.employee.password;
        delete req.body.password;
        delete req.body.kdfResult;
        var tk = {};
        tk.token = 'Bearer '+jwt.sign(req.employee, "meutokensecreto", { expiresIn: 1800 });//expires in 1800 seconds
        res.status(200).json(tk);
        res.end();
    };

    exports.validateLogin = function(req, res, next) {
        req.validationErrors = [];
        if(req.body.login === undefined) req.validationErrors.push('login é obrigatório no body da requisição');
        if(req.body.password === undefined) req.validationErrors.push('password é obrigatório no body da requisição');

        if (req.validationErrors.length > 0) {
            return res.status(400).json(req.validationErrors);
        }
        //decodificar MD5, SHA1 ou BASE64
        req.body.kdfResult = scrypt.kdfSync(req.body.password.toString(), scryptParam);
        return next();
    };

    exports.lookupLogin = function(req, res, next) {
        var sql = 'SELECT e.employee_id, e.login, e.password FROM employee e WHERE e.login=$1';
        postgres.client.query(sql, [req.body.login], function(err, result) {
            if (err) {
                return res.status(500).json({ errors: ['Não foi possível efetuar login'] });
            }
            if (result.rows.length === 0) {
                return res.status(404).json({ errors: ['Usuário ou senha incorretos'] });
            }

            if (!(scrypt.verifyKdfSync(result.rows[0].password, req.body.password.toString()))) {
                return res.status(404).json({ errors: ['Usuário ou senha incorretos'] });
            }

            req.employee = result.rows[0];
            next();
        });
    };

}());
