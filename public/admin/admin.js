const loginPanel = document.getElementById('login-panel');
const dashboardPanel = document.getElementById('dashboard-panel');
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('admin-email');
const passwordInput = document.getElementById('admin-password');
const loginStatus = document.getElementById('login-status');
const logoutButton = document.getElementById('logout-button');
const resourceTitle = document.getElementById('resource-title');
const formTitle = document.getElementById('form-title');
const resourceForm = document.getElementById('resource-form');
const formStatus = document.getElementById('form-status');
const recordsList = document.getElementById('records-list');
const reloadButton = document.getElementById('reload-button');
const navButtons = document.querySelectorAll('#admin-nav button');

let currentResource = 'programacao';
let editingId = null;
let currentRecords = [];

const resources = {
  programacao: {
    title: 'Programação',
    label: 'titulo',
    fields: [
      ['data_evento', 'Data', 'date'],
      ['dia_semana', 'Dia da semana'],
      ['titulo', 'Título'],
      ['turma', 'Turma'],
      ['horario_inicio', 'Início', 'time'],
      ['horario_fim', 'Fim', 'time'],
      ['palestrante_id', 'ID do palestrante', 'number'],
      ['status_palestrante', 'Status do palestrante'],
      ['descricao', 'Descrição', 'textarea'],
      ['ordem', 'Ordem', 'number']
    ]
  },
  palestrantes: {
    title: 'Palestrantes',
    label: 'nome',
    fields: [
      ['nome', 'Nome'],
      ['area', 'Área'],
      ['mini_bio', 'Mini bio', 'textarea'],
      ['foto_url', 'URL da foto'],
      ['instagram', 'Instagram'],
      ['linkedin', 'LinkedIn'],
      ['status', 'Status', 'select', ['confirmado', 'aguardando confirmação', 'cancelado']]
    ]
  },
  gincanas: {
    title: 'Gincanas',
    label: 'nome',
    fields: [
      ['nome', 'Nome'],
      ['descricao', 'Descrição', 'textarea'],
      ['regras', 'Regras', 'textarea'],
      ['icone', 'Ícone'],
      ['ordem', 'Ordem', 'number'],
      ['ativo', 'Ativo', 'select', [['1', 'Sim'], ['0', 'Não']]]
    ]
  },
  noticias: {
    title: 'Notícias',
    label: 'titulo',
    fields: [
      ['titulo', 'Título'],
      ['resumo', 'Resumo', 'textarea'],
      ['conteudo', 'Conteúdo', 'textarea'],
      ['imagem_url', 'URL da imagem'],
      ['publicado', 'Publicado', 'select', [['1', 'Sim'], ['0', 'Não']]]
    ]
  },
  turmas: {
    title: 'Turmas',
    label: 'nome',
    fields: [
      ['nome', 'Nome'],
      ['ano', 'Ano', 'number'],
      ['curso', 'Curso'],
      ['periodo', 'Período']
    ]
  },
  duvidas: {
    title: 'Dúvidas',
    label: 'mensagem',
    fields: [
      ['nome', 'Nome'],
      ['email', 'Email', 'email'],
      ['turma', 'Turma'],
      ['mensagem', 'Mensagem', 'textarea'],
      ['respondida', 'Respondida', 'select', [['1', 'Sim'], ['0', 'Não']]]
    ]
  },
  tipos_penalizacoes: {
    title: 'Tipos de Penalizações',
    label: 'nome',
    fields: [
      ['nome', 'Nome'],
      ['descricao', 'Descrição', 'textarea'],
      ['pontos_padrao', 'Pontos padrão', 'number'],
      ['ativo', 'Ativo', 'select', [['1', 'Sim'], ['0', 'Não']]]
    ]
  },
  penalizacoes: {
    title: 'Penalizações Aplicadas',
    label: 'observacao',
    fields: [
      ['turma_id', 'ID da turma', 'number'],
      ['tipo_penalizacao_id', 'ID do tipo', 'number'],
      ['pontos_perdidos', 'Pontos perdidos', 'number'],
      ['observacao', 'Observação', 'textarea']
    ]
  },
  pontuacao_gincanas: {
    title: 'Pontuação de Gincanas',
    label: 'pontos',
    fields: [
      ['turma_id', 'ID da turma', 'number'],
      ['gincana_id', 'ID da gincana', 'number'],
      ['pontos', 'Pontos', 'number'],
      ['observacao', 'Observação', 'textarea']
    ]
  },
  users: {
    title: 'Usuários',
    label: 'nome',
    fields: [
      ['nome', 'Nome'],
      ['email', 'Email'],
      ['role', 'Função', 'select', ['aluno', 'professor', 'admin']],
      ['turma_id', 'ID da turma', 'number'],
      ['ativo', 'Ativo', 'select', [['1', 'Sim'], ['0', 'Não']]]
    ]
  }
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const normalizeValue = (value, type) => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  if (type === 'date') return text.slice(0, 10);
  if (type === 'time') return text.slice(0, 5);
  return text;
};

const api = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Erro na requisição.');
  return data;
};

const setAuthenticated = (authenticated) => {
  loginPanel.classList.toggle('hidden', authenticated);
  dashboardPanel.classList.toggle('hidden', !authenticated);
  logoutButton.classList.toggle('hidden', !authenticated);
};

const renderForm = (record = {}) => {
  const config = resources[currentResource];
  formTitle.textContent = editingId ? `Editar ${config.title}` : `Novo registro em ${config.title}`;

  const fieldsHtml = config.fields.map(([name, label, type = 'text', options]) => {
    const value = normalizeValue(record[name], type);
    if (type === 'textarea') {
      return `<label>${label}<textarea name="${name}">${escapeHtml(value)}</textarea></label>`;
    }
    if (type === 'select') {
      const optionList = (options || []).map((option) => {
        const optionValue = Array.isArray(option) ? option[0] : option;
        const optionLabel = Array.isArray(option) ? option[1] : option;
        return `<option value="${escapeHtml(optionValue)}" ${String(value) === String(optionValue) ? 'selected' : ''}>${escapeHtml(optionLabel)}</option>`;
      }).join('');
      return `<label>${label}<select name="${name}">${optionList}</select></label>`;
    }
    return `<label>${label}<input name="${name}" type="${type}" value="${escapeHtml(value)}" /></label>`;
  }).join('');

  resourceForm.innerHTML = `<div class="resource-fields">${fieldsHtml}<button type="submit">${editingId ? 'Salvar alterações' : 'Criar registro'}</button><button type="button" id="cancel-edit" class="ghost-button">Limpar</button></div>`;
  document.getElementById('cancel-edit').addEventListener('click', () => {
    editingId = null;
    renderForm();
  });
};

const renderRecords = () => {
  const config = resources[currentResource];
  recordsList.innerHTML = currentRecords.map((record) => {
    const label = escapeHtml(record[config.label] || `ID: ${record.id}`);
    return `
      <div class="record-item">
        <span>${label}</span>
        <div class="record-actions">
          <button data-edit="${record.id}" class="ghost-button">Editar</button>
          <button data-delete="${record.id}" class="ghost-button">Excluir</button>
        </div>
      </div>
    `;
  }).join('');

  recordsList.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', () => {
      editingId = button.dataset.edit;
      const record = currentRecords.find((item) => String(item.id) === String(editingId));
      renderForm(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  recordsList.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!confirm('Excluir este registro?')) return;
      await api(`/api/admin/${currentResource}/${button.dataset.delete}`, { method: 'DELETE' });
      await loadResource();
    });
  });
};

const loadResource = async () => {
  const config = resources[currentResource];
  resourceTitle.textContent = config.title;
  formStatus.textContent = '';
  renderForm();
  try {
    currentRecords = await api(`/api/admin/${currentResource}`);
    renderRecords();
  } catch (error) {
    recordsList.innerHTML = `<p class="status">${escapeHtml(error.message)}</p>`;
  }
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginStatus.textContent = 'Verificando...';
  try {
    await api('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: emailInput.value,
        password: passwordInput.value 
      })
    });
    loginStatus.textContent = '';
    setAuthenticated(true);
    await loadResource();
  } catch (error) {
    loginStatus.textContent = error.message;
  }
});

logoutButton.addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST', body: '{}' });
  setAuthenticated(false);
});

resourceForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = 'Salvando...';
  const formData = new FormData(resourceForm);
  const payload = Object.fromEntries(formData.entries());
  try {
    await api(`/api/admin/${currentResource}${editingId ? `/${editingId}` : ''}`, {
      method: editingId ? 'PUT' : 'POST',
      body: JSON.stringify(payload)
    });
    editingId = null;
    formStatus.textContent = 'Registro salvo com sucesso.';
    await loadResource();
  } catch (error) {
    formStatus.textContent = error.message;
  }
});

navButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    navButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    currentResource = button.dataset.resource;
    editingId = null;
    await loadResource();
  });
});

reloadButton.addEventListener('click', loadResource);

const init = async () => {
  try {
    const status = await api('/api/admin/status');
    setAuthenticated(status.authenticated);
    if (status.authenticated) await loadResource();
  } catch (error) {
    setAuthenticated(false);
  }
};

init();
