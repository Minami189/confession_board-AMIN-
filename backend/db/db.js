import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const urlDB = `mysql://${{MYSQLUSER}}:${{MYSQL_ROOT_PASSWORD}}@${{RAILWAY_PRIVATE_DOMAIN}}:3306/${{MYSQL_DATABASE}}`;
const pool = mysql.createPool(urlDB).promise();


export default pool;