# Configuração do Banco de Dados - SETI 2026

Este documento descreve como configurar e usar o banco de dados MySQL para o projeto SETI 2026.

## Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```
# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=seti_2026
```

### Descrição das Variáveis

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_HOST` | Endereço do servidor MySQL | `localhost` |
| `DB_PORT` | Porta do servidor MySQL | `3306` |
| `DB_USER` | Usuário do banco de dados | `root` |
| `DB_PASSWORD` | Senha do banco de dados | (vazio) |
| `DB_NAME` | Nome do banco de dados | `seti_2026` |

## Instalação do Banco de Dados

### 1. Instalar MySQL

Se você ainda não tem MySQL instalado, instale conforme seu sistema operacional:

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mysql-server
```

**macOS (com Homebrew):**
```bash
brew install mysql
```

**Windows:**
Baixe o instalador em https://dev.mysql.com/downloads/mysql/

### 2. Criar o Banco de Dados

Conecte-se ao MySQL como root:

```bash
mysql -u root -p
```

Execute os seguintes comandos SQL:

```sql
CREATE DATABASE seti_2026;
USE seti_2026;
```

### 3. Importar o Schema

Execute o arquivo de schema para criar as tabelas:

```bash
mysql -u root -p seti_2026 < database/schema.sql
```

### 4. Importar Dados Iniciais (Opcional)

Execute o arquivo de seed para popular o banco com dados iniciais:

```bash
mysql -u root -p seti_2026 < database/seed.sql
```

## Dependências Node.js

O projeto requer o pacote `mysql2` para conexão com o banco. Adicione ao `package.json`:

```json
{
  "dependencies": {
    "mysql2": "^3.6.0"
  }
}
```

Instale com:

```bash
npm install mysql2
```

## Rotas da API

Após configurar o banco de dados, as seguintes rotas estarão disponíveis:

### Programação

- `GET /api/programacao` - Lista todas as palestras
- `GET /api/programacao/:id` - Detalhes de uma palestra específica

### Palestrantes

- `GET /api/palestrantes` - Lista palestrantes confirmados
- `GET /api/palestrantes/:id` - Detalhes de um palestrante

### Gincanas

- `GET /api/gincanas` - Lista todas as gincanas ativas
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

## Exemplo de Uso

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

## Estrutura das Tabelas

### users
Usuários autenticados no sistema

### turmas
Turmas de Informática participantes do evento

### palestrantes
Informações dos palestrantes

### programacao
Programação de palestras do evento

### gincanas
Descrição das gincanas e atividades

### noticias
Notícias e comunicados do evento

### duvidas
Dúvidas enviadas pelos alunos

### participantes
Participantes, organizadores e convidados

### pontuacao_gincanas
Pontuação das turmas nas gincanas

### penalizacoes
Penalizações e descontos de pontos

## Troubleshooting

### Erro: "Cannot find module 'mysql2'"
Instale o pacote: `npm install mysql2`

### Erro: "Access denied for user 'root'@'localhost'"
Verifique as credenciais no `.env`. Se esqueceu a senha do MySQL, você pode resetá-la conforme seu sistema operacional.

### Erro: "Unknown database 'seti_2026'"
Execute o comando de criação do banco de dados novamente.

## Segurança

**IMPORTANTE:** Nunca coloque credenciais reais do banco de dados no GitHub. Use o arquivo `.env` localmente e adicione `.env` ao `.gitignore`.

Para produção, use variáveis de ambiente do servidor (Heroku, Railway, etc.).

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
