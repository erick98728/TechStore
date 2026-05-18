const questions = window.SHADOW_SCROLL_QUESTIONS || [];

const body = document.body;
body.innerHTML = `
  <main class="app">
    <section id="start-screen" class="panel start-screen">
      <p class="eyebrow">Jogo mobile original</p>
      <h1>Shadow Scroll Runner</h1>
      <p>Controle um aprendiz corredor em uma vila fictícia, colete pergaminhos, desvie de obstáculos e responda perguntas rápidas para ganhar bônus.</p>
      <button id="start-btn" class="primary-btn">Começar</button>
      <small>Teclado: espaço para pular, seta para baixo para abaixar. Celular: use os botões na tela.</small>
    </section>

    <section id="game-screen" class="game-screen hidden">
      <header class="hud">
        <div><strong id="score">0</strong><span>Pontos</span></div>
        <div><strong id="coins">0</strong><span>Pergaminhos</span></div>
        <div><strong id="energy">0</strong><span>Energia</span></div>
        <button id="pause-btn" class="ghost-btn">Pausar</button>
      </header>
      <canvas id="game-canvas" width="960" height="540"></canvas>
      <div class="mobile-controls">
        <button id="slide-btn">Abaixar</button>
        <button id="jump-btn">Pular</button>
      </div>
    </section>

    <section id="quiz-modal" class="quiz-modal hidden" aria-hidden="true">
      <div class="panel quiz-card">
        <p class="eyebrow">Quiz rápido</p>
        <h2 id="quiz-question">Pergunta</h2>
        <div id="quiz-options" class="quiz-options"></div>
        <p id="quiz-feedback"></p>
      </div>
    </section>

    <section id="game-over" class="panel game-over hidden" aria-hidden="true">
      <p class="eyebrow">Fim da partida</p>
      <h2>Resultado</h2>
      <p id="final-score">Pontuação final: 0</p>
      <button id="restart-btn" class="primary-btn">Jogar novamente</button>
    </section>
  </main>
`;

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over');
const quizModal = document.getElementById('quiz-modal');
const scoreEl = document.getElementById('score');
const coinsEl = document.getElementById('coins');
const energyEl = document.getElementById('energy');
const finalScoreEl = document.getElementById('final-score');
const pauseBtn = document.getElementById('pause-btn');

const state = {
  running: false,
  paused: false,
  quizOpen: false,
  score: 0,
  coins: 0,
  energy: 0,
  speed: 6,
  frame: 0,
  nextQuiz: 900,
  player: { x: 130, y: 0, w: 54, h: 86, vy: 0, grounded: true, sliding: false, shield: 0 },
  obstacles: [],
  collectibles: []
};

const groundY = 430;

function resetGame() {
  state.running = true;
  state.paused = false;
  state.quizOpen = false;
  state.score = 0;
  state.coins = 0;
  state.energy = 0;
  state.speed = 6;
  state.frame = 0;
  state.nextQuiz = 750;
  state.obstacles = [];
  state.collectibles = [];
  state.player = { x: 130, y: groundY - 86, w: 54, h: 86, vy: 0, grounded: true, sliding: false, shield: 0 };
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  quizModal.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  updateHud();
  requestAnimationFrame(loop);
}

function updateHud() {
  scoreEl.textContent = Math.floor(state.score);
  coinsEl.textContent = state.coins;
  energyEl.textContent = state.energy;
}

function jump() {
  if (!state.running || state.paused || state.quizOpen) return;
  if (state.player.grounded) {
    state.player.vy = -18;
    state.player.grounded = false;
  }
}

function slide() {
  if (!state.running || state.paused || state.quizOpen) return;
  state.player.sliding = true;
  state.player.h = 52;
  state.player.y = groundY - state.player.h;
  setTimeout(() => {
    state.player.sliding = false;
    state.player.h = 86;
    if (state.player.grounded) state.player.y = groundY - state.player.h;
  }, 520);
}

function spawnObstacle() {
  const tall = Math.random() > 0.55;
  state.obstacles.push({
    x: canvas.width + 40,
    y: tall ? groundY - 92 : groundY - 54,
    w: tall ? 42 : 62,
    h: tall ? 92 : 54,
    type: tall ? 'totem' : 'barrier'
  });
}

function spawnCollectible() {
  state.collectibles.push({
    x: canvas.width + 40,
    y: 250 + Math.random() * 110,
    r: 16,
    type: Math.random() > 0.45 ? 'scroll' : 'crystal'
  });
}

function rectsCollide(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function circleCollidesRect(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < circle.r * circle.r;
}

function openQuiz() {
  if (!questions.length) return;
  state.quizOpen = true;
  state.paused = true;
  quizModal.classList.remove('hidden');
  quizModal.setAttribute('aria-hidden', 'false');

  const item = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById('quiz-question').textContent = item.question;
  const options = document.getElementById('quiz-options');
  const feedback = document.getElementById('quiz-feedback');
  feedback.textContent = '';
  options.innerHTML = '';

  item.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => answerQuiz(item, index));
    options.appendChild(btn);
  });
}

function answerQuiz(item, index) {
  const feedback = document.getElementById('quiz-feedback');
  const correct = index === item.answer;

  if (correct) {
    feedback.textContent = 'Resposta certa! Bônus aplicado.';
    state.score += 250;
    if (item.reward === 'shield') state.player.shield = 240;
    if (item.reward === 'coins') state.coins += 5;
    if (item.reward === 'energy') state.energy += 3;
  } else {
    feedback.textContent = 'Resposta errada. A velocidade aumentou um pouco.';
    state.speed += 0.8;
  }

  updateHud();
  setTimeout(() => {
    state.quizOpen = false;
    state.paused = false;
    quizModal.classList.add('hidden');
    quizModal.setAttribute('aria-hidden', 'true');
    requestAnimationFrame(loop);
  }, 900);
}

function endGame() {
  state.running = false;
  gameScreen.classList.add('hidden');
  gameOverScreen.classList.remove('hidden');
  gameOverScreen.setAttribute('aria-hidden', 'false');
  finalScoreEl.textContent = `Pontuação final: ${Math.floor(state.score)} | Pergaminhos: ${state.coins}`;
}

function update() {
  state.frame += 1;
  state.score += 0.12 * state.speed;
  if (state.frame % 360 === 0) state.speed = Math.min(state.speed + 0.5, 16);
  if (state.frame % Math.max(55, 125 - Math.floor(state.speed * 4)) === 0) spawnObstacle();
  if (state.frame % 95 === 0) spawnCollectible();
  if (state.frame > state.nextQuiz) {
    state.nextQuiz += 850;
    openQuiz();
  }

  const player = state.player;
  player.vy += 0.9;
  player.y += player.vy;
  if (player.y + player.h >= groundY) {
    player.y = groundY - player.h;
    player.vy = 0;
    player.grounded = true;
  }
  if (player.shield > 0) player.shield -= 1;

  state.obstacles.forEach((obstacle) => obstacle.x -= state.speed);
  state.collectibles.forEach((item) => item.x -= state.speed);
  state.obstacles = state.obstacles.filter((obstacle) => obstacle.x + obstacle.w > -20);
  state.collectibles = state.collectibles.filter((item) => item.x + item.r > -20);

  for (const obstacle of state.obstacles) {
    if (rectsCollide(player, obstacle)) {
      if (player.shield > 0) {
        obstacle.x = -100;
        player.shield = 0;
        state.score += 100;
      } else {
        endGame();
        return;
      }
    }
  }

  state.collectibles = state.collectibles.filter((item) => {
    if (circleCollidesRect(item, player)) {
      if (item.type === 'scroll') state.coins += 1;
      if (item.type === 'crystal') state.energy += 1;
      state.score += 60;
      return false;
    }
    return true;
  });

  updateHud();
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#111827');
  gradient.addColorStop(0.52, '#26324d');
  gradient.addColorStop(1, '#10131f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 6; i += 1) {
    const x = ((i * 210 - state.frame * 0.55) % 1100) - 120;
    ctx.beginPath();
    ctx.arc(x, 120 + i * 16, 55, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#1f2937';
  for (let i = 0; i < 8; i += 1) {
    const x = ((i * 170 - state.frame * 1.4) % 1200) - 120;
    ctx.fillRect(x, 310, 130, 120);
    ctx.beginPath();
    ctx.moveTo(x - 12, 310);
    ctx.lineTo(x + 65, 250);
    ctx.lineTo(x + 142, 310);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, groundY, canvas.width, 8);
}

function drawPlayer() {
  const p = state.player;
  ctx.fillStyle = p.shield > 0 ? '#38bdf8' : '#e5e7eb';
  ctx.fillRect(p.x, p.y, p.w, p.h);
  ctx.fillStyle = '#111827';
  ctx.fillRect(p.x + 8, p.y + 10, p.w - 16, 18);
  ctx.fillStyle = '#8b5cf6';
  ctx.fillRect(p.x + 10, p.y + p.h - 20, p.w - 20, 12);
  if (p.shield > 0) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.strokeRect(p.x - 8, p.y - 8, p.w + 16, p.h + 16);
  }
}

function drawEntities() {
  state.obstacles.forEach((obstacle) => {
    ctx.fillStyle = obstacle.type === 'totem' ? '#7f1d1d' : '#78350f';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(obstacle.x + 8, obstacle.y + 8, obstacle.w - 16, 8);
  });

  state.collectibles.forEach((item) => {
    ctx.beginPath();
    ctx.fillStyle = item.type === 'scroll' ? '#facc15' : '#22d3ee';
    ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function draw() {
  drawBackground();
  drawEntities();
  drawPlayer();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '20px Arial';
  ctx.fillText(`Velocidade ${state.speed.toFixed(1)}`, 24, 36);
}

function loop() {
  if (!state.running || state.paused || state.quizOpen) return;
  update();
  draw();
  if (state.running) requestAnimationFrame(loop);
}

function togglePause() {
  if (!state.running || state.quizOpen) return;
  state.paused = !state.paused;
  pauseBtn.textContent = state.paused ? 'Continuar' : 'Pausar';
  if (!state.paused) requestAnimationFrame(loop);
}

document.getElementById('start-btn').addEventListener('click', resetGame);
document.getElementById('restart-btn').addEventListener('click', resetGame);
document.getElementById('jump-btn').addEventListener('click', jump);
document.getElementById('slide-btn').addEventListener('click', slide);
pauseBtn.addEventListener('click', togglePause);

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') jump();
  if (event.code === 'ArrowDown') slide();
  if (event.code === 'Escape') togglePause();
});
