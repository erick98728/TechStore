# Sistema de Autenticação - SETI 2026

Documentação completa do sistema de autenticação com bcrypt e roles.

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Tabela Users](#tabela-users)
4. [Módulo auth.js](#módulo-authjs)
5. [Endpoints de Autenticação](#endpoints-de-autenticação)
6. [Fluxos de Uso](#fluxos-de-uso)
7. [Segurança](#segurança)
8. [Troubleshooting](#troubleshooting)

## 🎯 Visão Geral

O sistema de autenticação utiliza:

- **Bcrypt**: Hashing seguro de senhas (10 rounds)
- **Express-session**: Gerenciamento de sessões
- **Roles**: Controle de acesso baseado em roles (admin, professor, aluno)
- **MySQL**: Armazenamento de usuários

### Fluxo Básico

```
1. Usuário envia email + senha
   ↓
2. Sistema busca usuário no banco
   ↓
3. Compara senha com hash usando bcrypt
   ↓
4. Se válido, cria sessão
   ↓
5. Verifica role (admin, professor, aluno)
   ↓
6. Retorna acesso ou nega
```

## 🏗️ Arquitetura

### Componentes

| Componente | Arquivo | Responsabilidade |
|-----------|---------|------------------|
| Hash/Verify | `auth.js` | Criptografia de senhas |
| Autenticação | `auth.js` | Validação de credenciais |
| Sessão | `server.js` | Gerenciamento de sessão |
| Middleware | `auth.js` | Verificação de acesso |
| Banco de dados | `database/connection.js` | Persistência |

### Fluxo de Dados

```
┌─────────────────┐
│  Cliente (UI)   │
└────────┬────────┘
         │ POST /api/admin/login
         │ {email, password}
         ↓
┌─────────────────────────────────┐
│  server.js (POST /api/admin/login)
└────────┬────────────────────────┘
         │ Chama authenticateUser()
         ↓
┌─────────────────────────────────┐
│  auth.js (authenticateUser)     │
│  1. Busca usuário no banco      │
│  2. Compara senha com bcrypt    │
│  3. Retorna user ou null        │
└────────┬────────────────────────┘
         │ Cria sessão
         ↓
┌─────────────────────────────────┐
│  express-session                │
│  Armazena user na sessão        │
└────────┬────────────────────────┘
         │ JSON response
         ↓
┌─────────────────┐
│  Cliente (UI)   │
└─────────────────┘
```

## 🗄️ Tabela Users

### Schema

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('aluno', 'professor', 'admin') DEFAULT 'aluno',
  turma_id INT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_login_em TIMESTAMP NULL,
  FOREIGN KEY (turma_id) REFERENCES turmas(id)
);
```

### Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | Identificador único |
| `nome` | VARCHAR(255) | Nome completo |
| `email` | VARCHAR(255) | Email único |
| `password_hash` | VARCHAR(255) | Hash bcrypt da senha |
| `role` | ENUM | admin, professor ou aluno |
| `turma_id` | INT | Turma do aluno (opcional) |
| `ativo` | BOOLEAN | Se pode fazer login |
| `criado_em` | TIMESTAMP | Data de criação |
| `ultimo_login_em` | TIMESTAMP | Último login |

## 🔐 Módulo auth.js

### Funções Principais

#### 1. `hashPassword(password)`

Criptografa uma senha com bcrypt.

```javascript
const hash = await hashPassword('minha_senha');
// hash = $2b$10$... (60 caracteres)
```

**Parâmetros:**
- `password` (string): Senha em texto plano

**Retorna:**
- Promise<string>: Hash bcrypt

#### 2. `verifyPassword(password, hash)`

Verifica se a senha corresponde ao hash.

```javascript
const match = await verifyPassword('minha_senha', hash);
// true ou false
```

**Parâmetros:**
- `password` (string): Senha em texto plano
- `hash` (string): Hash armazenado no banco

**Retorna:**
- Promise<boolean>: True se corresponde

#### 3. `registerUser(nome, email, password, role, turma_id)`

Registra um novo usuário.

```javascript
const user = await registerUser(
  'João Silva',
  'joao@example.com',
  'senha123',
  'aluno',
  1
);
// {id: 5, nome: 'João Silva', email: 'joao@example.com', role: 'aluno', turma_id: 1}
```

**Parâmetros:**
- `nome` (string): Nome do usuário
- `email` (string): Email único
- `password` (string): Senha em texto plano
- `role` (string): 'aluno', 'professor' ou 'admin' (default: 'aluno')
- `turma_id` (number): ID da turma (opcional)

**Retorna:**
- Promise<{id, nome, email, role, turma_id}>

**Erros:**
- "Email já registrado" se email já existe

#### 4. `authenticateUser(email, password)`

Autentica um usuário.

```javascript
const user = await authenticateUser('joao@example.com', 'senha123');
// {id: 5, nome: 'João Silva', email: 'joao@example.com', role: 'aluno', turma_id: 1}
// ou null se credenciais inválidas
```

**Parâmetros:**
- `email` (string): Email do usuário
- `password` (string): Senha em texto plano

**Retorna:**
- Promise<{id, nome, email, role, turma_id} | null>

#### 5. `getUserById(userId)`

Busca um usuário por ID.

```javascript
const user = await getUserById(5);
// {id: 5, nome: 'João Silva', email: 'joao@example.com', role: 'aluno', turma_id: 1}
```

**Parâmetros:**
- `userId` (number): ID do usuário

**Retorna:**
- Promise<{id, nome, email, role, turma_id} | null>

#### 6. `requireAuth(req, res, next)`

Middleware que verifica autenticação.

```javascript
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.session.user });
});
```

**Uso:** Middleware Express

#### 7. `requireRole(...roles)`

Middleware que verifica role específica.

```javascript
app.delete('/api/admin/users/:id', 
  requireRole('admin'), 
  (req, res) => {
    // Apenas admin pode deletar usuários
  }
);
```

**Uso:** Middleware Express

## 🔗 Endpoints de Autenticação

### POST /api/admin/login

Autentica um usuário como administrador.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "senha123"
}
```

**Response (sucesso):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso.",
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@example.com",
    "role": "admin",
    "turma_id": null
  }
}
```

**Response (erro):**
```json
{
  "error": "Email ou senha inválidos."
}
```

**Status HTTP:**
- 200: Sucesso
- 400: Email ou senha faltando
- 401: Credenciais inválidas
- 403: Usuário não é admin
- 500: Erro do servidor

### POST /api/admin/logout

Faz logout do usuário.

**Request:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso."
}
```

### GET /api/admin/status

Verifica status de autenticação.

**Response (autenticado):**
```json
{
  "authenticated": true,
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@example.com",
    "role": "admin",
    "turma_id": null
  }
}
```

**Response (não autenticado):**
```json
{
  "authenticated": false,
  "user": null
}
```

### POST /api/auth/register

Registra um novo usuário.

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "turma_id": 1
}
```

**Response (sucesso):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso.",
  "user": {
    "id": 5,
    "nome": "João Silva",
    "email": "joao@example.com",
    "role": "aluno",
    "turma_id": 1
  }
}
```

**Response (erro):**
```json
{
  "error": "Email já registrado"
}
```

### GET /api/auth/me

Retorna dados do usuário autenticado.

**Requer:** Autenticação (middleware `requireAuth`)

**Response:**
```json
{
  "user": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@example.com",
    "role": "admin",
    "turma_id": null
  }
}
```

## 🔄 Fluxos de Uso

### Fluxo 1: Login no Painel Admin

```
1. Usuário acessa /admin
2. Vê formulário de login
3. Insere email e senha
4. Clica "Entrar"
5. JavaScript envia POST /api/admin/login
6. Servidor valida credenciais
7. Se válido:
   - Cria sessão
   - Retorna {success: true}
   - JavaScript redireciona para dashboard
8. Se inválido:
   - Retorna {error: "..."}
   - Mostra mensagem de erro
```

### Fluxo 2: Criar Novo Usuário Admin

```sql
-- 1. Inserir usuário no banco
INSERT INTO users (nome, email, password_hash, role, ativo)
VALUES (
  'Novo Admin',
  'novo@example.com',
  '$2b$10$...',  -- Hash bcrypt
  'admin',
  TRUE
);

-- 2. Usuário pode fazer login com email + senha
```

### Fluxo 3: Alterar Senha de Usuário

```javascript
// 1. Gerar novo hash
const newHash = await hashPassword('nova_senha');

// 2. Atualizar no banco
UPDATE users SET password_hash = ? WHERE id = ?

// 3. Usuário pode fazer login com nova senha
```

### Fluxo 4: Desativar Usuário

```sql
-- Usuário não pode mais fazer login
UPDATE users SET ativo = FALSE WHERE id = 1;
```

## 🔒 Segurança

### Boas Práticas Implementadas

1. **Bcrypt com 10 rounds**: Senhas são criptografadas com custo computacional alto
2. **Sem texto plano**: Senhas nunca são armazenadas em texto plano
3. **Sessão segura**: Cookies com `httpOnly` e `sameSite`
4. **HTTPS em produção**: `secure: true` quando `NODE_ENV=production`
5. **Verificação de role**: Apenas admins acessam o painel
6. **Atualização de último login**: Rastreamento de atividade

### Recomendações Adicionais

1. **Usar HTTPS sempre** em produção
2. **Renovar SESSION_SECRET** regularmente
3. **Implementar rate limiting** em `/api/admin/login`
4. **Adicionar 2FA** para contas admin
5. **Auditar logins** com IP e user-agent
6. **Expirar sessões** após inatividade

## 🐛 Troubleshooting

### Erro: "Email ou senha inválidos"

**Causas:**
- Email não existe no banco
- Senha está incorreta
- Usuário está desativado (`ativo = FALSE`)

**Solução:**
```sql
-- Verificar usuário
SELECT id, email, role, ativo FROM users WHERE email = 'seu_email@example.com';

-- Se não existe, criar:
-- Use a função registerUser() ou insira manualmente com hash bcrypt
```

### Erro: "Permissão insuficiente"

**Causa:** Usuário não tem role `admin`

**Solução:**
```sql
-- Promover para admin
UPDATE users SET role = 'admin' WHERE id = 1;
```

### Erro: "Autenticação necessária"

**Causa:** Usuário não está autenticado ou sessão expirou

**Solução:**
1. Fazer login novamente
2. Verificar se cookies estão habilitados
3. Verificar `SESSION_SECRET` no `.env`

### Erro: "Email já registrado"

**Causa:** Email já existe no banco

**Solução:**
```sql
-- Usar outro email ou deletar usuário antigo
DELETE FROM users WHERE email = 'antigo@example.com';
```

### Sessão expira muito rápido

**Causa:** `maxAge` em `session` é muito pequeno

**Solução:**
```javascript
// Aumentar em server.js
cookie: {
  maxAge: 1000 * 60 * 60 * 24  // 24 horas em vez de 4
}
```

## 📊 Exemplos de Consultas SQL

### Listar todos os admins

```sql
SELECT id, nome, email, criado_em FROM users WHERE role = 'admin';
```

### Contar logins por usuário

```sql
SELECT nome, email, COUNT(*) as logins FROM users 
GROUP BY id 
ORDER BY logins DESC;
```

### Usuários inativos

```sql
SELECT id, nome, email, ativo FROM users WHERE ativo = FALSE;
```

### Último login de cada usuário

```sql
SELECT nome, email, ultimo_login_em FROM users 
ORDER BY ultimo_login_em DESC;
```

---

**Última atualização:** Maio 2026
