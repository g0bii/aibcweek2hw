const clocks = [
  { city: 'Charlotte', zone: 'America/New_York', label: 'EDT' },
  { city: 'London', zone: 'Europe/London', label: 'BST' },
  { city: 'Mumbai', zone: 'Asia/Kolkata', label: 'IST' },
  { city: 'Tokyo', zone: 'Asia/Tokyo', label: 'JST' },
];

const grid = document.querySelector('#clock-grid');
grid.innerHTML = clocks.map(({ city, zone, label }) => `
  <article class="clock">
    <div class="city"><span>${city.toUpperCase()}</span><span class="zone">${label}</span></div>
    <time class="time" data-zone="${zone}">--:--:--</time>
    <span class="day" data-day="${zone}">LOADING</span>
  </article>`).join('');

function format(zone, options) {
  return new Intl.DateTimeFormat('en-US', { timeZone: zone, ...options }).format(new Date());
}
function updateTime() {
  document.querySelectorAll('[data-zone]').forEach((item) => {
    item.textContent = format(item.dataset.zone, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  });
  document.querySelectorAll('[data-day]').forEach((item) => {
    item.textContent = format(item.dataset.day, { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
  });
  document.querySelector('#utc-time').textContent = `UTC — ${format('UTC', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`;
  document.querySelector('#local-date').textContent = format(Intl.DateTimeFormat().resolvedOptions().timeZone, { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
}
updateTime();
setInterval(updateTime, 1000);

const briefs = {
  federal: {
    label: 'U.S. GOVERNMENT / LIVE SOURCE',
    title: 'A direct route to federal updates.',
    body: 'This desk keeps the reading experience focused while pointing to the official newsroom for the latest statements, executive actions, briefing notes, and administration announcements. Open the source to see the current releases and full context.',
    source: 'WHITE HOUSE NEWSROOM',
    url: 'https://www.whitehouse.gov/news/',
  },
  charlotte: {
    label: 'CHARLOTTE, NC / LOCAL SOURCE',
    title: 'Charlotte city news, without the detour.',
    body: 'For the latest city projects, public meetings, service changes, and resident notices, this briefing links straight to Charlotte’s official newsroom. The source has the active notices and complete city updates.',
    source: 'CITY OF CHARLOTTE NEWSROOM',
    url: 'https://www.charlottenc.gov/Newsroom',
  },
  civic: {
    label: 'CIVIC WATCH / RESOURCES',
    title: 'Find government information by topic.',
    body: 'USA.gov is a reliable starting point when you need practical federal information. Use it to move from a quick desk briefing into the government service or agency that owns the update.',
    source: 'OPEN USA.GOV NEWS',
    url: 'https://www.usa.gov/news',
  },
};

const articleDialog = document.querySelector('#article-dialog');
const articleContent = document.querySelector('#article-content');
document.querySelectorAll('.article-open').forEach((button) => {
  button.addEventListener('click', () => {
    const brief = briefs[button.dataset.article];
    articleContent.innerHTML = `<p class="article-type">${brief.label}</p><h2>${brief.title}</h2><p>${brief.body}</p><a href="${brief.url}" target="_blank" rel="noreferrer">${brief.source} ↗</a>`;
    articleDialog.showModal();
  });
});
document.querySelectorAll('.dialog-close').forEach((button) => button.addEventListener('click', () => button.closest('dialog').close()));

document.querySelector('#focus-toggle').addEventListener('click', () => document.body.classList.toggle('focus-mode'));
const moments = ['Take the long<br />view.', 'Small steps,<br />bright signal.', 'Make room<br />for wonder.'];
let moment = 0;
document.querySelector('#quote-toggle').addEventListener('click', () => {
  moment = (moment + 1) % moments.length;
  document.querySelector('#quote-text').innerHTML = moments[moment];
});

const gameDialog = document.querySelector('#game-dialog');
const canvas = document.querySelector('#flappy-game');
const ctx = canvas.getContext('2d');
const overlay = document.querySelector('#game-overlay');
const scoreOutput = document.querySelector('#game-score');
let gameFrame; let bird; let pipes; let score; let running;

function resetGame() {
  bird = { x: 155, y: 190, velocity: 0, radius: 17, tilt: 0 };
  pipes = [{ x: 680, gapY: 172, scored: false }, { x: 970, gapY: 255, scored: false }];
  score = 0; running = false; scoreOutput.textContent = '00'; overlay.style.display = 'grid';
  drawGame();
}
function drawGame() {
  ctx.clearRect(0, 0, 680, 400);
  ctx.fillStyle = '#16120f'; ctx.fillRect(0, 0, 680, 400);
  ctx.strokeStyle = 'rgba(255,90,31,.14)'; ctx.lineWidth = 1;
  for (let x = 0; x < 680; x += 42) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 120, 400); ctx.stroke(); }
  pipes.forEach((pipe) => {
    const gap = 125; ctx.fillStyle = '#ff5a1f';
    ctx.fillRect(pipe.x, 0, 62, pipe.gapY - gap / 2); ctx.fillRect(pipe.x, pipe.gapY + gap / 2, 62, 400);
    ctx.fillStyle = '#f3eee7'; ctx.fillRect(pipe.x - 5, pipe.gapY - gap / 2 - 11, 72, 11); ctx.fillRect(pipe.x - 5, pipe.gapY + gap / 2, 72, 11);
  });
  ctx.save(); ctx.translate(bird.x, bird.y); ctx.rotate(bird.tilt); ctx.fillStyle = '#f3eee7'; ctx.beginPath(); ctx.arc(0, 0, bird.radius, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#ff5a1f'; ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(34, 8); ctx.lineTo(8, 14); ctx.fill(); ctx.fillStyle = '#0b0b0b'; ctx.beginPath(); ctx.arc(5, -5, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.fillStyle = 'rgba(243,238,231,.7)'; ctx.font = '11px DM Mono'; ctx.fillText(String(score).padStart(2, '0'), 630, 30);
}
function tick() {
  bird.velocity += .32; bird.y += bird.velocity; bird.tilt = Math.min(.6, bird.velocity / 12);
  pipes.forEach((pipe) => { pipe.x -= 2.8; if (!pipe.scored && pipe.x + 62 < bird.x) { pipe.scored = true; score += 1; scoreOutput.textContent = String(score).padStart(2, '0'); } });
  if (pipes[0].x < -70) pipes.shift();
  if (pipes.length < 2) pipes.push({ x: pipes[pipes.length - 1].x + 290, gapY: 115 + Math.random() * 170, scored: false });
  const hitPipe = pipes.some((pipe) => bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + 62 && (bird.y - bird.radius < pipe.gapY - 62 || bird.y + bird.radius > pipe.gapY + 62));
  if (bird.y > 400 || bird.y < 0 || hitPipe) { running = false; overlay.innerHTML = '<strong>AGAIN</strong><span>CLICK TO RESTART</span>'; overlay.style.display = 'grid'; drawGame(); return; }
  drawGame(); gameFrame = requestAnimationFrame(tick);
}
function flap() { if (!running) { running = true; overlay.style.display = 'none'; cancelAnimationFrame(gameFrame); tick(); } bird.velocity = -5.6; bird.tilt = -.45; }
document.querySelector('#game-launch').addEventListener('click', () => { gameDialog.showModal(); resetGame(); });
canvas.addEventListener('pointerdown', flap);
window.addEventListener('keydown', (event) => { if (event.code === 'Space' && gameDialog.open) { event.preventDefault(); flap(); } });
gameDialog.addEventListener('close', () => { running = false; cancelAnimationFrame(gameFrame); });
