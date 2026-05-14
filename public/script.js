const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const openChatCta = document.getElementById('open-chat-cta');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const quickActions = document.querySelectorAll('.quick-actions button');

const toggleChat = (open) => {
  const shouldOpen = typeof open === 'boolean' ? open : chatWidget.classList.contains('hidden');
  chatWidget.classList.toggle('hidden', !shouldOpen);
  if (shouldOpen) chatInput.focus();
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
