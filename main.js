import { APPS, CATEGORIES, FEATURED, repoUrl } from './apps.js';
import { initAnalytics, trackOpen } from './analytics.js';

// Qiita の記事・プロフィール。決まったらここに入れると、見出しとイチオシにリンクが出る
const QIITA_PROFILE = '';
const ARTICLES = {
  // hexfrontier: 'https://qiita.com/...',
};

const $ = (id) => document.getElementById(id);
const catOf = (id) => CATEGORIES.find((c) => c.id === id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// 「最近の更新」: 最後に手を入れた月が、今月か先月
function isRecent(updated, now = new Date()) {
  const [y, m] = updated.split('-').map(Number);
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return months <= 1;
}

const state = { cat: 'all', q: '' };

function renderFeatured() {
  const app = APPS.find((a) => a.id === FEATURED);
  if (!app) return;
  const article = ARTICLES[app.id];
  $('featured').innerHTML = `
    <img src="thumbs/${app.id}-wide.webp" alt="${esc(app.name)} の画面" width="960" height="540">
    <div>
      <span class="badge">イチオシ</span>
      <h2>${esc(app.name)}</h2>
      <p>${esc(app.desc)}</p>
      <div class="actions">
        <a class="btn" href="${app.url}" data-open="${app.id}" rel="noopener">▶ 遊ぶ</a>
        <a class="src" href="${repoUrl(app)}" rel="noopener">ソース</a>
        ${article ? `<a class="src" href="${article}" rel="noopener">作り方の記事(Qiita)</a>` : ''}
      </div>
    </div>`;
}

function renderChips() {
  const all = [{ id: 'all', label: 'すべて', icon: '' }, ...CATEGORIES];
  $('chips').innerHTML = all.map((c) => {
    const n = c.id === 'all' ? APPS.length : APPS.filter((a) => a.cat === c.id).length;
    return `<button class="chip" role="tab" data-cat="${c.id}" aria-selected="${state.cat === c.id}">${c.icon} ${esc(c.label)}<small>${n}</small></button>`;
  }).join('');
}

function matches(app) {
  if (state.cat !== 'all' && app.cat !== state.cat) return false;
  const q = state.q.trim().toLowerCase();
  if (!q) return true;
  const hay = [app.name, app.desc, app.id, catOf(app.cat)?.label, ...app.tags].join(' ').toLowerCase();
  return q.split(/\s+/).every((w) => hay.includes(w));
}

function card(app) {
  const c = catOf(app.cat);
  const marks = [
    isRecent(app.updated) ? '<span class="mark new">最近の更新</span>' : '',
    app.orient === 'landscape' ? '<span class="mark">横持ち</span>' : '',
  ].join('');
  return `
    <li class="card">
      <a class="thumb" href="${app.url}" data-open="${app.id}" rel="noopener" tabindex="-1" aria-hidden="true">
        <img src="thumbs/${app.id}.webp" alt="" loading="lazy" width="480" height="640">
        <span class="marks">${marks}</span>
      </a>
      <div class="body">
        <span class="cat">${c.icon} ${esc(c.label)}</span>
        <h3>${esc(app.name)}</h3>
        <p class="desc">${esc(app.desc)}</p>
        <div class="tags">${app.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <div class="actions">
          <a class="btn" href="${app.url}" data-open="${app.id}" rel="noopener">開く</a>
          <a class="src" href="${repoUrl(app)}" rel="noopener">ソース</a>
        </div>
      </div>
    </li>`;
}

function renderGrid() {
  // 分類ごとの並び(CATEGORIES の順)→ 新しく手を入れた順
  const order = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i]));
  const list = APPS.filter(matches).sort((a, b) =>
    (state.cat === 'all' ? order[a.cat] - order[b.cat] : 0) || b.updated.localeCompare(a.updated));
  $('grid').innerHTML = list.map(card).join('');
  $('empty').hidden = list.length > 0;
  const label = state.cat === 'all' ? 'すべて' : catOf(state.cat).label;
  $('result').textContent = `${label}: ${list.length} 本${state.q ? `(「${state.q}」で絞り込み)` : ''}`;
}

function wire() {
  $('chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    renderChips();
    renderGrid();
  });
  $('q').addEventListener('input', (e) => {
    state.q = e.target.value;
    renderGrid();
  });
  // どのアプリが開かれたかを数える(匿名。analytics.js)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-open]');
    if (!a) return;
    const app = APPS.find((x) => x.id === a.dataset.open);
    if (app) trackOpen(app.name);
  });
}

function boot() {
  $('count').textContent = APPS.length;
  if (QIITA_PROFILE) {
    $('qiita-link').href = QIITA_PROFILE;
    $('qiita-link').hidden = false;
  }
  renderFeatured();
  renderChips();
  renderGrid();
  wire();
  initAnalytics();
}

boot();
