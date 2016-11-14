
exports.up = function(knex, Promise) {
    return knex.schema.createTable('employee', function(table){
    table.increments('id').primary();
    table.string('login');
    table.binary('password');
  });

};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.raw('DROP TABLE employee CASCADE')
        ]);
};
