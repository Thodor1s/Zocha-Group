import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { DB_USER, DB_HOST, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

export const db = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST as string,
    port: parseInt(DB_PORT as string, 10),
    dialect: 'postgres',
    logging: false,
  }
);
