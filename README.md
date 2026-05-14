# SETI 2026 - Sistema de Gerenciamento de Eventos

Site oficial da Semana de Estudos Técnicos em Informática (SETI) 2026, com painel administrativo e funcionalidades para gerenciar programação, palestrantes, notícias, gincanas e dúvidas.

## 📋 Visão Geral

O SETI 2026 é um evento técnico-escolar ligado ao curso de Informática da E.M. Dr. Leandro Franceschini, em Sumaré/SP. Este sistema gerencia:

- **Programação**: Palestras e eventos do dia
- **Palestrantes**: Informações dos convidados
- **Gincanas**: Atividades e pontuação das turmas
- **Notícias**: Publicações sobre o evento
- **Dúvidas**: Formulário público e gerenciamento de perguntas
- **Penalizações**: Sistema de pontuação com penalidades
- **Galeria**: Fotos e mídia do evento

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

| Tabela | Descrição |
|--------|-----------|
| `users` | Usuários do sistema (aluno, professor, admin) |
| `turmas` | Turmas participantes (4ª A, B, C) |
| `palestrantes` | Informações dos palestrantes |
| `programacao` | Agenda de palestras e eventos |
| `gincanas` | Atividades e desafios |
| `noticias` | Publicações do site |
| `duvidas` | Perguntas do público |
| `participantes` | Alunos inscritos |
| `pontuacao_gincanas` | Pontos por turma/gincana |
| `tipos_penalizacoes` | Tipos de penalidades |
| `penalizacoes` | Penalidades aplicadas |
| `galeria` | Fotos e mídia |

## 🔐 Autenticação e Autorização

### Sistema de Roles

O sistema suporta três roles:

- **admin**: Acesso completo ao painel administrativo
- **professor**: Acesso restrito (em desenvolvimento)
- **aluno**: Acesso apenas a formulários públicos

### Autenticação com Bcrypt

As senhas são criptografadas com **bcrypt** (10 rounds de salt). Nunca são armazenadas em texto plano.

### Login no Painel Administrativo

1. Acesse `/admin`
2. Insira **email** e **senha** de uma conta com role `admin`
3. Fallback: Se nenhum usuário for encontrado, use `email: admin` e a senha em `ADMIN_PASSWORD`

## 🚀 Como Usar

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### Variáveis de Ambiente

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seti_2026

# Sessão
SESSION_SECRET=seu_segredo_aleatorio

# OpenRouter (Chat)
OPENROUTER_API_KEY=sua_chave_openrouter
OPENROUTER_MODEL=openrouter/free

# Admin (Fallback)
ADMIN_PASSWORD=sua_senha_admin

# Site
SITE_URL=http://localhost:3000
APP_NAME=SETI 2026
```

### Executar o Servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor rodará em `http://localhost:3000`

## 📊 API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/admin/login` | Login no painel (email + senha) |
| POST | `/api/admin/logout` | Logout |
| GET | `/api/admin/status` | Status de autenticação |
| POST | `/api/auth/register` | Registrar novo usuário |
| GET | `/api/auth/me` | Dados do usuário autenticado |

### Recursos (CRUD)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/admin/{resource}` | Listar todos |
| POST | `/api/admin/{resource}` | Criar novo |
| PUT | `/api/admin/{resource}/:id` | Atualizar |
| DELETE | `/api/admin/{resource}/:id` | Deletar |

**Recursos disponíveis**: `programacao`, `palestrantes`, `gincanas`, `noticias`, `turmas`, `duvidas`, `tipos_penalizacoes`, `penalizacoes`, `pontuacao_gincanas`, `galeria`

### Chat (Assistente SETI)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/chat` | Enviar mensagem ao assistente |

**Request:**
```json
{
  "message": "Qual é a data da SETI 2026?"
}
```

**Response:**
```json
{
  "reply": "A SETI 2026 está prevista para 10 a 14 de agosto de 2026..."
}
```

## 🎯 Fluxo de Pontuação

### Gincanas

1. Cada turma começa com **0 pontos**
2. Pontos são adicionados por gincana via `pontuacao_gincanas`
3. Penalidades são aplicadas via `penalizacoes`
4. **Pontuação final** = Pontos de gincanas - Pontos de penalidades

### Penalizações

Exemplos de penalizações:

| Tipo | Pontos |
|------|--------|
| Dormir na palestra | -95 |
| Conduta desrespeitosa | -90 |
| Uso de celular | -80 |
| Uniforme incorreto | -60 |
| Conversa paralela | -50 |
| Local sujo | -50 |
| Desobediência | -30 |
| Ausência | -10 |

## 🎨 Identidade Visual

### Paleta de Cores

- **Roxo**: `#6C3BFF`
- **Lilás**: `#B9A7FF`
- **Azul tecnológico**: `#2364D2`
- **Grafite**: `#14151F`
- **Branco**: `#FFFFFF`
- **Cinza claro**: `#F4F6FB`
- **Ciano (detalhes)**: `#00CED1`

## 📝 Estrutura de Arquivos

```
TechStore/
├── server.js                 # Servidor Express principal
├── auth.js                   # Módulo de autenticação com bcrypt
├── package.json              # Dependências
├── .env                       # Variáveis de ambiente
├── database/
│   ├── connection.js         # Conexão MySQL
│   ├── schema.sql            # Definição das tabelas
│   └── seed.sql              # Dados iniciais
├── routes/
│   └── seti-api.js           # Endpoints da API
└── public/
    ├── index.html            # Página inicial
    ├── admin/
    │   ├── index.html        # Painel administrativo
    │   ├── admin.js          # Lógica do painel
    │   └── admin.css         # Estilos do painel
    └── assets/               # Imagens, ícones, etc.
```

## 🔧 Desenvolvimento

### Adicionar Novo Recurso

1. **Criar tabela no banco** (`database/schema.sql`)
2. **Adicionar endpoints em** `routes/seti-api.js`
3. **Adicionar configuração em** `public/admin/admin.js` (campo `resources`)
4. **Testar via painel administrativo**

### Exemplo: Adicionar Novo Campo

```sql
-- 1. Alterar tabela
ALTER TABLE programacao ADD COLUMN local VARCHAR(255);

-- 2. Adicionar ao schema.sql para referência
```

```javascript
// 3. Adicionar ao admin.js
programacao: {
  fields: [
    // ... campos existentes
    ['local', 'Local'],  // Novo campo
  ]
}
```

## 🧪 Testes

```bash
# Testar autenticação
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha123"}'

# Listar programação
curl http://localhost:3000/api/admin/programacao

# Chat
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Qual é a data da SETI?"}'
```

## 🚨 Troubleshooting

### Erro: "ADMIN_PASSWORD não configurada"

Defina a variável de ambiente `ADMIN_PASSWORD` no `.env` ou no servidor.

### Erro: "Email ou senha inválidos"

Verifique se o usuário existe no banco de dados com role `admin`:

```sql
SELECT * FROM users WHERE email = 'seu_email@example.com';
```

### Erro: "Conexão com banco de dados falhou"

Verifique as credenciais em `.env`:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

### Chat não responde

Verifique se `OPENROUTER_API_KEY` está configurada:

```bash
echo $OPENROUTER_API_KEY
```

## 📚 Referências

- [SETI 2026 - Documentação Oficial](https://github.com/erick98728/TechStore)
- [Express.js](https://expressjs.com/)
- [MySQL2](https://github.com/sidorares/node-mysql2)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [OpenRouter](https://openrouter.ai/)

## 📄 Licença

Este projeto é parte do evento SETI 2026 da E.M. Dr. Leandro Franceschini.

## 👥 Organização

**Responsáveis pela organização (2026):**
- Ana Clara Magalhães (4ª Informática A)
- Diogo Monteiro (4ª Informática A)
- Julia Carvalho (4ª Informática B)
- Vinicius Aparecido Batista (4ª Informática B)
- Bianca de Brito Leite (4ª Informática C)
- Gustavo Alves de Oliveira (4ª Informática C)

**Orientação:** Prof. Luís Guilherme

---

**Última atualização:** Maio 2026
