# SETI 2026 - Site de Atendimento com Chatbot e Banco de Dados

Projeto de atendimento com **chat flutuante** integrado ao assistente virtual da SETI (Semana de Estudos Técnicos em Informática), com backend em Node.js e banco de dados MySQL para gerenciamento de eventos.

## Stack

- **Frontend:** HTML, CSS e JavaScript puro
- **Backend:** Node.js + Express
- **API de IA:** OpenRouter (compatível com OpenAI)
- **Banco de Dados:** MySQL 8.0+
- **ORM/Query Builder:** mysql2/promise

## Funcionalidades

### Chat Flutuante
- Chat flutuante no canto inferior direito
- Interface moderna, leve e responsiva
- Assistente virtual com conhecimento sobre SETI 2026
- Respostas em português do Brasil

### API de Dados (Novo)
- Endpoints RESTful para consultar dados do evento
- Programação de palestras
- Informações de palestrantes
- Gincanas e atividades
- Notícias e comunicados
- Sistema de dúvidas dos alunos
- Placar de pontuação das turmas

## Como rodar localmente

### 1) Pré-requisitos

- Node.js 18+
- MySQL 8.0+ instalado e rodando
- Uma chave de API do OpenRouter

### 2) Instalar dependências

```bash
npm install
```

### 3) Configurar banco de dados

Consulte o arquivo [DATABASE_CONFIG.md](DATABASE_CONFIG.md) para instruções completas de setup do MySQL.

Resumo rápido:
```bash
# Criar banco de dados
mysql -u root -p
CREATE DATABASE seti_2026;
USE seti_2026;

# Importar schema
mysql -u root -p seti_2026 < database/schema.sql

# Importar dados iniciais (opcional)
mysql -u root -p seti_2026 < database/seed.sql
```

### 4) Configurar ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
# OpenRouter API Configuration
OPENROUTER_API_KEY=sua_chave_aqui
OPENROUTER_MODEL=openrouter/free

# Site Configuration
SITE_URL=https://github.com/erick98728/TechStore
APP_NAME=SETI Assistente
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=seti_2026
```

### 5) Executar

```bash
npm run dev
```

ou

```bash
npm start
```

Acesse: `http://localhost:3000`

## Estrutura do Projeto

```
.
├── database/
│   ├── schema.sql          # Schema das tabelas
│   ├── seed.sql            # Dados iniciais
│   └── connection.js       # Módulo de conexão MySQL
├── routes/
│   └── seti-api.js         # Rotas da API SETI
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── .env.example
├── .gitignore
├── package.json
├── server.js               # Servidor principal
├── DATABASE_CONFIG.md      # Documentação do banco
└── README.md
```

## Endpoints da API

### Programação
- `GET /api/programacao` - Lista todas as palestras
- `GET /api/programacao/:id` - Detalhes de uma palestra

### Palestrantes
- `GET /api/palestrantes` - Lista palestrantes confirmados
- `GET /api/palestrantes/:id` - Detalhes de um palestrante

### Gincanas
- `GET /api/gincanas` - Lista gincanas ativas
- `GET /api/gincanas/:id` - Detalhes de uma gincana

### Notícias
- `GET /api/noticias` - Lista notícias publicadas
- `GET /api/noticias/:id` - Detalhes de uma notícia

### Turmas
- `GET /api/turmas` - Lista todas as turmas

### Pontuação
- `GET /api/pontuacao` - Placar de pontuação das gincanas

### Dúvidas
- `POST /api/duvidas` - Registrar uma nova dúvida
- `GET /api/duvidas` - Listar todas as dúvidas (admin)

## Endpoint de Chat (Original)

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

## Exemplos de Uso

### Buscar Programação

```javascript
fetch('/api/programacao')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Enviar Dúvida

```javascript
fetch('/api/duvidas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@example.com',
    turma: '1ª Informática A',
    mensagem: 'Qual é o tema da primeira palestra?'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Hospedagem

Você pode hospedar em plataformas como **Render**, **Railway** ou **Fly.io**.

### Passos gerais

1. Suba este projeto para um repositório Git (GitHub/GitLab).
2. Crie um novo serviço Node.js na plataforma escolhida.
3. Configure as variáveis de ambiente:
   - `OPENROUTER_API_KEY`
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `PORT` (normalmente fornecida pela plataforma automaticamente)
4. Configure comando de build/start:
   - Build: `npm install`
   - Start: `npm start`
5. Faça o deploy e acesse a URL pública.

**Nota:** Para produção, use um serviço de banco de dados gerenciado (AWS RDS, Railway, etc.) em vez de instalar MySQL localmente.

## Segurança

- **Nunca** exponha `OPENROUTER_API_KEY` no frontend.
- **Nunca** coloque credenciais do banco de dados no GitHub.
- Mantenha `.env` fora do versionamento (adicione no `.gitignore`, se ainda não existir).
- Para produção, use variáveis de ambiente do servidor.
- Implemente autenticação para endpoints administrativos (GET /api/duvidas).

## Documentação Adicional

- [DATABASE_CONFIG.md](DATABASE_CONFIG.md) - Guia completo de configuração do banco de dados

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## Licença

MIT
