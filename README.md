# Site de Atendimento com Chatbot (OpenAI)

Projeto simples de atendimento com **chat flutuante** no frontend e integração com a API da OpenAI no backend.

## Stack

- Frontend: HTML, CSS e JavaScript puro
- Backend: Node.js + Express
- API de IA: OpenAI (via SDK oficial)

## Funcionalidades

- Chat flutuante no canto inferior direito
- Interface moderna, leve e responsiva
- Rota `POST /chat` no backend
- Chave da OpenAI protegida no servidor (variável de ambiente)
- Respostas do assistente em português do Brasil

## Como rodar localmente

### 1) Pré-requisitos

- Node.js 18+
- Uma chave de API da OpenAI

### 2) Instalar dependências

```bash
npm install
```

### 3) Configurar ambiente

Copie o arquivo de exemplo e preencha sua chave:

```bash
cp .env.example .env
```

Edite `.env`:

```env
OPENAI_API_KEY=coloque_sua_chave_aqui
PORT=3000
OPENAI_MODEL=gpt-4.1-mini
```

### 4) Executar

```bash
npm run dev
```

ou

```bash
npm start
```

Acesse: `http://localhost:3000`

## Estrutura

```txt
.
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Endpoint de chat

- Método: `POST`
- URL: `/chat`
- Body (JSON):

```json
{
  "message": "Olá, vocês têm notebook para programação?"
}
```

- Resposta (JSON):

```json
{
  "reply": "Temos sim! Posso te indicar alguns modelos..."
}
```

## Hospedagem

Você pode hospedar em plataformas como **Render**, **Railway** ou **Fly.io**.

### Passos gerais

1. Suba este projeto para um repositório Git (GitHub/GitLab).
2. Crie um novo serviço Node.js na plataforma escolhida.
3. Configure as variáveis de ambiente:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (opcional)
   - `PORT` (normalmente fornecida pela plataforma automaticamente)
4. Configure comando de build/start:
   - Build: `npm install`
   - Start: `npm start`
5. Faça o deploy e acesse a URL pública.

## Segurança

- **Nunca** exponha `OPENAI_API_KEY` no frontend.
- Mantenha `.env` fora do versionamento (adicione no `.gitignore`, se ainda não existir).
