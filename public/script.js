const chatToggle = document.getElementById('chat-toggle');
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

const toggleChat = (open) => {
  const shouldOpen = typeof open === 'boolean' ? open : chatWidget.classList.contains('hidden');
  chatWidget.classList.toggle('hidden', !shouldOpen);
  if (shouldOpen) chatInput.focus();
};

const closeMenu = () => {
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
  if (!message) return;

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

chatToggle.addEventListener('click', () => toggleChat());
chatClose.addEventListener('click', () => toggleChat(false));
openChatCta.addEventListener('click', () => toggleChat(true));

navChat.addEventListener('click', (event) => {
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

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const message = chatInput.value.trim();
  await sendMessage(message);
});

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (link.id !== 'nav-chat') closeMenu();
  });
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

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

const handleScroll = () => {
  backToTop.classList.toggle('visible', window.scrollY > 550);

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
