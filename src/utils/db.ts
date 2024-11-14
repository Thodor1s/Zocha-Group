const { Sequelize } = require('sequelize');

//.env 
const { DB_USER, DB_HOST, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

//Sequelize
export const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
});
