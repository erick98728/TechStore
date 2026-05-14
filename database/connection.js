/**
 * Database Connection Module
 * Gerencia a conexão com o banco de dados MySQL para SETI 2026
 */

const mysql = require('mysql2/promise');

let pool = null;

/**
 * Inicializa o pool de conexões com o banco de dados
 * @returns {Promise<void>}
 */
async function initializePool() {
  if (pool) return;

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'seti_2026',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    console.log('✓ Pool de conexões com banco de dados inicializado');
  } catch (error) {
    console.error('✗ Erro ao inicializar pool de conexões:', error.message);
    throw error;
  }
}

/**
 * Obtém uma conexão do pool
 * @returns {Promise<Connection>}
 */
async function getConnection() {
  if (!pool) {
    await initializePool();
  }
  return pool.getConnection();
}

/**
 * Executa uma query no banco de dados
 * @param {string} query - SQL query
 * @param {Array} params - Parâmetros da query
 * @returns {Promise<Array>}
 */
async function query(query, params = []) {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } finally {
    connection.release();
  }
}

/**
 * Fecha o pool de conexões
 * @returns {Promise<void>}
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✓ Pool de conexões fechado');
  }
}

module.exports = {
  initializePool,
  getConnection,
  query,
  closePool,
};
