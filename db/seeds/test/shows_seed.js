var scrypt = require('scrypt');
var scryptParam = scrypt.paramsSync(0.01);
var senha = scrypt.kdfSync('123', scryptParam);
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('employee').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('employee').insert({id: 1, login: 'admin', password: senha})
      ]);
    });
};
