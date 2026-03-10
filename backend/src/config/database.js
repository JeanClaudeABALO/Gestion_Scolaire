const mysql = require('mysql2/promise');
require('dotenv').config();

const useSSL = process.env.DB_SSL === 'true';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestion_scolaire',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


if (useSSL) {
  poolConfig.ssl = { rejectUnauthorized: false };
}
const pool = mysql.createPool(poolConfig);

// Test de connexion
pool.getConnection()
  .then(connection => {
    console.log('Connexion à la base de données MySQL réussie');
    connection.release();
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:', err.message);
  });

module.exports = pool;
