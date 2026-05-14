const bcrypt = require('bcrypt');
const { getConnection } = require('./database/connection');

/**
 * Hash de senha com bcrypt
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} - Hash da senha
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * Verifica se a senha corresponde ao hash
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash armazenado no banco
 * @returns {Promise<boolean>} - True se corresponde
 */
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Registra um novo usuário
 * @param {string} nome - Nome do usuário
 * @param {string} email - Email único
 * @param {string} password - Senha em texto plano
 * @param {string} role - Role (aluno, professor, admin)
 * @param {number} turma_id - ID da turma (opcional)
 * @returns {Promise<{id, nome, email, role, turma_id}>}
 */
async function registerUser(nome, email, password, role = 'aluno', turma_id = null) {
  const connection = await getConnection();
  try {
    // Verifica se email já existe
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      throw new Error('Email já registrado');
    }

    // Hash da senha
    const password_hash = await hashPassword(password);

    // Insere novo usuário
    const [result] = await connection.execute(
      'INSERT INTO users (nome, email, password_hash, role, turma_id, ativo) VALUES (?, ?, ?, ?, ?, TRUE)',
      [nome, email, password_hash, role, turma_id]
    );

    return {
      id: result.insertId,
      nome,
      email,
      role,
      turma_id
    };
  } finally {
    connection.release();
  }
}

/**
 * Autentica usuário por email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha em texto plano
 * @returns {Promise<{id, nome, email, role, turma_id} | null>}
 */
async function authenticateUser(email, password) {
  const connection = await getConnection();
  try {
    const [users] = await connection.execute(
      'SELECT id, nome, email, password_hash, role, turma_id, ativo FROM users WHERE email = ? AND ativo = TRUE',
      [email]
    );

    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    const passwordMatch = await verifyPassword(password, user.password_hash);

    if (!passwordMatch) {
      return null;
    }

    // Atualiza último login
    await connection.execute(
      'UPDATE users SET ultimo_login_em = NOW() WHERE id = ?',
      [user.id]
    );

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      turma_id: user.turma_id
    };
  } finally {
    connection.release();
  }
}

/**
 * Busca usuário por ID
 * @param {number} userId - ID do usuário
 * @returns {Promise<{id, nome, email, role, turma_id} | null>}
 */
async function getUserById(userId) {
  const connection = await getConnection();
  try {
    const [users] = await connection.execute(
      'SELECT id, nome, email, role, turma_id FROM users WHERE id = ? AND ativo = TRUE',
      [userId]
    );

    return users.length > 0 ? users[0] : null;
  } finally {
    connection.release();
  }
}

/**
 * Middleware para verificar autenticação de usuário
 */
function requireAuth(req, res, next) {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).json({ error: 'Autenticação necessária' });
}

/**
 * Middleware para verificar role específica
 * @param {string|string[]} roles - Role ou array de roles permitidas
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Autenticação necessária' });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ error: 'Permissão insuficiente' });
    }

    return next();
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  registerUser,
  authenticateUser,
  getUserById,
  requireAuth,
  requireRole
};
