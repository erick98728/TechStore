-- ============================================================================
-- SETI 2026 - Database Seed Data
-- Dados iniciais para o evento
-- ============================================================================

-- Inserir turmas
INSERT IGNORE INTO turmas (nome, ano, curso, periodo) VALUES
('1ª Informática A', 1, 'Informática', 'Integral'),
('1ª Informática B', 1, 'Informática', 'Integral'),
('2ª Informática A', 2, 'Informática', 'Integral'),
('2ª Informática B', 2, 'Informática', 'Integral'),
('2ª Informática C', 2, 'Informática', 'Integral'),
('3ª Informática A', 3, 'Informática', 'Integral'),
('3ª Informática B', 3, 'Informática', 'Integral'),
('3ª Informática C', 3, 'Informática', 'Integral'),
('4ª Informática A', 4, 'Informática', 'Integral'),
('4ª Informática B', 4, 'Informática', 'Integral'),
('4ª Informática C', 4, 'Informática', 'Integral');

-- Inserir palestrante confirmado
INSERT IGNORE INTO palestrantes (nome, area, mini_bio, status) VALUES
('Guilherme Rufino', 'Tecnologia Empresarial', 'Especialista em tecnologia empresarial com experiência em implementação de soluções corporativas.', 'confirmado');

-- Inserir programação (palestras)
INSERT IGNORE INTO programacao (data_evento, dia_semana, titulo, turma, horario_inicio, horario_fim, palestrante_id, status_palestrante, descricao, ordem) VALUES
('2026-08-10', 'Segunda-feira', 'IA: benefícios e malefícios na atualidade', '1ª Informática A/B', '19:30', '21:15', NULL, 'aguardando confirmação', 'Palestra sobre inteligência artificial, seus benefícios e desafios na sociedade atual.', 1),
('2026-08-11', 'Terça-feira', 'Diversidade da informática: quais áreas seguir?', '2ª Informática A/B/C', '19:30', '21:15', NULL, 'aguardando confirmação', 'Exploração das diferentes áreas e especialidades dentro da informática para orientar escolhas de carreira.', 2),
('2026-08-12', 'Quarta-feira', 'Tecnologia empresarial', '3ª Informática A/B/C', '19:30', '21:15', 1, 'confirmado', 'Palestra com Guilherme Rufino sobre implementação de tecnologia em ambientes corporativos.', 3),
('2026-08-13', 'Quinta-feira', 'A tecnologia para o mundo', '1ª, 2ª e 3ª Informática', '19:30', '21:15', NULL, 'aguardando confirmação', 'Reflexão sobre o impacto da tecnologia na sociedade global e seus desafios futuros.', 4),
('2026-08-14', 'Sexta-feira', 'Segmentos para ingressar ao mercado', '4ª Informática A/B/C', '19:30', '21:15', NULL, 'aguardando confirmação', 'Apresentação dos principais segmentos e oportunidades de carreira no mercado de tecnologia.', 5);

-- Inserir gincanas
INSERT IGNORE INTO gincanas (nome, descricao, regras, ativo, ordem) VALUES
('Passa ou Repassa', 'Jogo de perguntas e respostas entre salas em equipes de 3 alunos com 10 perguntas em níveis de dificuldade.', 'Equipes de 3 alunos, 10 perguntas por nível de dificuldade', 1, 1),
('Labirinto', 'Um aluno executa comandos apresentados pela turma. Há níveis fácil, médio e difícil com 10 labirintos por nível e 60 segundos para sair.', 'Níveis: fácil, médio e difícil. 10 labirintos por nível. 60 segundos para sair.', 1, 2),
('Quem Sou Eu?', 'Participante descobre objetos de informática, softwares, sistemas ou tecnologias por descrição do mediador. 30 perguntas disponíveis.', '30 perguntas sobre objetos de informática, softwares e tecnologias', 1, 3),
('Show da Tecnologia', 'Jogo baseado no Show do Milhão com perguntas sobre tecnologia da informação. Participantes têm 20 segundos para responder.', '5 tentativas por turma com 5 alunos diferentes. 20 segundos para responder cada pergunta.', 1, 4),
('Perguntas sobre a palestra do dia', 'Perguntas relacionadas ao tema da palestra ministrada. A turma que responder primeiro e corretamente pontua.', 'Perguntas relacionadas ao tema da palestra. Primeira turma a responder corretamente pontua.', 1, 5);

-- Inserir notícias
INSERT IGNORE INTO noticias (titulo, resumo, conteudo, publicado) VALUES
('SETI 2026 - Semana de Estudos Técnicos em Informática', 'O maior evento técnico do curso de Informática', 'A SETI 2026 será realizada de 10 a 14 de agosto de 2026 no Auditório da Escola Municipal Dr. Leandro Franceschini. O evento reunirá todas as turmas de Informática para palestras, gincanas e atividades técnicas. Organização: 4ª Informática A, B e C. Orientação: Prof. Luís Guilherme.', 1),
('Inscrições abertas para SETI 2026', 'Participe do maior evento de tecnologia da escola', 'Todas as turmas de Informática (1ª, 2ª, 3ª e 4ª) estão convidadas a participar da SETI 2026. Compareça com uniforme e traga sua energia para as competições! Horário das palestras: 19h30 às 21h15. Gincanas após o intervalo.', 1);

-- ============================================================================
-- End of SETI 2026 Database Seed Data
-- ============================================================================
