import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const urlDB = {host: process.env.HOST, user: process.env.USER, password: process.env.PASSWORD, database: process.env.DATABASE}//process.env.RAILWAY_DATABASE_URL;
const pool = mysql.createPool(urlDB).promise();

export default pool;