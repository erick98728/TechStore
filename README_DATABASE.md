# SETI 2026 - Documentação de Banco de Dados

Este documento fornece uma guia completa sobre a integração de banco de dados MySQL no projeto TechStore para o evento SETI 2026.

## 📋 Índice

1. [Instalação e Configuração](#instalação-e-configuração)
2. [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
3. [API RESTful](#api-restful)
4. [Painel Administrativo](#painel-administrativo)
5. [Exemplos de Uso](#exemplos-de-uso)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 14+
- MySQL 5.7+ ou MariaDB 10.3+
- npm ou yarn

### 1. Instalar Dependências

```bash
npm install
```

Isso instalará o pacote `mysql2` necessário para conectar ao banco de dados.

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=seti_2026
DB_PORT=3306

# Configuração do Painel Administrativo
ADMIN_PASSWORD=sua_senha_admin_aqui

# OpenRouter (para o chat)
OPENROUTER_API_KEY=sua_chave_aqui
```

**⚠️ Importante:** Nunca faça commit do arquivo `.env` com valores reais. Use apenas o `.env.example` no repositório.

### 3. Criar o Banco de Dados

Execute os scripts SQL na seguinte ordem:

```bash
# Conectar ao MySQL
mysql -u root -p

# Dentro do MySQL, executar:
CREATE DATABASE seti_2026;
USE seti_2026;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

Ou em uma única linha:

```bash
mysql -u root -p seti_2026 < database/schema.sql
mysql -u root -p seti_2026 < database/seed.sql
```

### 4. Iniciar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

---

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### 1. **turmas**

Armazena informações das turmas de Informática que participam do evento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `nome` | VARCHAR(100) | Nome da turma (ex: "1ª Informática A") |
| `ano` | INT | Ano do curso (1-4) |
| `curso` | VARCHAR(100) | Nome do curso ("Informática") |
| `periodo` | VARCHAR(50) | Período ("Integral", "Matutino", etc) |
| `criado_em` | TIMESTAMP | Data de criação |

**Exemplo:**
```sql
SELECT * FROM turmas WHERE ano = 1;
```

#### 2. **palestrantes**

Informações dos palestrantes que ministram as palestras.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `nome` | VARCHAR(100) | Nome completo |
| `area` | VARCHAR(100) | Área de atuação |
| `mini_bio` | TEXT | Biografia resumida |
| `foto_url` | VARCHAR(255) | URL da foto |
| `instagram` | VARCHAR(100) | Usuário Instagram |
| `linkedin` | VARCHAR(100) | Usuário LinkedIn |
| `status` | ENUM | Status: 'aguardando confirmação', 'confirmado', 'cancelado' |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Data da última atualização |

**Exemplo:**
```sql
SELECT * FROM palestrantes WHERE status = 'confirmado';
```

#### 3. **programacao**

Agenda de palestras do evento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `data_evento` | DATE | Data da palestra |
| `dia_semana` | VARCHAR(20) | Dia da semana |
| `titulo` | VARCHAR(200) | Título da palestra |
| `turma` | VARCHAR(100) | Turma(s) participante(s) |
| `horario_inicio` | TIME | Horário de início |
| `horario_fim` | TIME | Horário de término |
| `palestrante_id` | INT | FK para palestrantes |
| `status_palestrante` | VARCHAR(50) | Status da confirmação |
| `descricao` | TEXT | Descrição da palestra |
| `ordem` | INT | Ordem de apresentação |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Data da última atualização |

**Exemplo:**
```sql
SELECT * FROM programacao WHERE data_evento = '2026-08-12' ORDER BY horario_inicio;
```

#### 4. **gincanas**

Atividades e competições do evento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `nome` | VARCHAR(100) | Nome da gincana |
| `descricao` | TEXT | Descrição detalhada |
| `regras` | TEXT | Regras da atividade |
| `icone` | VARCHAR(50) | Ícone ou emoji |
| `ativo` | BOOLEAN | Se está ativa (1/0) |
| `ordem` | INT | Ordem de exibição |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Data da última atualização |

**Exemplo:**
```sql
SELECT * FROM gincanas WHERE ativo = 1 ORDER BY ordem;
```

#### 5. **noticias**

Comunicados e notícias do evento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `titulo` | VARCHAR(200) | Título da notícia |
| `resumo` | TEXT | Resumo da notícia |
| `conteudo` | TEXT | Conteúdo completo |
| `imagem_url` | VARCHAR(255) | URL da imagem |
| `publicado` | BOOLEAN | Se está publicada (1/0) |
| `criado_em` | TIMESTAMP | Data de criação |
| `atualizado_em` | TIMESTAMP | Data da última atualização |

**Exemplo:**
```sql
SELECT * FROM noticias WHERE publicado = 1 ORDER BY criado_em DESC;
```

#### 6. **duvidas**

Dúvidas enviadas pelos alunos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `nome` | VARCHAR(100) | Nome do aluno |
| `email` | VARCHAR(100) | Email para contato |
| `turma` | VARCHAR(100) | Turma do aluno |
| `mensagem` | TEXT | Conteúdo da dúvida |
| `resposta` | TEXT | Resposta do admin |
| `respondida` | BOOLEAN | Se foi respondida (1/0) |
| `criado_em` | TIMESTAMP | Data de criação |
| `respondido_em` | TIMESTAMP | Data da resposta |

**Exemplo:**
```sql
SELECT * FROM duvidas WHERE respondida = 0 ORDER BY criado_em;
```

#### 7. **pontuacao_gincanas**

Placar de pontuação das gincanas por turma.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `turma_id` | INT | FK para turmas |
| `gincana_id` | INT | FK para gincanas |
| `pontos` | INT | Pontos obtidos |
| `observacao` | TEXT | Observações |
| `criado_em` | TIMESTAMP | Data de criação |

**Exemplo:**
```sql
SELECT t.nome, g.nome, p.pontos FROM pontuacao_gincanas p
JOIN turmas t ON p.turma_id = t.id
JOIN gincanas g ON p.gincana_id = g.id
ORDER BY p.pontos DESC;
```

#### 8. **penalizacoes**

Tipos de penalizações e suas pontuações.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID único (auto-incremento) |
| `turma_id` | INT | FK para turmas |
| `motivo` | VARCHAR(200) | Motivo da penalização |
| `pontos_perdidos` | INT | Pontos descontados |
| `observacao` | TEXT | Observações |
| `criado_em` | TIMESTAMP | Data de criação |

**Exemplo:**
```sql
SELECT * FROM penalizacoes WHERE pontos_perdidos > 50 ORDER BY pontos_perdidos DESC;
```

---

## 🔌 API RESTful

### Autenticação

As rotas administrativas (POST, PUT, DELETE) requerem autenticação via header HTTP:

```
x-admin-password: sua_senha_admin_aqui
```

### Endpoints Públicos (GET)

Estes endpoints podem ser acessados sem autenticação.

#### Programação

```
GET /api/programacao
```

Retorna lista de todas as palestras.

**Resposta:**
```json
[
  {
    "id": 1,
    "data_evento": "2026-08-10",
    "dia_semana": "Segunda-feira",
    "titulo": "IA: benefícios e malefícios na atualidade",
    "turma": "1ª Informática A/B",
    "horario_inicio": "19:30:00",
    "horario_fim": "21:15:00",
    "status_palestrante": "aguardando confirmação"
  }
]
```

```
GET /api/programacao/:id
```

Retorna detalhes de uma palestra específica.

#### Palestrantes

```
GET /api/palestrantes
```

Retorna lista de palestrantes confirmados.

```
GET /api/palestrantes/:id
```

Retorna detalhes de um palestrante.

#### Gincanas

```
GET /api/gincanas
```

Retorna lista de gincanas ativas.

```
GET /api/gincanas/:id
```

Retorna detalhes de uma gincana.

#### Notícias

```
GET /api/noticias
```

Retorna lista de notícias publicadas.

```
GET /api/noticias/:id
```

Retorna detalhes de uma notícia.

#### Turmas

```
GET /api/turmas
```

Retorna lista de todas as turmas.

#### Pontuação

```
GET /api/pontuacao
```

Retorna placar de pontuação das gincanas.

**Resposta:**
```json
[
  {
    "turma": "1ª Informática A",
    "pontos_totais": 250,
    "gincanas": [
      {
        "gincana": "Passa ou Repassa",
        "pontos": 100
      }
    ]
  }
]
```

#### Dúvidas (Pública)

```
POST /api/duvidas
```

Registra uma nova dúvida.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "turma": "1ª Informática A",
  "mensagem": "Como faço para me inscrever?"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Dúvida registrada com sucesso",
  "id": 1
}
```

### Endpoints Administrativos (Protegidos)

Todos os endpoints administrativos requerem o header `x-admin-password`.

#### Programação

```
GET /api/admin/programacao
POST /api/admin/programacao
PUT /api/admin/programacao/:id
DELETE /api/admin/programacao/:id
```

#### Palestrantes

```
GET /api/admin/palestrantes
POST /api/admin/palestrantes
PUT /api/admin/palestrantes/:id
DELETE /api/admin/palestrantes/:id
```

#### Gincanas

```
GET /api/admin/gincanas
POST /api/admin/gincanas
PUT /api/admin/gincanas/:id
DELETE /api/admin/gincanas/:id
```

#### Notícias

```
GET /api/admin/noticias
POST /api/admin/noticias
PUT /api/admin/noticias/:id
DELETE /api/admin/noticias/:id
```

#### Turmas

```
GET /api/admin/turmas
POST /api/admin/turmas
PUT /api/admin/turmas/:id
DELETE /api/admin/turmas/:id
```

#### Pontuação

```
GET /api/admin/pontuacao
POST /api/admin/pontuacao
PUT /api/admin/pontuacao/:id
DELETE /api/admin/pontuacao/:id
```

#### Dúvidas

```
GET /api/admin/duvidas
```

---

## 🎛️ Painel Administrativo

### Acessar o Painel

Acesse `http://localhost:3000/admin/` no navegador.

### Login

1. Insira a senha de admin (configurada em `ADMIN_PASSWORD` no `.env`)
2. Clique em "Entrar"

### Funcionalidades

O painel oferece CRUD completo para:

- **Programação:** Criar, editar e deletar palestras
- **Palestrantes:** Gerenciar informações dos palestrantes
- **Gincanas:** Configurar atividades e competições
- **Notícias:** Publicar comunicados
- **Turmas:** Gerenciar turmas participantes
- **Pontuação:** Registrar e atualizar placar
- **Dúvidas:** Visualizar perguntas dos alunos

---

## 📝 Exemplos de Uso

### 1. Criar uma Palestra

```bash
curl -X POST http://localhost:3000/api/admin/programacao \
  -H "Content-Type: application/json" \
  -H "x-admin-password: sua_senha_admin_aqui" \
  -d '{
    "data_evento": "2026-08-10",
    "dia_semana": "Segunda-feira",
    "titulo": "IA: benefícios e malefícios",
    "turma": "1ª Informática A/B",
    "horario_inicio": "19:30",
    "horario_fim": "21:15",
    "status_palestrante": "aguardando confirmação",
    "descricao": "Palestra sobre inteligência artificial"
  }'
```

### 2. Registrar Pontuação

```bash
curl -X POST http://localhost:3000/api/admin/pontuacao \
  -H "Content-Type: application/json" \
  -H "x-admin-password: sua_senha_admin_aqui" \
  -d '{
    "turma_id": 1,
    "gincana_id": 1,
    "pontos": 100,
    "observacao": "Vencedora da gincana Passa ou Repassa"
  }'
```

### 3. Publicar Notícia

```bash
curl -X POST http://localhost:3000/api/admin/noticias \
  -H "Content-Type: application/json" \
  -H "x-admin-password: sua_senha_admin_aqui" \
  -d '{
    "titulo": "SETI 2026 - Inscrições Abertas",
    "resumo": "Participe do maior evento de tecnologia da escola",
    "conteudo": "Todas as turmas de Informática estão convidadas...",
    "publicado": true
  }'
```

### 4. Consultar Placar

```bash
curl -X GET http://localhost:3000/api/pontuacao
```

### 5. Enviar Dúvida

```bash
curl -X POST http://localhost:3000/api/duvidas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria@example.com",
    "turma": "2ª Informática B",
    "mensagem": "Qual é o horário de chegada no dia do evento?"
  }'
```

---

## 🔒 Segurança

### Boas Práticas

1. **Nunca exponha a senha de admin** no código ou repositório
2. **Use HTTPS em produção** para proteger a senha em trânsito
3. **Altere a senha padrão** imediatamente após a instalação
4. **Implemente rate limiting** para proteger contra força bruta
5. **Valide todos os inputs** no servidor (já implementado)

### Melhorias Futuras

- Implementar JWT para autenticação mais robusta
- Adicionar logs de auditoria
- Implementar 2FA
- Usar bcrypt para hash de senhas

---

## 🐛 Troubleshooting

### Erro: "Banco de dados indisponível"

**Solução:**
1. Verifique se MySQL está rodando: `mysql -u root -p`
2. Confirme as credenciais em `.env`
3. Verifique se o banco de dados foi criado: `SHOW DATABASES;`

### Erro: "Senha de admin não configurada"

**Solução:**
1. Adicione `ADMIN_PASSWORD` ao arquivo `.env`
2. Reinicie o servidor

### Erro: "CORS ou conexão recusada"

**Solução:**
1. Verifique se o servidor está rodando na porta correta
2. Confirme que as rotas estão registradas em `server.js`
3. Verifique os logs do servidor

### Erro: "Tabela não existe"

**Solução:**
1. Execute novamente: `mysql -u root -p seti_2026 < database/schema.sql`
2. Verifique se está usando o banco correto: `USE seti_2026;`

---

## 📚 Referências

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [Node.js mysql2 Package](https://github.com/sidorares/node-mysql2)

---

**Última atualização:** Maio 2026  
**Versão:** 1.0.0
