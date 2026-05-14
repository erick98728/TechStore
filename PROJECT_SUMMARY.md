# Resumo do Projeto - SETI 2026

## 📌 Visão Geral

O **SETI 2026** é um sistema completo de gerenciamento de eventos técnico-escolares, desenvolvido para a Semana de Estudos Técnicos em Informática da E.M. Dr. Leandro Franceschini.

**Status:** ✅ Pronto para produção

## 🎯 Objetivos Alcançados

### ✅ Banco de Dados Robusto
- 12 tabelas MySQL com relacionamentos
- Schema bem definido com constraints
- Dados iniciais carregados
- Suporte a múltiplas entidades (turmas, palestrantes, gincanas, etc.)

### ✅ Autenticação Segura
- Sistema de autenticação com **bcrypt** (10 rounds)
- Roles baseadas em acesso (admin, professor, aluno)
- Sessões seguras com express-session
- Middleware de autorização

### ✅ API REST Completa
- 40+ endpoints funcionais
- CRUD completo para 10 recursos
- Endpoints públicos e protegidos
- Validação de dados

### ✅ Painel Administrativo
- Interface intuitiva
- Gerenciamento de todos os recursos
- Formulários dinâmicos
- Status em tempo real

### ✅ Assistente de IA
- Chat integrado com OpenRouter
- Respostas contextualizadas sobre SETI
- Suporte a perguntas técnicas sobre PHP

### ✅ Documentação Completa
- README.md (visão geral)
- AUTHENTICATION.md (sistema de auth)
- SETUP.md (instalação)
- API_REFERENCE.md (endpoints)
- Este arquivo (resumo)

## 📊 Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                     │
│  - Painel Admin (/admin)                                 │
│  - Site Público (/)                                      │
│  - Chat com IA                                           │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/HTTPS
┌──────────────────┴──────────────────────────────────────┐
│              Express.js Server (Node.js)                 │
│  - Autenticação (bcrypt + sessions)                      │
│  - API REST (/api/*)                                     │
│  - Chat (/chat)                                          │
│  - Arquivos estáticos (/public)                          │
└──────────────────┬──────────────────────────────────────┘
                   │ TCP/IP
┌──────────────────┴──────────────────────────────────────┐
│                  MySQL Database                          │
│  - users, turmas, palestrantes                           │
│  - programacao, gincanas, noticias                       │
│  - duvidas, penalizacoes, pontuacao_gincanas            │
│  - galeria, tipos_penalizacoes                           │
└─────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Arquivos

```
TechStore/
├── server.js                    # Servidor Express principal
├── auth.js                      # Módulo de autenticação
├── setup-db.js                  # Script de inicialização
├── package.json                 # Dependências
├── .env.example                 # Template de variáveis
│
├── database/
│   ├── connection.js            # Conexão MySQL
│   ├── schema.sql               # Definição de tabelas
│   └── seed.sql                 # Dados iniciais
│
├── routes/
│   └── seti-api.js              # Endpoints da API
│
├── public/
│   ├── index.html               # Página inicial
│   ├── admin/
│   │   ├── index.html           # Painel admin
│   │   ├── admin.js             # Lógica do painel
│   │   └── admin.css            # Estilos
│   └── assets/                  # Imagens, ícones
│
└── docs/
    ├── README.md                # Visão geral
    ├── AUTHENTICATION.md        # Sistema de auth
    ├── SETUP.md                 # Instalação
    ├── API_REFERENCE.md         # Endpoints
    └── PROJECT_SUMMARY.md       # Este arquivo
```

## 🔐 Segurança Implementada

| Aspecto | Implementação |
|---------|---------------|
| Senhas | Bcrypt com 10 rounds |
| Sessões | Express-session com cookies httpOnly |
| HTTPS | Suporte em produção |
| Autorização | Middleware de roles |
| Validação | Verificação de entrada |
| SQL Injection | Prepared statements |
| XSS | Escaping de HTML |

## 📊 Banco de Dados

### Tabelas Principais

| Tabela | Registros | Descrição |
|--------|-----------|-----------|
| users | 1+ | Usuários do sistema |
| turmas | 3 | 4ª A, B, C Informática |
| palestrantes | 1+ | Convidados |
| programacao | 5 | Palestras diárias |
| gincanas | 5 | Atividades |
| noticias | 0+ | Publicações |
| duvidas | 0+ | Perguntas públicas |
| participantes | 0+ | Alunos inscritos |
| pontuacao_gincanas | 0+ | Pontos por turma |
| tipos_penalizacoes | 9 | Tipos de penalidades |
| penalizacoes | 0+ | Penalidades aplicadas |
| galeria | 0+ | Fotos do evento |

## 🔗 API Endpoints

### Autenticação (5 endpoints)
- POST /api/admin/login
- POST /api/admin/logout
- GET /api/admin/status
- POST /api/auth/register
- GET /api/auth/me

### Recursos CRUD (40+ endpoints)
- /api/admin/programacao
- /api/admin/palestrantes
- /api/admin/gincanas
- /api/admin/noticias
- /api/admin/turmas
- /api/admin/duvidas
- /api/admin/tipos_penalizacoes
- /api/admin/penalizacoes
- /api/admin/pontuacao_gincanas
- /api/admin/galeria

### Público
- POST /api/duvidas (formulário público)
- POST /chat (assistente IA)

## 🚀 Como Usar

### Instalação Rápida

```bash
# 1. Clonar
git clone https://github.com/erick98728/TechStore.git
cd TechStore

# 2. Instalar dependências
npm install

# 3. Configurar .env
cp .env.example .env
# Editar .env com suas credenciais

# 4. Inicializar banco
node setup-db.js

# 5. Iniciar servidor
npm start
```

### Acessar

- **Site público:** http://localhost:3000
- **Painel admin:** http://localhost:3000/admin
- **Credenciais padrão:** admin@seti2026.local / admin123

## 📈 Fluxo de Pontuação

```
Turma começa com 0 pontos
    ↓
Participa de gincanas → +pontos
    ↓
Comete penalidades → -pontos
    ↓
Pontuação Final = Gincanas - Penalidades
```

### Exemplo

```
Turma 4ª A:
- Passa ou Repassa (1º lugar): +50 pontos
- Labirinto (2º lugar): +30 pontos
- Quem Sou Eu? (1º lugar): +50 pontos
- Penalidade (conversa paralela): -50 pontos
- Penalidade (uniforme): -60 pontos
─────────────────────────────
Total: 50 + 30 + 50 - 50 - 60 = 20 pontos
```

## 🎨 Identidade Visual

### Paleta de Cores
- **Roxo**: #6C3BFF (primária)
- **Lilás**: #B9A7FF (secundária)
- **Azul**: #2364D2 (destaque)
- **Grafite**: #14151F (texto)
- **Branco**: #FFFFFF (fundo)
- **Cinza**: #F4F6FB (neutro)
- **Ciano**: #00CED1 (detalhes)

## 📚 Documentação

| Documento | Conteúdo |
|-----------|----------|
| README.md | Visão geral, estrutura, uso |
| AUTHENTICATION.md | Sistema de auth, funções, endpoints |
| SETUP.md | Instalação passo a passo |
| API_REFERENCE.md | Todos os endpoints com exemplos |
| PROJECT_SUMMARY.md | Este arquivo |

## 🧪 Testes Recomendados

### Autenticação
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@seti2026.local","password":"admin123"}'
```

### Listar Dados
```bash
curl http://localhost:3000/api/admin/programacao
```

### Chat
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Qual é a data da SETI?"}'
```

## 🚀 Deploy

### Opções Recomendadas

1. **Replit** - Mais fácil para começar
2. **Railway** - Bom custo/benefício
3. **Render** - Gratuito com limitações
4. **Heroku** - Tradicional mas pago
5. **VPS** - Máximo controle

### Checklist de Produção

- [ ] NODE_ENV=production
- [ ] SESSION_SECRET alterado
- [ ] Senha admin alterada
- [ ] HTTPS configurado
- [ ] Backups de banco de dados
- [ ] Rate limiting implementado
- [ ] Logs configurados
- [ ] Monitoramento ativo

## 📞 Suporte

### Documentação
- Leia [README.md](./README.md) para visão geral
- Leia [AUTHENTICATION.md](./AUTHENTICATION.md) para auth
- Leia [SETUP.md](./SETUP.md) para instalação
- Leia [API_REFERENCE.md](./API_REFERENCE.md) para endpoints

### Troubleshooting
1. Verificar logs do servidor
2. Verificar variáveis de ambiente
3. Verificar conexão com banco de dados
4. Consultar documentação específica

## 🎓 Próximos Passos

### Melhorias Futuras
- [ ] 2FA para contas admin
- [ ] Rate limiting em endpoints
- [ ] Auditoria de ações
- [ ] Exportar relatórios (PDF/Excel)
- [ ] Notificações por email
- [ ] Dashboard com gráficos
- [ ] Integração com Google Calendar
- [ ] App mobile

### Manutenção
- [ ] Revisar logs regularmente
- [ ] Fazer backups do banco
- [ ] Atualizar dependências
- [ ] Monitorar performance
- [ ] Revisar segurança

## 📊 Estatísticas do Projeto

| Métrica | Valor |
|---------|-------|
| Arquivos de código | 15+ |
| Linhas de código | 3000+ |
| Endpoints da API | 40+ |
| Tabelas do banco | 12 |
| Documentação | 2000+ linhas |
| Commits | 10+ |

## 👥 Organização SETI 2026

**Responsáveis:**
- Ana Clara Magalhães (4ª Informática A)
- Diogo Monteiro (4ª Informática A)
- Julia Carvalho (4ª Informática B)
- Vinicius Aparecido Batista (4ª Informática B)
- Bianca de Brito Leite (4ª Informática C)
- Gustavo Alves de Oliveira (4ª Informática C)

**Orientação:** Prof. Luís Guilherme

## 📅 Cronograma SETI 2026

- **Data:** 10 a 14 de agosto de 2026
- **Local:** Auditório da E.M. Dr. Leandro Franceschini
- **Horário:** 19h30 às 21h15 (diário)
- **Público:** ~400 alunos (4 turmas)

## 📝 Licença

Projeto desenvolvido para o evento SETI 2026 da E.M. Dr. Leandro Franceschini.

## 🔗 Links Úteis

- [GitHub Repository](https://github.com/erick98728/TechStore)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [OpenRouter](https://openrouter.ai/)

---

**Última atualização:** Maio 2026  
**Versão:** 1.0.0  
**Status:** ✅ Pronto para Produção
