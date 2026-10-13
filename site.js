// トップページ・個人ページ・生成スクリプト(scripts/build.mjs)で共有する部品。
// ブラウザでも Node でも動くように、DOM には触らない(文字列を返すだけ)。

import { APPS, CATEGORIES, repoUrl } from './apps.js';

export const SITE = {
  name: 'junia lab',
  base: 'https://junia2009.github.io/MyApps/',
  author: 'junia2009',
  // Google Search Console の所有権の確認
  googleVerification: '8ZyND1Ku-veyU-mxRLHPgO6U8lg9MsXpHRgqj-qspWU',
  github: 'https://github.com/junia2009',
  // Qiita のプロフィールと記事。入れると見出し・イチオシ・個人ページにリンクが出る
  qiita: '',
  articles: {
    // hexfrontier: 'https://qiita.com/...',
  },
};

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const catOf = (id) => CATEGORIES.find((c) => c.id === id);
export const appOf = (id) => APPS.find((a) => a.id === id);
export const isGame = (app) => app.cat === 'game';
export const verb = (app) => (isGame(app) ? '遊ぶ' : '使う');

// 「最近の更新」: 最後に手を入れた月が、今月か先月
export function isRecent(updated, now = new Date()) {
  const [y, m] = updated.split('-').map(Number);
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m) <= 1;
}

// 分類の順 → 新しく手を入れた順
export function sortedApps(list = APPS) {
  const order = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i]));
  return [...list].sort((a, b) => order[a.cat] - order[b.cat] || b.updated.localeCompare(a.updated));
}

// 一覧のカード。root はページから見たサイトの根(トップは ''、個人ページは '../../')
// media: { [id]: true } … CM の試し見(preview.mp4)があるアプリ
export function cardHtml(app, { root = '', media = {}, now } = {}) {
  const c = catOf(app.cat);
  const page = `${root}apps/${app.id}/`;
  const marks = [
    isRecent(app.updated, now) ? '<span class="mark new">最近の更新</span>' : '',
    app.orient === 'landscape' ? '<span class="mark">横持ち</span>' : '',
    media[app.id] ? '<span class="mark play" aria-hidden="true">▶ CM</span>' : '',
  ].join('');
  const preview = media[app.id]
    ? ` data-preview="${root}media/${app.id}/preview.mp4"` : '';
  return `<li class="card" data-id="${app.id}" data-cat="${app.cat}" style="--c:${app.color ?? '#7dd3fc'}">
  <a class="thumb" href="${page}"${preview} aria-label="${esc(app.name)} の紹介ページ">
    <img src="${root}thumbs/${app.id}.webp" alt="${esc(app.name)} の画面" loading="lazy" width="480" height="640">
    <span class="marks">${marks}</span>
  </a>
  <div class="body">
    <span class="cat">${c.icon} ${esc(c.label)}</span>
    <h3><a href="${page}">${esc(app.name)}</a></h3>
    <p class="desc">${esc(app.desc)}</p>
    <div class="tags">${app.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="actions">
      <a class="btn" href="${app.url}" data-open="${app.id}" rel="noopener">${verb(app)}</a>
      <a class="more" href="${page}">紹介を見る →</a>
    </div>
  </div>
</li>`;
}

export { APPS, CATEGORIES, repoUrl };
