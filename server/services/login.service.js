const postgres = require('../../lib/postgres');

exports.lookupLogin = async (usuario) => {
    try {
        const sql = 'SELECT e.employee_id, e.login FROM employee e WHERE e.login=$1 AND e.password = $2';
        const { rows } = await postgres.query(sql, [usuario.login, usuario.kdfResult]);
        return rows;
    } catch (err) {
        throw err;
    }
};