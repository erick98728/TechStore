/**
 * SETI 2026 API Routes
 * Rotas para consultar dados do banco de dados
 */

const express = require('express');
const router = express.Router();
const db = require('../database/connection');

/**
 * GET /api/programacao
 * Retorna a programação do evento
 */
router.get('/programacao', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT p.*, pa.nome as palestrante_nome, pa.area as palestrante_area
       FROM programacao p
       LEFT JOIN palestrantes pa ON p.palestrante_id = pa.id
       ORDER BY p.data_evento ASC, p.ordem ASC`
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar programação:', error);
    res.status(500).json({ error: 'Erro ao buscar programação' });
  }
});

/**
 * GET /api/programacao/:id
 * Retorna uma palestra específica
 */
router.get('/programacao/:id', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT p.*, pa.nome as palestrante_nome, pa.area as palestrante_area, pa.mini_bio, pa.foto_url
       FROM programacao p
       LEFT JOIN palestrantes pa ON p.palestrante_id = pa.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Programação não encontrada' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Erro ao buscar programação:', error);
    res.status(500).json({ error: 'Erro ao buscar programação' });
  }
});

/**
 * GET /api/palestrantes
 * Retorna lista de palestrantes
 */
router.get('/palestrantes', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM palestrantes WHERE status = 'confirmado' ORDER BY nome ASC`
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar palestrantes:', error);
    res.status(500).json({ error: 'Erro ao buscar palestrantes' });
  }
});

/**
 * GET /api/palestrantes/:id
 * Retorna detalhes de um palestrante
 */
router.get('/palestrantes/:id', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM palestrantes WHERE id = ?`,
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Palestrante não encontrado' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Erro ao buscar palestrante:', error);
    res.status(500).json({ error: 'Erro ao buscar palestrante' });
  }
});

/**
 * GET /api/gincanas
 * Retorna lista de gincanas
 */
router.get('/gincanas', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM gincanas WHERE ativo = 1 ORDER BY ordem ASC`
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar gincanas:', error);
    res.status(500).json({ error: 'Erro ao buscar gincanas' });
  }
});

/**
 * GET /api/gincanas/:id
 * Retorna detalhes de uma gincana
 */
router.get('/gincanas/:id', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM gincanas WHERE id = ?`,
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Gincana não encontrada' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Erro ao buscar gincana:', error);
    res.status(500).json({ error: 'Erro ao buscar gincana' });
  }
});

/**
 * GET /api/noticias
 * Retorna lista de notícias publicadas
 */
router.get('/noticias', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM noticias WHERE publicado = 1 ORDER BY criado_em DESC`
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
});

/**
 * GET /api/noticias/:id
 * Retorna detalhes de uma notícia
 */
router.get('/noticias/:id', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM noticias WHERE id = ? AND publicado = 1`,
      [req.params.id]
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    res.json(results[0]);
  } catch (error) {
    console.error('Erro ao buscar notícia:', error);
    res.status(500).json({ error: 'Erro ao buscar notícia' });
  }
});

/**
 * GET /api/turmas
 * Retorna lista de turmas
 */
router.get('/turmas', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM turmas ORDER BY ano ASC, nome ASC`
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    res.status(500).json({ error: 'Erro ao buscar turmas' });
  }
});

/**
 * GET /api/pontuacao
 * Retorna placar de pontuação das gincanas por turma
 */
router.get('/pontuacao', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT t.id, t.nome as turma, 
              COALESCE(SUM(pg.pontos), 0) as pontos_totais,
              COUNT(DISTINCT pg.gincana_id) as gincanas_participadas
       FROM turmas t
       LEFT JOIN pontuacao_gincanas pg ON t.id = pg.turma_id
       GROUP BY t.id, t.nome
       ORDER BY pontos_totais DESC, t.nome ASC`
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar pontuação:', error);
    res.status(500).json({ error: 'Erro ao buscar pontuação' });
  }
});

/**
 * POST /api/duvidas
 * Registra uma dúvida enviada por um aluno
 */
router.post('/duvidas', async (req, res) => {
  try {
    const { nome, email, turma, mensagem } = req.body;

    // Validação básica
    if (!nome || !email || !mensagem) {
      return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios' });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Inserir dúvida no banco
    await db.query(
      `INSERT INTO duvidas (nome, email, turma, mensagem, respondida)
       VALUES (?, ?, ?, ?, 0)`,
      [nome, email, turma || null, mensagem]
    );

    res.status(201).json({
      success: true,
      message: 'Dúvida registrada com sucesso. Em breve você receberá uma resposta!'
    });
  } catch (error) {
    console.error('Erro ao registrar dúvida:', error);
    res.status(500).json({ error: 'Erro ao registrar dúvida' });
  }
});

/**
 * GET /api/duvidas
 * Retorna lista de dúvidas (apenas para admin)
 * Nota: Implementar autenticação antes de usar em produção
 */
router.get('/duvidas', async (req, res) => {
  try {
    const results = await db.query(
      `SELECT * FROM duvidas ORDER BY criado_em DESC`
    );
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar dúvidas:', error);
    res.status(500).json({ error: 'Erro ao buscar dúvidas' });
  }
});

module.exports = router;
