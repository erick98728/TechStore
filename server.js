require('dotenv').config();

const path = require('path');
const express = require('express');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ OPENAI_API_KEY não definida. Defina no arquivo .env para habilitar o chat.');
}

const client = new OpenAI({ apiKey });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem inválida.' });
    }

    if (!apiKey) {
      return res.status(500).json({ error: 'Servidor sem chave da OpenAI configurada.' });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: 'Você é um assistente de atendimento cordial e objetivo. Responda sempre em português do Brasil.'
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: message
            }
          ]
        }
      ],
      temperature: 0.7
    });

    const reply = response.output_text?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'Não foi possível gerar uma resposta no momento.' });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Erro no /chat:', error);
    return res.status(500).json({ error: 'Erro ao processar a mensagem.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
