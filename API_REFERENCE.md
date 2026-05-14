# Referência de API - SETI 2026

Documentação completa de todos os endpoints da API REST.

## 📖 Índice

1. [Autenticação](#autenticação)
2. [Programação](#programação)
3. [Palestrantes](#palestrantes)
4. [Gincanas](#gincanas)
5. [Notícias](#notícias)
6. [Turmas](#turmas)
7. [Dúvidas](#dúvidas)
8. [Penalizações](#penalizações)
9. [Pontuação](#pontuação)
10. [Chat](#chat)

## 🔐 Autenticação

Todos os endpoints administrativos requerem autenticação. Use cookies de sessão.

### POST /api/admin/login

Autentica um usuário.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "senha123"
}
```

**Response (200):**
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

**Erros:**
- 400: Email ou senha faltando
- 401: Credenciais inválidas
- 403: Usuário não é admin
- 500: Erro do servidor

---

### POST /api/admin/logout

Faz logout do usuário.

**Request:**
```json
{}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout realizado com sucesso."
}
```

---

### GET /api/admin/status

Verifica status de autenticação.

**Response (200):**
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

---

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

**Response (200):**
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

---

### GET /api/auth/me

Retorna dados do usuário autenticado.

**Requer:** Autenticação

**Response (200):**
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

---

## 📅 Programação

### GET /api/admin/programacao

Lista todas as palestras/eventos.

**Query Parameters:**
- Nenhum

**Response (200):**
```json
[
  {
    "id": 1,
    "data_evento": "2026-08-10",
    "dia_semana": "segunda",
    "titulo": "IA: benefícios e malefícios",
    "turma": "1ª A/B",
    "horario_inicio": "19:30",
    "horario_fim": "21:15",
    "palestrante_id": 1,
    "status_palestrante": "confirmado",
    "descricao": "Palestra sobre IA",
    "ordem": 1
  }
]
```

---

### POST /api/admin/programacao

Cria novo evento.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "data_evento": "2026-08-10",
  "dia_semana": "segunda",
  "titulo": "IA: benefícios e malefícios",
  "turma": "1ª A/B",
  "horario_inicio": "19:30",
  "horario_fim": "21:15",
  "palestrante_id": 1,
  "status_palestrante": "confirmado",
  "descricao": "Palestra sobre IA",
  "ordem": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "data_evento": "2026-08-10",
  ...
}
```

---

### PUT /api/admin/programacao/:id

Atualiza um evento.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "titulo": "IA: novo título",
  "descricao": "Descrição atualizada"
}
```

**Response (200):**
```json
{
  "id": 1,
  "titulo": "IA: novo título",
  ...
}
```

---

### DELETE /api/admin/programacao/:id

Deleta um evento.

**Requer:** Autenticação + Admin

**Response (200):**
```json
{
  "success": true,
  "message": "Registro deletado com sucesso."
}
```

---

## 🎤 Palestrantes

### GET /api/admin/palestrantes

Lista todos os palestrantes.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Guilherme Rufino",
    "area": "Tecnologia Empresarial",
    "mini_bio": "Especialista em...",
    "foto_url": "https://example.com/foto.jpg",
    "instagram": "@guilherme",
    "linkedin": "linkedin.com/in/guilherme",
    "status": "confirmado"
  }
]
```

---

### POST /api/admin/palestrantes

Cria novo palestrante.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "nome": "Novo Palestrante",
  "area": "Tecnologia",
  "mini_bio": "Bio curta",
  "foto_url": "https://example.com/foto.jpg",
  "instagram": "@novo",
  "linkedin": "linkedin.com/in/novo",
  "status": "aguardando confirmação"
}
```

---

### PUT /api/admin/palestrantes/:id

Atualiza palestrante.

**Requer:** Autenticação + Admin

---

### DELETE /api/admin/palestrantes/:id

Deleta palestrante.

**Requer:** Autenticação + Admin

---

## 🎮 Gincanas

### GET /api/admin/gincanas

Lista todas as gincanas.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Passa ou Repassa",
    "descricao": "Jogo de perguntas e respostas",
    "regras": "10 perguntas em níveis de dificuldade",
    "icone": "🎯",
    "ordem": 1,
    "ativo": true
  }
]
```

---

### POST /api/admin/gincanas

Cria nova gincana.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "nome": "Nova Gincana",
  "descricao": "Descrição",
  "regras": "Regras",
  "icone": "🎮",
  "ordem": 1,
  "ativo": true
}
```

---

### PUT /api/admin/gincanas/:id

Atualiza gincana.

**Requer:** Autenticação + Admin

---

### DELETE /api/admin/gincanas/:id

Deleta gincana.

**Requer:** Autenticação + Admin

---

## 📰 Notícias

### GET /api/admin/noticias

Lista todas as notícias.

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "SETI 2026 confirmada",
    "resumo": "A SETI 2026 foi oficialmente confirmada",
    "conteudo": "Conteúdo completo da notícia",
    "imagem_url": "https://example.com/imagem.jpg",
    "publicado": true,
    "criado_em": "2026-05-14T10:00:00Z"
  }
]
```

---

### POST /api/admin/noticias

Cria nova notícia.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "titulo": "Nova Notícia",
  "resumo": "Resumo da notícia",
  "conteudo": "Conteúdo completo",
  "imagem_url": "https://example.com/imagem.jpg",
  "publicado": true
}
```

---

### PUT /api/admin/noticias/:id

Atualiza notícia.

**Requer:** Autenticação + Admin

---

### DELETE /api/admin/noticias/:id

Deleta notícia.

**Requer:** Autenticação + Admin

---

## 👥 Turmas

### GET /api/admin/turmas

Lista todas as turmas.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "4ª Informática A",
    "ano": 4,
    "curso": "Informática",
    "periodo": "Integral"
  }
]
```

---

### POST /api/admin/turmas

Cria nova turma.

**Requer:** Autenticação + Admin

---

### PUT /api/admin/turmas/:id

Atualiza turma.

**Requer:** Autenticação + Admin

---

### DELETE /api/admin/turmas/:id

Deleta turma.

**Requer:** Autenticação + Admin

---

## ❓ Dúvidas

### GET /api/admin/duvidas

Lista todas as dúvidas.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "turma": "4ª A",
    "mensagem": "Qual é a data da SETI?",
    "respondida": false,
    "criado_em": "2026-05-14T10:00:00Z"
  }
]
```

---

### POST /api/duvidas

Submete uma nova dúvida (público).

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "turma": "4ª A",
  "mensagem": "Qual é a data da SETI?"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Dúvida recebida com sucesso.",
  "id": 1
}
```

---

### PUT /api/admin/duvidas/:id

Marca dúvida como respondida.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "respondida": true
}
```

---

### DELETE /api/admin/duvidas/:id

Deleta dúvida.

**Requer:** Autenticação + Admin

---

## ⚠️ Penalizações

### GET /api/admin/tipos_penalizacoes

Lista tipos de penalizações.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Dormir na palestra",
    "descricao": "Aluno dormindo durante palestra",
    "pontos_padrao": 95,
    "ativo": true
  }
]
```

---

### POST /api/admin/tipos_penalizacoes

Cria tipo de penalização.

**Requer:** Autenticação + Admin

---

### GET /api/admin/penalizacoes

Lista penalizações aplicadas.

**Response (200):**
```json
[
  {
    "id": 1,
    "turma_id": 1,
    "tipo_penalizacao_id": 1,
    "pontos_perdidos": 95,
    "observacao": "Aluno dormiu na palestra de 10/08",
    "criado_em": "2026-08-10T20:00:00Z"
  }
]
```

---

### POST /api/admin/penalizacoes

Aplica nova penalização.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "turma_id": 1,
  "tipo_penalizacao_id": 1,
  "pontos_perdidos": 95,
  "observacao": "Aluno dormiu na palestra"
}
```

---

## 🏆 Pontuação

### GET /api/admin/pontuacao_gincanas

Lista pontuação de gincanas.

**Response (200):**
```json
[
  {
    "id": 1,
    "turma_id": 1,
    "gincana_id": 1,
    "pontos": 50,
    "observacao": "1º lugar em Passa ou Repassa"
  }
]
```

---

### POST /api/admin/pontuacao_gincanas

Adiciona pontos para gincana.

**Requer:** Autenticação + Admin

**Request:**
```json
{
  "turma_id": 1,
  "gincana_id": 1,
  "pontos": 50,
  "observacao": "1º lugar em Passa ou Repassa"
}
```

---

## 💬 Chat

### POST /chat

Envia mensagem ao assistente SETI.

**Request:**
```json
{
  "message": "Qual é a data da SETI 2026?"
}
```

**Response (200):**
```json
{
  "reply": "A SETI 2026 está prevista para 10 a 14 de agosto de 2026, no auditório da E.M. Dr. Leandro Franceschini em Sumaré/SP."
}
```

**Erros:**
- 400: Mensagem inválida
- 500: Erro do servidor ou API key não configurada

---

## 📊 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Autenticação necessária |
| 403 | Forbidden - Permissão insuficiente |
| 404 | Not Found - Recurso não encontrado |
| 500 | Internal Server Error - Erro do servidor |
| 502 | Bad Gateway - Erro da API externa |

---

## 🔄 Padrão de Resposta

Todas as respostas seguem este padrão:

**Sucesso:**
```json
{
  "success": true,
  "message": "Descrição do sucesso",
  "data": {...}
}
```

**Erro:**
```json
{
  "error": "Descrição do erro"
}
```

---

## 🧪 Exemplos de Uso

### Exemplo 1: Login e Listar Programação

```bash
# 1. Login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@example.com",
    "password": "senha123"
  }'

# 2. Listar programação (usando cookies)
curl http://localhost:3000/api/admin/programacao \
  -b cookies.txt
```

### Exemplo 2: Criar Novo Evento

```bash
curl -X POST http://localhost:3000/api/admin/programacao \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "data_evento": "2026-08-10",
    "dia_semana": "segunda",
    "titulo": "Palestra sobre IA",
    "turma": "1ª A/B",
    "horario_inicio": "19:30",
    "horario_fim": "21:15",
    "palestrante_id": 1,
    "status_palestrante": "confirmado",
    "descricao": "Palestra sobre IA",
    "ordem": 1
  }'
```

### Exemplo 3: Chat

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quais são as gincanas da SETI?"
  }'
```

---

## 📝 Notas Importantes

1. **Autenticação**: Use cookies de sessão. Não é necessário enviar token em cada requisição.
2. **CORS**: API não tem CORS habilitado por padrão. Use no mesmo domínio.
3. **Rate Limiting**: Não implementado por padrão. Adicione em produção.
4. **Validação**: Todos os campos são validados no servidor.
5. **Timestamps**: Todos em UTC (ISO 8601).

---

**Última atualização:** Maio 2026
