/**
 * Middleware de Autenticação para Painel Administrativo
 * 
 * Este middleware verifica se a senha de admin foi fornecida corretamente
 * no header x-admin-password antes de permitir acesso a rotas protegidas.
 */

/**
 * Middleware de autenticação para rotas administrativas
 * 
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 * 
 * @returns {void}
 */
const adminAuth = (req, res, next) => {
  // Obter a senha de admin das variáveis de ambiente
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  // Obter a senha fornecida no header da requisição
  const providedPassword = req.headers['x-admin-password'];
  
  // Validar se a senha de admin foi configurada
  if (!adminPassword) {
    console.error('[Auth] ADMIN_PASSWORD não configurada em variáveis de ambiente');
    return res.status(500).json({
      success: false,
      error: 'Servidor não configurado corretamente',
      message: 'ADMIN_PASSWORD não foi definida'
    });
  }
  
  // Validar se a senha foi fornecida na requisição
  if (!providedPassword) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Senha de admin não fornecida. Use header: x-admin-password'
    });
  }
  
  // Validar se a senha fornecida está correta
  if (providedPassword !== adminPassword) {
    console.warn('[Auth] Tentativa de acesso com senha incorreta');
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Senha de admin incorreta'
    });
  }
  
  // Senha correta, permitir acesso à rota
  console.log('[Auth] Acesso autorizado para rota administrativa');
  next();
};

/**
 * Middleware de autenticação com logging detalhado
 * Útil para debug e auditoria
 * 
 * @param {Object} req - Objeto de requisição Express
 * @param {Object} res - Objeto de resposta Express
 * @param {Function} next - Função para passar para o próximo middleware
 * 
 * @returns {void}
 */
const adminAuthWithLogging = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const providedPassword = req.headers['x-admin-password'];
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  
  // Log da tentativa de acesso
  console.log(`[Auth] ${timestamp} - Tentativa de acesso: ${req.method} ${req.path} de ${ip}`);
  
  if (!adminPassword) {
    console.error('[Auth] ADMIN_PASSWORD não configurada');
    return res.status(500).json({
      success: false,
      error: 'Servidor não configurado corretamente'
    });
  }
  
  if (!providedPassword) {
    console.warn(`[Auth] ${timestamp} - Senha não fornecida de ${ip}`);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Senha de admin não fornecida'
    });
  }
  
  if (providedPassword !== adminPassword) {
    console.warn(`[Auth] ${timestamp} - Senha incorreta de ${ip}`);
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Senha de admin incorreta'
    });
  }
  
  console.log(`[Auth] ${timestamp} - Acesso autorizado para ${req.method} ${req.path}`);
  next();
};

/**
 * Middleware de autenticação com rate limiting básico
 * Limita tentativas de acesso para prevenir força bruta
 * 
 * @param {Object} config - Configuração do rate limiting
 * @param {number} config.maxAttempts - Máximo de tentativas (padrão: 5)
 * @param {number} config.windowMs - Janela de tempo em ms (padrão: 15 minutos)
 * 
 * @returns {Function} Middleware Express
 */
const createRateLimitedAuth = (config = {}) => {
  const maxAttempts = config.maxAttempts || 5;
  const windowMs = config.windowMs || 15 * 60 * 1000; // 15 minutos
  
  const attempts = new Map(); // Armazenar tentativas por IP
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Limpar tentativas antigas
    if (attempts.has(ip)) {
      const userAttempts = attempts.get(ip).filter(time => now - time < windowMs);
      
      if (userAttempts.length >= maxAttempts) {
        console.warn(`[Auth] Rate limit excedido para ${ip}`);
        return res.status(429).json({
          success: false,
          error: 'Too Many Requests',
          message: `Muitas tentativas. Tente novamente em ${Math.ceil(windowMs / 1000)} segundos`
        });
      }
      
      userAttempts.push(now);
      attempts.set(ip, userAttempts);
    } else {
      attempts.set(ip, [now]);
    }
    
    // Executar autenticação normal
    const adminPassword = process.env.ADMIN_PASSWORD;
    const providedPassword = req.headers['x-admin-password'];
    
    if (!adminPassword || !providedPassword || providedPassword !== adminPassword) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Senha de admin incorreta'
      });
    }
    
    next();
  };
};

module.exports = {
  adminAuth,
  adminAuthWithLogging,
  createRateLimitedAuth
};
