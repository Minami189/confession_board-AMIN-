import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const urlDB = process.env.RAILWAY_DATABASE_URL;
const pool = mysql.createPool(urlDB).promise();

export default pool;