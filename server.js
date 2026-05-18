require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const OpenAI = require('openai');
const { authenticateUser, getUserById, requireAuth } = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.warn('⚠️ OPENROUTER_API_KEY não definida. Defina no arquivo .env ou nos Secrets do Replit para habilitar o chat.');
}

const client = new OpenAI({
  apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'https://github.com/erick98728/TechStore',
    'X-Title': process.env.APP_NAME || 'SETI Assistente'
  }
});

const SYSTEM_PROMPT = `Você é o assistente virtual do site oficial da SETI 2026, Semana de Estudos Técnicos em Informática da E.M. Dr. Leandro Franceschini, em Sumaré/SP.

Responda sempre em português do Brasil, com linguagem clara, objetiva e adequada para um projeto escolar técnico. Use apenas informações confirmadas quando falar da SETI. Quando algo não estiver confirmado, diga "aguardando confirmação", "em análise" ou "segundo registros encontrados".

Dados oficiais da SETI 2026:
- Data: 10 a 14 de agosto de 2026.
- Local: Auditório da E.M. Dr. Leandro Franceschini.
- Organização: 4ª Informática A, 4ª Informática B e 4ª Informática C.
- Orientação: Prof. Luís Guilherme.
- Representantes: Ana Clara Magalhães e Diogo Monteiro, da 4ª Informática A; Julia Carvalho e Vinicius Aparecido Batista, da 4ª Informática B; Bianca de Brito Leite e Gustavo Alves de Oliveira, da 4ª Informática C.
- Objetivos: promover conhecimento tecnológico, aproximar alunos e palestrantes e criar um ambiente de aprendizagem diferente.
- Programação: 10/08 IA, benefícios e malefícios; 11/08 diversidade da informática; 12/08 tecnologia empresarial com Guilherme Rufino; 13/08 tecnologia para o mundo; 14/08 segmentos para ingressar ao mercado.
- Gincanas: Passa ou Repassa, Labirinto, Quem Sou Eu?, Show da Tecnologia e perguntas sobre a palestra do dia.
- Penalizações incluem uso de celular, conversas paralelas, conduta inadequada, ausência e outras regras do evento.

Também responda dúvidas didáticas sobre informática, programação, banco de dados, PHP, IA, redes, segurança digital e mercado de tecnologia quando o assunto fizer sentido para a SETI.`;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'troque-este-segredo-no-env',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 4
    }
  })
);
app.use(express.static(path.join(__dirname, 'public')));

const requireAdmin = (req, res, next) => {
  if (req.session?.isAdmin && req.session?.user?.role === 'admin') return next();
  return res.status(401).json({ error: 'Acesso administrativo necessário.' });
};

app.get('/api/admin/status', (req, res) => {
  res.json({ authenticated: Boolean(req.session?.isAdmin), user: req.session?.user || null });
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

    let user = await authenticateUser(email, password);
    if (!user && email === 'admin' && password === process.env.ADMIN_PASSWORD) {
      user = { id: 0, nome: 'Administrador', email: 'admin', role: 'admin', turma_id: null };
    }

    if (!user) return res.status(401).json({ error: 'Email ou senha inválidos.' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Permissão insuficiente. Apenas administradores podem acessar.' });

    req.session.user = user;
    req.session.userId = user.id;
    req.session.isAdmin = true;
    return res.json({ success: true, message: 'Login realizado com sucesso.', user });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro ao processar login.' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logout realizado com sucesso.' });
  });
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios.' });

    const user = await authenticateUser(email, password);
    if (!user) return res.status(401).json({ success: false, error: 'Email ou senha inválidos.' });

    req.session.userId = user.id;
    req.session.user = { id: user.id, nome: user.nome, email: user.email, role: user.role };
    res.json({ success: true, message: 'Login realizado com sucesso.', user: req.session.user });
  } catch (error) {
    console.error('Erro no login público:', error);
    res.status(500).json({ success: false, error: 'Erro ao fazer login.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, error: 'Erro ao fazer logout.' });
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logout realizado com sucesso.' });
  });
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, password, turma_id } = req.body;
    if (!nome || !email || !password) return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });

    const { registerUser } = require('./auth');
    const user = await registerUser(nome, email, password, 'aluno', turma_id);
    return res.json({ success: true, message: 'Usuário registrado com sucesso.', user });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(400).json({ error: error.message || 'Erro ao registrar usuário.' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await getUserById(req.session.user.id);
    return res.json({ user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') return res.status(400).json({ error: 'Mensagem inválida.' });
    if (!apiKey) return res.status(500).json({ error: 'Servidor sem chave do OpenRouter configurada.' });

    const response = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'openrouter/free',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      temperature: 0.6
    });

    const reply = response.choices?.[0]?.message?.content?.trim();
    if (!reply) return res.status(502).json({ error: 'Não foi possível gerar uma resposta no momento.' });
    return res.json({ reply });
  } catch (error) {
    console.error('Erro no /chat:', error?.response?.data || error);
    return res.status(500).json({ error: 'Erro ao processar a mensagem.' });
  }
});

const setiApi = require('./routes/seti-api');
app.use('/api', setiApi({ requireAdmin }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor SETI rodando em http://localhost:${port}`);
});
