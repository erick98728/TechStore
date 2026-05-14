# Guia de Instalação - SETI 2026

Instruções passo a passo para configurar o sistema SETI 2026 em seu ambiente.

## 📋 Pré-requisitos

- **Node.js** 14+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (incluído com Node.js)
- **MySQL** 5.7+ ou **MariaDB** ([Download](https://www.mysql.com/downloads/))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Instalação Rápida

### 1. Clonar o Repositório

```bash
git clone https://github.com/erick98728/TechStore.git
cd TechStore
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env  # ou use seu editor favorito
```

**Variáveis obrigatórias:**
- `DB_HOST`: Host do MySQL (geralmente `localhost`)
- `DB_USER`: Usuário MySQL (geralmente `root`)
- `DB_PASSWORD`: Senha MySQL
- `DB_NAME`: Nome do banco de dados (ex: `seti_2026`)
- `SESSION_SECRET`: Valor aleatório para sessões

### 4. Inicializar Banco de Dados

```bash
# Executar script de setup
node setup-db.js
```

Este script irá:
- ✅ Criar o banco de dados
- ✅ Criar todas as tabelas
- ✅ Carregar dados iniciais
- ✅ Criar usuário admin padrão

**Credenciais padrão:**
- Email: `admin@seti2026.local`
- Senha: `admin123`

### 5. Iniciar o Servidor

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Ou produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 🔧 Configuração Detalhada

### Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seti_2026

# Sessão (gere com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=abc123def456...

# OpenRouter (opcional, para chat com IA)
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=openrouter/free

# Admin (fallback)
ADMIN_PASSWORD=sua_senha_admin

# Site
SITE_URL=http://localhost:3000
APP_NAME=SETI 2026
```

### Gerar SESSION_SECRET Seguro

```bash
# Linux/Mac
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Ou use um gerador online: https://www.random.org/strings/
```

### Configurar MySQL

#### No Windows (XAMPP)

1. Abra XAMPP Control Panel
2. Clique em "Start" para Apache e MySQL
3. MySQL estará em `localhost:3306`
4. Usuário padrão: `root` (sem senha)

#### No Linux

```bash
# Instalar MySQL
sudo apt-get install mysql-server

# Iniciar serviço
sudo systemctl start mysql

# Conectar
mysql -u root -p
```

#### No Mac (Homebrew)

```bash
# Instalar
brew install mysql

# Iniciar
brew services start mysql

# Conectar
mysql -u root
```

## 🧪 Testando a Instalação

### 1. Verificar Banco de Dados

```bash
# Conectar ao MySQL
mysql -u root -p

# Dentro do MySQL
USE seti_2026;
SHOW TABLES;
SELECT COUNT(*) FROM users;
```

### 2. Testar Autenticação

```bash
# Fazer login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@seti2026.local",
    "password": "admin123"
  }'

# Resposta esperada:
# {
#   "success": true,
#   "message": "Login realizado com sucesso.",
#   "user": {...}
# }
```

### 3. Testar Chat

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Qual é a data da SETI 2026?"}'
```

### 4. Acessar Painel Admin

1. Abra `http://localhost:3000/admin` no navegador
2. Insira as credenciais padrão
3. Você deve ver o dashboard

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED 127.0.0.1:3306"

**Problema:** MySQL não está rodando

**Solução:**
```bash
# Iniciar MySQL
sudo systemctl start mysql  # Linux
brew services start mysql   # Mac
# Ou use XAMPP Control Panel no Windows
```

### Erro: "Access denied for user 'root'@'localhost'"

**Problema:** Senha MySQL incorreta

**Solução:**
1. Verifique a senha em `.env`
2. Resete a senha MySQL se necessário:
   ```bash
   mysql -u root
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'nova_senha';
   ```

### Erro: "Unknown database 'seti_2026'"

**Problema:** Banco de dados não foi criado

**Solução:**
```bash
# Executar setup novamente
node setup-db.js
```

### Erro: "Cannot find module 'bcrypt'"

**Problema:** Dependências não instaladas

**Solução:**
```bash
npm install
# Se ainda não funcionar:
npm install bcrypt --save
```

### Erro: "ENOENT: no such file or directory"

**Problema:** Arquivo de configuração não encontrado

**Solução:**
```bash
# Verificar se está no diretório correto
pwd
# Deve ser: /caminho/para/TechStore

# Verificar se .env existe
ls -la .env
```

## 📦 Scripts npm

```bash
# Iniciar em desenvolvimento
npm run dev

# Iniciar em produção
npm start

# Setup do banco de dados
node setup-db.js

# Listar scripts disponíveis
npm run
```

## 🔒 Segurança em Produção

### Antes de Colocar em Produção

1. **Alterar senha do admin:**
   ```sql
   UPDATE users SET password_hash = '$2b$10$...' WHERE role = 'admin';
   ```

2. **Gerar novo SESSION_SECRET:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Configurar HTTPS:**
   - Use um proxy reverso (Nginx, Apache)
   - Obtenha certificado SSL (Let's Encrypt)

4. **Usar variáveis de ambiente seguras:**
   - Nunca commitar `.env` no Git
   - Usar secrets do servidor

5. **Configurar NODE_ENV:**
   ```env
   NODE_ENV=production
   ```

6. **Implementar rate limiting:**
   ```bash
   npm install express-rate-limit
   ```

7. **Adicionar CORS se necessário:**
   ```bash
   npm install cors
   ```

## 🚀 Deploy

### Replit

1. Conectar repositório GitHub
2. Configurar variáveis de ambiente em "Secrets"
3. Executar `node setup-db.js` no console
4. Clicar em "Run"

### Heroku

```bash
# Instalar Heroku CLI
npm install -g heroku

# Login
heroku login

# Criar app
heroku create seu-app-name

# Configurar variáveis
heroku config:set DB_HOST=seu-host
heroku config:set DB_USER=seu-user
# ... etc

# Deploy
git push heroku main
```

### Railway/Render

1. Conectar repositório GitHub
2. Adicionar variáveis de ambiente
3. Configurar banco de dados MySQL
4. Deploy automático

## 📚 Próximos Passos

1. Ler [README.md](./README.md) para visão geral
2. Ler [AUTHENTICATION.md](./AUTHENTICATION.md) para autenticação
3. Explorar o painel admin em `http://localhost:3000/admin`
4. Customizar dados iniciais em `database/seed.sql`
5. Adicionar mais usuários conforme necessário

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs do servidor
2. Consultar [Troubleshooting](#troubleshooting)
3. Abrir issue no GitHub
4. Verificar documentação em [README.md](./README.md)

---

**Última atualização:** Maio 2026
