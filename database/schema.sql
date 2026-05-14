-- ============================================================================
-- SETI 2026 - Database Schema
-- Semana de Estudos Técnicos em Informática
-- ============================================================================

-- Tabela: users
-- Usuários do sistema (alunos, professores, admin)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('aluno', 'professor', 'admin') NOT NULL DEFAULT 'aluno',
  turma_id INT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_login_em DATETIME,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: turmas
-- Organiza as turmas da escola para o evento SETI
CREATE TABLE IF NOT EXISTS turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  ano INT NOT NULL,
  curso VARCHAR(255) NOT NULL,
  periodo VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: palestrantes
-- Informações dos palestrantes do evento
CREATE TABLE IF NOT EXISTS palestrantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  area VARCHAR(255),
  mini_bio TEXT,
  foto_url VARCHAR(255),
  instagram VARCHAR(255),
  linkedin VARCHAR(255),
  status ENUM('confirmado', 'aguardando confirmação', 'cancelado') NOT NULL DEFAULT 'aguardando confirmação',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: programacao
-- Programação oficial do evento SETI
CREATE TABLE IF NOT EXISTS programacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_evento DATE NOT NULL,
  dia_semana VARCHAR(50) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  turma VARCHAR(255) NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  palestrante_id INT,
  status_palestrante VARCHAR(255),
  descricao TEXT,
  ordem INT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (palestrante_id) REFERENCES palestrantes(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: gincanas
-- Gincanas e atividades do evento
CREATE TABLE IF NOT EXISTS gincanas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  regras TEXT,
  icone VARCHAR(255),
  ordem INT,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: noticias
-- Notícias e comunicados do evento
CREATE TABLE IF NOT EXISTS noticias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  resumo TEXT,
  conteudo TEXT,
  imagem_url VARCHAR(255),
  publicado BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: duvidas
-- Dúvidas enviadas pelos alunos através do formulário
CREATE TABLE IF NOT EXISTS duvidas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  turma VARCHAR(255),
  assunto VARCHAR(255),
  mensagem TEXT NOT NULL,
  resposta TEXT,
  respondida BOOLEAN NOT NULL DEFAULT FALSE,
  respondida_em DATETIME,
  usuario_id INT,
  respondida_por INT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (respondida_por) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: participantes
-- Participantes, organizadores e convidados do evento
CREATE TABLE IF NOT EXISTS participantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  turma_id INT,
  tipo ENUM('aluno', 'organizador', 'palestrante', 'convidado') NOT NULL,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: pontuacao_gincanas
-- Pontuação das turmas nas gincanas
CREATE TABLE IF NOT EXISTS pontuacao_gincanas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turma_id INT NOT NULL,
  gincana_id INT NOT NULL,
  pontos INT NOT NULL DEFAULT 0,
  observacao TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  FOREIGN KEY (gincana_id) REFERENCES gincanas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: tipos_penalizacoes
-- Catálogo de tipos de penalizações disponíveis
CREATE TABLE IF NOT EXISTS tipos_penalizacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  pontos_padrao INT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: penalizacoes
-- Penalizações aplicadas a turmas (ocorrências)
CREATE TABLE IF NOT EXISTS penalizacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  turma_id INT NOT NULL,
  tipo_penalizacao_id INT NOT NULL,
  pontos_perdidos INT NOT NULL,
  observacao TEXT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (turma_id) REFERENCES turmas(id) ON DELETE CASCADE,
  FOREIGN KEY (tipo_penalizacao_id) REFERENCES tipos_penalizacoes(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: galeria
-- Fotos e imagens do evento SETI
CREATE TABLE IF NOT EXISTS galeria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  legenda TEXT,
  imagem_url VARCHAR(255) NOT NULL,
  thumb_url VARCHAR(255),
  alt_text VARCHAR(255),
  categoria VARCHAR(100),
  ordem INT DEFAULT 0,
  publicado BOOLEAN NOT NULL DEFAULT TRUE,
  criado_por INT,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (criado_por) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Índices para melhor performance
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_turma ON users(turma_id);
CREATE INDEX idx_programacao_data ON programacao(data_evento);
CREATE INDEX idx_programacao_palestrante ON programacao(palestrante_id);
CREATE INDEX idx_duvidas_respondida ON duvidas(respondida);
CREATE INDEX idx_noticias_publicado ON noticias(publicado);
CREATE INDEX idx_participantes_turma ON participantes(turma_id);
CREATE INDEX idx_pontuacao_turma ON pontuacao_gincanas(turma_id);
CREATE INDEX idx_pontuacao_gincana ON pontuacao_gincanas(gincana_id);
CREATE INDEX idx_penalizacoes_turma ON penalizacoes(turma_id);
CREATE INDEX idx_penalizacoes_tipo ON penalizacoes(tipo_penalizacao_id);
CREATE INDEX idx_tipos_penalizacoes_ativo ON tipos_penalizacoes(ativo);
CREATE INDEX idx_galeria_categoria ON galeria(categoria);
CREATE INDEX idx_galeria_publicado ON galeria(publicado);
CREATE INDEX idx_galeria_ordem ON galeria(ordem);

-- ============================================================================
-- End of SETI 2026 Database Schema
-- ============================================================================
