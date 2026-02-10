/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_logs', function(table) {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('action', 25).notNullable();
    table.binary('ip_address', 16).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index('created_at');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_logs');
};
