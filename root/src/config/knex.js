const knex = require('knex');
const { knexConfig } = require('./database');

const db = knex(knexConfig);

module.exports = db;
