const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const openChatCta = document.getElementById('open-chat-cta');
const navChat = document.getElementById('nav-chat');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const quickActions = document.querySelectorAll('.quick-actions button');
const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const backToTop = document.getElementById('back-to-top');
const observedSections = document.querySelectorAll('.section-observe');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const modal = document.getElementById('info-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

const formatTime = (value) => String(value || '').slice(0, 5);

const toggleChat = (open) => {
  if (!chatWidget || !chatInput) return;
  const shouldOpen = typeof open === 'boolean' ? open : chatWidget.classList.contains('hidden');
  chatWidget.classList.toggle('hidden', !shouldOpen);
  if (shouldOpen) chatInput.focus();
};

const closeMenu = () => {
  if (!siteNav || !menuToggle) return;
  siteNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
};

const addMessage = (text, sender) => {
  const bubble = document.createElement('div');
  bubble.className = `message ${sender}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
};

const sendMessage = async (message) => {
  if (!message || !chatMessages) return;

  addMessage(message, 'user');
  chatInput.value = '';

  const typingLabel = 'Digitando...';
  addMessage(typingLabel, 'bot');

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    chatMessages.lastElementChild.remove();

    if (!response.ok) {
      addMessage(data.error || 'Erro ao consultar o assistente.', 'bot');
      return;
    }

    addMessage(data.reply, 'bot');
  } catch (error) {
    chatMessages.lastElementChild.remove();
    addMessage('Falha de conexão. Tente novamente em instantes.', 'bot');
  }
};

const openModal = (title, body) => {
  if (!modal || !modalTitle || !modalBody) return;
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

const bindModalElements = () => {
  document.querySelectorAll('[data-modal-title]').forEach((element) => {
    if (element.dataset.modalBound === 'true') return;
    element.dataset.modalBound = 'true';
    element.addEventListener('click', () => {
      openModal(element.dataset.modalTitle, element.dataset.modalBody || 'Informação indisponível no momento.');
    });
  });

  document.querySelectorAll('[data-gallery-title]').forEach((element) => {
    if (element.dataset.galleryBound === 'true') return;
    element.dataset.galleryBound = 'true';
    element.addEventListener('click', () => {
      openModal(element.dataset.galleryTitle, element.dataset.galleryText || 'Espaço reservado para imagem do evento.');
    });
  });
};

const loadDynamicContent = async () => {
  const schedule = document.querySelector('.schedule.timeline-schedule');
  const activities = document.querySelector('#atividades .activity-grid');
  const noticiasContainer = document.querySelector('#noticias .news-grid');
  const palestrantesContainer = document.querySelector('#palestrantes .speakers-grid');
  const pontuacaoContainer = document.querySelector('#pontuacao .ranking-table');

  try {
    const [programacaoResponse, gincanasResponse, noticiasResponse, palestrantesResponse, pontuacaoResponse] = await Promise.allSettled([
      fetch('/api/programacao'),
      fetch('/api/gincanas'),
      fetch('/api/noticias'),
      fetch('/api/palestrantes'),
      fetch('/api/pontuacao')
    ]);

    // Programação
    if (schedule && programacaoResponse.status === 'fulfilled' && programacaoResponse.value.ok) {
      const programacao = await programacaoResponse.value.json();
      if (Array.isArray(programacao) && programacao.length) {
        schedule.innerHTML = programacao.map((item, index) => {
          const data = `${formatDate(item.data_evento)} · ${item.dia_semana || ''}`.trim();
          const palestrante = item.palestrante_nome || item.status_palestrante || 'aguardando confirmação';
          const body = `${item.descricao || item.titulo}. Turma: ${item.turma || 'não informada'}. Horário: ${formatTime(item.horario_inicio)} às ${formatTime(item.horario_fim)}. Palestrante: ${palestrante}.`;
          return `<article class="schedule-card ${index === 2 ? 'featured' : ''}" data-modal-title="${escapeHtml(item.titulo)}" data-modal-body="${escapeHtml(body)}"><time>${escapeHtml(data)}</time><h3>${escapeHtml(item.titulo)}</h3><p><strong>Turma:</strong> ${escapeHtml(item.turma || 'não informada')}</p><p><strong>Palestrante:</strong> ${escapeHtml(palestrante)}</p></article>`;
        }).join('');
      }
    }

    // Gincanas
    if (activities && gincanasResponse.status === 'fulfilled' && gincanasResponse.value.ok) {
      const gincanas = await gincanasResponse.value.json();
      if (Array.isArray(gincanas) && gincanas.length) {
        activities.innerHTML = gincanas.map((item) => {
          const icon = item.icone || '💡';
          const body = `${item.descricao || ''}${item.regras ? ` Regras: ${item.regras}` : ''}`.trim();
          return `<article data-modal-title="${escapeHtml(item.nome)}" data-modal-body="${escapeHtml(body || 'Atividade da SETI 2026.')}"><span>${escapeHtml(icon)}</span><h3>${escapeHtml(item.nome)}</h3><p>${escapeHtml(item.descricao || 'Atividade da SETI 2026.')}</p></article>`;
        }).join('');
      }
    }

    // Notícias
    if (noticiasContainer && noticiasResponse.status === 'fulfilled' && noticiasResponse.value.ok) {
      const noticias = await noticiasResponse.value.json();
      if (Array.isArray(noticias) && noticias.length) {
        noticiasContainer.innerHTML = noticias.map((item) => {
          const body = `${item.conteudo || item.resumo || 'Notícia da SETI 2026.'}`;
          return `<article data-modal-title="${escapeHtml(item.titulo)}" data-modal-body="${escapeHtml(body)}"><h3>${escapeHtml(item.titulo)}</h3><p>${escapeHtml(item.resumo || 'Notícia da SETI 2026.')}</p></article>`;
        }).join('');
      }
    }

    // Palestrantes
    if (palestrantesContainer && palestrantesResponse.status === 'fulfilled' && palestrantesResponse.value.ok) {
      const palestrantes = await palestrantesResponse.value.json();
      if (Array.isArray(palestrantes) && palestrantes.length) {
        palestrantesContainer.innerHTML = palestrantes.map((item) => {
          const body = `${item.mini_bio || 'Palestrante da SETI 2026.'}${item.instagram ? ` Instagram: @${item.instagram}` : ''}${item.linkedin ? ` LinkedIn: ${item.linkedin}` : ''}`;
          return `<article data-modal-title="${escapeHtml(item.nome)}" data-modal-body="${escapeHtml(body)}"><h3>${escapeHtml(item.nome)}</h3><p><strong>${escapeHtml(item.area || 'Palestrante')}</strong></p><p>${escapeHtml(item.mini_bio || 'Palestrante da SETI 2026.')}</p></article>`;
        }).join('');
      }
    }

    // Pontuação
    if (pontuacaoContainer && pontuacaoResponse.status === 'fulfilled' && pontuacaoResponse.value.ok) {
      const pontuacao = await pontuacaoResponse.value.json();
      if (Array.isArray(pontuacao) && pontuacao.length) {
        const sorted = pontuacao.sort((a, b) => (b.pontos_totais || 0) - (a.pontos_totais || 0));
        pontuacaoContainer.innerHTML = sorted.map((item, index) => {
          const pontos = item.pontos_totais || 0;
          const gincanas = item.pontos_gincanas || 0;
          const penalizados = item.pontos_penalizados || 0;
          const detalhes = penalizados > 0 ? ` (${gincanas} - ${penalizados})` : '';
          return `<tr><td>${index + 1}º</td><td>${escapeHtml(item.turma || `Turma #${item.id}`)}</td><td><strong>${pontos}</strong> pontos${detalhes}</td></tr>`;
        }).join('');
      }
    }

    bindModalElements();
  } catch (error) {
    console.warn('Conteúdo dinâmico indisponível, mantendo conteúdo estático.', error);
  }
};

chatToggle?.addEventListener('click', () => toggleChat());
chatClose?.addEventListener('click', () => toggleChat(false));
openChatCta?.addEventListener('click', () => toggleChat(true));

navChat?.addEventListener('click', (event) => {
  event.preventDefault();
  closeMenu();
  toggleChat(true);
});

quickActions.forEach((button) => {
  button.addEventListener('click', () => {
    toggleChat(true);
    sendMessage(button.dataset.question);
  });
});

chatForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  await sendMessage(message);
});

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (link.id !== 'nav-chat') closeMenu();
  });
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

bindModalElements();

document.querySelectorAll('[data-close-modal]').forEach((element) => {
  element.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  observedSections.forEach((section) => revealObserver.observe(section));
} else {
  observedSections.forEach((section) => section.classList.add('visible'));
}

const handleScroll = () => {
  backToTop?.classList.toggle('visible', window.scrollY > 550);

  const fromTop = window.scrollY + 120;
  navLinks.forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    const isCurrent = target.offsetTop <= fromTop && target.offsetTop + target.offsetHeight > fromTop;
    link.classList.toggle('active', isCurrent);
  });
};

window.addEventListener('scroll', handleScroll);
handleScroll();
loadDynamicContent();
