const express = require('express');
const db = require('../database/connection');

const allowedTables = {
  programacao: {
    table: 'programacao',
    fields: ['data_evento', 'dia_semana', 'titulo', 'turma', 'horario_inicio', 'horario_fim', 'palestrante_id', 'status_palestrante', 'descricao', 'ordem'],
    order: 'data_evento ASC, ordem ASC'
  },
  palestrantes: {
    table: 'palestrantes',
    fields: ['nome', 'area', 'mini_bio', 'foto_url', 'instagram', 'linkedin', 'status'],
    order: 'nome ASC'
  },
  gincanas: {
    table: 'gincanas',
    fields: ['nome', 'descricao', 'regras', 'icone', 'ordem', 'ativo'],
    order: 'ordem ASC'
  },
  noticias: {
    table: 'noticias',
    fields: ['titulo', 'resumo', 'conteudo', 'imagem_url', 'publicado'],
    order: 'criado_em DESC'
  },
  turmas: {
    table: 'turmas',
    fields: ['nome', 'ano', 'curso', 'periodo'],
    order: 'ano ASC, nome ASC'
  },
  pontuacao_gincanas: {
    table: 'pontuacao_gincanas',
    fields: ['turma_id', 'gincana_id', 'pontos', 'observacao'],
    order: 'criado_em DESC'
  },
  penalizacoes: {
    table: 'penalizacoes',
    fields: ['turma_id', 'motivo', 'pontos_perdidos', 'observacao'],
    order: 'criado_em DESC'
  },
  duvidas: {
    table: 'duvidas',
    fields: ['nome', 'email', 'turma', 'mensagem', 'respondida'],
    order: 'criado_em DESC'
  }
};

const pickFields = (body, fields) => {
  const entries = fields
    .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
    .map((field) => [field, body[field] === '' ? null : body[field]]);

  return Object.fromEntries(entries);
};

const createSetiApi = ({ requireAdmin } = {}) => {
  const router = express.Router();
  const protect = requireAdmin || ((req, res, next) => next());

  router.get('/health', async (req, res) => {
    try {
      await db.query('SELECT 1 AS ok');
      res.json({ ok: true, database: 'connected' });
    } catch (error) {
      res.status(503).json({ ok: false, database: 'unavailable', error: error.message });
    }
  });

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

  router.get('/programacao/:id', async (req, res) => {
    try {
      const results = await db.query(
        `SELECT p.*, pa.nome as palestrante_nome, pa.area as palestrante_area, pa.mini_bio, pa.foto_url
         FROM programacao p
         LEFT JOIN palestrantes pa ON p.palestrante_id = pa.id
         WHERE p.id = ?`,
        [req.params.id]
      );
      if (results.length === 0) return res.status(404).json({ error: 'Programação não encontrada' });
      res.json(results[0]);
    } catch (error) {
      console.error('Erro ao buscar programação:', error);
      res.status(500).json({ error: 'Erro ao buscar programação' });
    }
  });

  router.get('/palestrantes', async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM palestrantes ORDER BY nome ASC`);
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar palestrantes:', error);
      res.status(500).json({ error: 'Erro ao buscar palestrantes' });
    }
  });

  router.get('/palestrantes/:id', async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM palestrantes WHERE id = ?`, [req.params.id]);
      if (results.length === 0) return res.status(404).json({ error: 'Palestrante não encontrado' });
      res.json(results[0]);
    } catch (error) {
      console.error('Erro ao buscar palestrante:', error);
      res.status(500).json({ error: 'Erro ao buscar palestrante' });
    }
  });

  router.get('/gincanas', async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM gincanas WHERE ativo = 1 ORDER BY ordem ASC`);
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar gincanas:', error);
      res.status(500).json({ error: 'Erro ao buscar gincanas' });
    }
  });

  router.get('/gincanas/:id', async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM gincanas WHERE id = ?`, [req.params.id]);
      if (results.length === 0) return res.status(404).json({ error: 'Gincana não encontrada' });
      res.json(results[0]);
    } catch (error) {
      console.error('Erro ao buscar gincana:', error);
      res.status(500).json({ error: 'Erro ao buscar gincana' });
    }
  });

  router.get('/noticias', async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM noticias WHERE publicado = 1 ORDER BY criado_em DESC`);
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      res.status(500).json({ error: 'Erro ao buscar notícias' });
    }
  });

  router.get('/noticias/:id', async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM noticias WHERE id = ? AND publicado = 1`, [req.params.id]);
      if (results.length === 0) return res.status(404).json({ error: 'Notícia não encontrada' });
      res.json(results[0]);
    } catch (error) {
      console.error('Erro ao buscar notícia:', error);
      res.status(500).json({ error: 'Erro ao buscar notícia' });
    }
  });

  router.get('/turmas', async (req, res) => {
    try {
      const results = await db.query(`SELECT * FROM turmas ORDER BY ano ASC, nome ASC`);
      res.json(results);
    } catch (error) {
      console.error('Erro ao buscar turmas:', error);
      res.status(500).json({ error: 'Erro ao buscar turmas' });
    }
  });

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

  router.post('/duvidas', async (req, res) => {
    try {
      const { nome, email, turma, mensagem } = req.body;
      if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: 'Nome, email e mensagem são obrigatórios' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return res.status(400).json({ error: 'Email inválido' });

      await db.query(
        `INSERT INTO duvidas (nome, email, turma, mensagem, respondida)
         VALUES (?, ?, ?, ?, 0)`,
        [nome, email, turma || null, mensagem]
      );

      res.status(201).json({ success: true, message: 'Dúvida registrada com sucesso.' });
    } catch (error) {
      console.error('Erro ao registrar dúvida:', error);
      res.status(500).json({ error: 'Erro ao registrar dúvida' });
    }
  });

  router.get('/admin/:resource', protect, async (req, res) => {
    try {
      const config = allowedTables[req.params.resource];
      if (!config) return res.status(404).json({ error: 'Recurso administrativo não encontrado.' });

      const results = await db.query(`SELECT * FROM ${config.table} ORDER BY ${config.order}`);
      res.json(results);
    } catch (error) {
      console.error('Erro ao listar recurso administrativo:', error);
      res.status(500).json({ error: 'Erro ao listar dados administrativos.' });
    }
  });

  router.post('/admin/:resource', protect, async (req, res) => {
    try {
      const config = allowedTables[req.params.resource];
      if (!config) return res.status(404).json({ error: 'Recurso administrativo não encontrado.' });

      const data = pickFields(req.body, config.fields);
      const fields = Object.keys(data);
      if (!fields.length) return res.status(400).json({ error: 'Nenhum campo válido informado.' });

      const placeholders = fields.map(() => '?').join(', ');
      const values = fields.map((field) => data[field]);
      const result = await db.query(
        `INSERT INTO ${config.table} (${fields.join(', ')}) VALUES (${placeholders})`,
        values
      );

      res.status(201).json({ success: true, id: result.insertId });
    } catch (error) {
      console.error('Erro ao criar registro administrativo:', error);
      res.status(500).json({ error: 'Erro ao criar registro.' });
    }
  });

  router.put('/admin/:resource/:id', protect, async (req, res) => {
    try {
      const config = allowedTables[req.params.resource];
      if (!config) return res.status(404).json({ error: 'Recurso administrativo não encontrado.' });

      const data = pickFields(req.body, config.fields);
      const fields = Object.keys(data);
      if (!fields.length) return res.status(400).json({ error: 'Nenhum campo válido informado.' });

      const assignments = fields.map((field) => `${field} = ?`).join(', ');
      const values = fields.map((field) => data[field]);
      values.push(req.params.id);
      await db.query(`UPDATE ${config.table} SET ${assignments} WHERE id = ?`, values);

      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao atualizar registro administrativo:', error);
      res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
  });

  router.delete('/admin/:resource/:id', protect, async (req, res) => {
    try {
      const config = allowedTables[req.params.resource];
      if (!config) return res.status(404).json({ error: 'Recurso administrativo não encontrado.' });

      await db.query(`DELETE FROM ${config.table} WHERE id = ?`, [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      console.error('Erro ao excluir registro administrativo:', error);
      res.status(500).json({ error: 'Erro ao excluir registro.' });
    }
  });

  return router;
};

module.exports = createSetiApi;
