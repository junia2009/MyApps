// apps.js からページを書き出す。アプリを足したり説明を変えたりしたら実行する。
//   node scripts/build.mjs
// 書き出すもの:
//   index.html             トップ(カードを最初から HTML に入れる → 検索エンジンが読める)
//   apps/<id>/index.html   アプリごとの紹介ページ(CM・特長・構造化データ)
//   sitemap.xml
// media/<id>/ に cm.mp4 などがあれば使い、なければ画面写真だけで組む。

import { writeFileSync, mkdirSync, existsSync, readFileSync, rmSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APPS, CATEGORIES, FEATURED, repoUrl } from '../apps.js';
import { SITE, esc, catOf, verb, isGame, cardHtml, sortedApps } from '../site.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const has = (p) => existsSync(join(ROOT, p));
const media = Object.fromEntries(APPS.map((a) => [a.id, has(`media/${a.id}/preview.mp4`)]));
const hasCm = (id) => has(`media/${id}/cm.mp4`);
const ogOf = (id) => (has(`media/${id}/og.jpg`) ? `media/${id}/og.jpg` : `thumbs/${id}.webp`);
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const ver = Date.now().toString(36); // CSS・JS の古いキャッシュを掴まないように

const APP_CATEGORY = { game: 'GameApplication', calm: 'EntertainmentApplication', make: 'DesignApplication', life: 'LifestyleApplication', learn: 'EducationalApplication', sec: 'SecurityApplication' };

function head({ title, desc, url, image, root, extra = '' }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="#0b1020">
<meta name="author" content="${SITE.author}">
${SITE.googleVerification ? `<meta name="google-site-verification" content="${SITE.googleVerification}">` : ''}
<link rel="icon" href="${root}icon.svg" type="image/svg+xml">
<link rel="manifest" href="${root}manifest.webmanifest">
<link rel="apple-touch-icon" href="${root}icons/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="アプリ置き場">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="ja_JP">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE.base}${image}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@500;700;800;900&display=swap">
<link rel="stylesheet" href="${root}style.css?v=${ver}">
${extra}`;
}

const footer = (root) => `<footer class="foot">
  <div class="wrap">
    <p>© ${SITE.author} ・ このページも GitHub Pages で公開しています(<a href="https://github.com/junia2009/MyApps" rel="noopener">ソース</a>)</p>
    <p class="note">匿名のアクセス数だけを <a href="https://www.goatcounter.com/" rel="noopener">GoatCounter</a> で数えています(Cookie なし)。</p>
  </div>
</footer>`;

const sky = `<div class="sky" aria-hidden="true"><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i></div>`;

// ---------------- トップ ----------------
function indexPage() {
  const list = sortedApps();
  const f = APPS.find((a) => a.id === FEATURED);
  const fArticle = SITE.articles[f.id];
  const fVideo = hasCm(f.id)
    ? `<video class="feat-video" src="media/${f.id}/cm.mp4" poster="media/${f.id}/poster.jpg" muted loop playsinline preload="none" data-autoplay aria-label="${esc(f.name)} の紹介動画"></video>`
    : `<img src="thumbs/${f.id}.webp" alt="${esc(f.name)} の画面" width="480" height="640">`;
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.base, inLanguage: 'ja', author: { '@type': 'Person', name: SITE.author, url: SITE.github } },
    { '@context': 'https://schema.org', '@type': 'ItemList', name: 'アプリ一覧', numberOfItems: list.length,
      itemListElement: list.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE.base}apps/${a.id}/`, name: a.name })) },
  ];
  const desc = `${SITE.author} が作った、ブラウザで動く個人開発アプリ ${APPS.length} 本の一覧。ゲーム・癒し・ものづくり・暮らしの便利ツール・CTF 向けツールまで、インストールなしでスマホからそのまま使えます。`;
  return `<!doctype html>
<html lang="ja">
<head>
${head({ title: `${SITE.name} ― ブラウザで動く個人開発アプリ ${APPS.length} 本`, desc, url: SITE.base, image: 'og.png', root: '',
  extra: `<script type="application/ld+json">${json(ld)}</script>\n<script type="module" src="main.js?v=${ver}"></script>` })}
</head>
<body class="top">
${sky}
<header class="hero">
  <div class="wrap">
    <p class="eyebrow">${SITE.author} の個人開発</p>
    <h1 class="title" aria-label="アプリ置き場">${[...'アプリ置き場'].map((ch, i) => `<span style="--i:${i}" aria-hidden="true">${ch}</span>`).join('')}</h1>
    <p class="lead">
      ブラウザで動くアプリを <strong class="count" data-to="${APPS.length}">${APPS.length}</strong> 本作りました。
      どれもインストールなしで、スマホからそのまま使えます。
      気に入ったものはホーム画面に追加すると、アプリのように起動できます。
    </p>
    <nav class="links">
      <a href="${SITE.github}" rel="noopener">GitHub</a>
      ${SITE.qiita ? `<a href="${SITE.qiita}" rel="noopener">Qiita</a>` : ''}
      <a href="#list" class="go">一覧へ ↓</a>
      <button class="install" type="button" data-install hidden>📲 ホーム画面に追加</button>
    </nav>
  </div>
</header>

<main class="wrap">
  <section class="featured reveal" aria-label="イチオシ" style="--c:${f.color ?? '#f5c451'}">
    <div class="feat-media">${fVideo}</div>
    <div class="feat-text">
      <span class="badge">イチオシ</span>
      <h2>${esc(f.name)}</h2>
      <p class="catch">${esc(f.catch ?? '')}</p>
      <p>${esc(f.desc)}</p>
      <div class="actions">
        <a class="btn big shine" href="${f.url}" data-open="${f.id}" rel="noopener">▶ ${verb(f)}</a>
        <a class="more" href="apps/${f.id}/">紹介を見る →</a>
        ${fArticle ? `<a class="more" href="${fArticle}" rel="noopener">作り方の記事(Qiita)</a>` : ''}
      </div>
    </div>
  </section>

  <section id="list" aria-label="アプリ一覧">
    <div class="controls">
      <div class="chips" role="tablist" aria-label="分類">
        <button class="chip" role="tab" data-cat="all" aria-selected="true">すべて<small>${APPS.length}</small></button>
        ${CATEGORIES.map((c) => `<button class="chip" role="tab" data-cat="${c.id}" aria-selected="false">${c.icon} ${esc(c.label)}<small>${APPS.filter((a) => a.cat === c.id).length}</small></button>`).join('\n        ')}
      </div>
      <label class="search">
        <span class="sr-only">アプリを探す</span>
        <input id="q" type="search" placeholder="名前・説明・技術で探す" autocomplete="off">
      </label>
    </div>
    <p class="result" id="result" aria-live="polite">すべて: ${APPS.length} 本</p>
    <ul class="grid" id="grid">
${list.map((a) => cardHtml(a, { media })).join('\n')}
    </ul>
    <p class="empty" id="empty" hidden>見つかりませんでした。別のことばで探してみてください。</p>
  </section>
</main>
${footer('')}
</body>
</html>
`;
}

// ---------------- 個人ページ ----------------
function appPage(app) {
  const c = catOf(app.cat);
  const root = '../../';
  const url = `${SITE.base}apps/${app.id}/`;
  const cm = hasCm(app.id);
  const article = SITE.articles[app.id];
  const title = `${app.name}${app.catch ? ` ― ${app.catch}` : ''} | ${SITE.name}`;
  const desc = `${app.desc}${app.catch ? ` ${app.catch}` : ''} ブラウザでそのまま${isGame(app) ? '遊べます' : '使えます'}。無料・インストール不要。`;
  const related = sortedApps(APPS.filter((a) => a.cat === app.cat && a.id !== app.id)).slice(0, 4);
  const more = related.length < 4 ? sortedApps(APPS.filter((a) => a.cat !== app.cat && a.id !== app.id)).slice(0, 4 - related.length) : [];
  const ld = [
    {
      '@context': 'https://schema.org', '@type': app.cat === 'game' ? ['VideoGame', 'SoftwareApplication'] : 'SoftwareApplication',
      name: app.name, description: app.desc, url: app.url, sameAs: [url, repoUrl(app)],
      applicationCategory: APP_CATEGORY[app.cat], operatingSystem: 'Web ブラウザ(スマホ・PC)', inLanguage: 'ja',
      image: `${SITE.base}${ogOf(app.id)}`, dateModified: `${app.updated}-01`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
      author: { '@type': 'Person', name: SITE.author, url: SITE.github },
      ...(app.points ? { featureList: app.points.join(' / ') } : {}),
      ...(cm ? { video: {
        '@type': 'VideoObject', name: `${app.name} の紹介動画`, description: app.catch ?? app.desc,
        thumbnailUrl: `${SITE.base}media/${app.id}/poster.jpg`, contentUrl: `${SITE.base}media/${app.id}/cm.mp4`,
        uploadDate: `${app.updated}-01`, duration: 'PT14S',
      } } : {}),
    },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE.name, item: SITE.base },
      { '@type': 'ListItem', position: 2, name: c.label, item: `${SITE.base}#list` },
      { '@type': 'ListItem', position: 3, name: app.name, item: url },
    ] },
  ];
  const mediaHtml = cm
    ? `<div class="phone"><video src="${root}media/${app.id}/cm.mp4" poster="${root}media/${app.id}/poster.jpg" muted loop playsinline preload="metadata" data-autoplay data-tap aria-label="${esc(app.name)} の紹介動画(14秒・音なし)。タップで一時停止"></video></div>`
    : `<div class="phone still"><img src="${root}thumbs/${app.id}.webp" alt="${esc(app.name)} の画面" width="480" height="640"></div>`;
  const points = app.points ?? [];
  return `<!doctype html>
<html lang="ja">
<head>
${head({ title, desc, url, image: ogOf(app.id), root,
  extra: `<script type="application/ld+json">${json(ld)}</script>\n<script type="module" src="${root}main.js?v=${ver}"></script>` })}
</head>
<body class="detail" style="--c:${app.color ?? '#7dd3fc'}">
${sky}
<nav class="crumbs wrap" aria-label="パンくず">
  <a href="${root}">${esc(SITE.name)}</a> <span>›</span>
  <a href="${root}#list" data-cat-link="${app.cat}">${c.icon} ${esc(c.label)}</a> <span>›</span>
  <span aria-current="page">${esc(app.name)}</span>
</nav>

<main class="wrap">
  <section class="app-hero">
    <div class="app-media rise">${mediaHtml}</div>
    <div class="app-text">
      <span class="chip-cat rise" style="--d:1">${c.icon} ${esc(c.label)}</span>
      <h1 class="rise" style="--d:2">${esc(app.name)}</h1>
      ${app.catch ? `<p class="catch rise" style="--d:3">${esc(app.catch)}</p>` : ''}
      <p class="lead rise" style="--d:4">${esc(app.desc)}</p>
      <div class="actions rise" style="--d:5">
        <a class="btn big shine" href="${app.url}" data-open="${app.id}" rel="noopener">▶ 今すぐ${verb(app)}</a>
        <a class="more" href="${repoUrl(app)}" rel="noopener">ソースを見る</a>
        <button class="more share" type="button" data-share>共有する</button>
      </div>
      <ul class="facts rise" style="--d:6">
        <li><b>料金</b>無料</li>
        <li><b>動く場所</b>ブラウザ(スマホ・PC)${app.orient === 'landscape' ? '<br><small>横持ちで遊びます</small>' : ''}</li>
        <li><b>インストール</b>不要</li>
        <li><b>最終更新</b>${app.updated.replace('-', '年')}月</li>
      </ul>
      ${article ? `<p class="rise" style="--d:7"><a class="more" href="${article}" rel="noopener">作り方の記事を読む(Qiita)→</a></p>` : ''}
    </div>
  </section>

  ${points.length ? `<section class="points" aria-labelledby="pt-h">
    <h2 id="pt-h" class="reveal">ここが推し</h2>
    <ol>
      ${points.map((p, i) => `<li class="reveal" style="--d:${i}"><span class="num">${i + 1}</span><p>${esc(p)}</p></li>`).join('\n      ')}
    </ol>
  </section>` : ''}

  <section class="tech reveal" aria-labelledby="tech-h">
    <h2 id="tech-h">使っている技術</h2>
    <div class="tags big">${app.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
  </section>

  <section class="related" aria-labelledby="rel-h">
    <h2 id="rel-h" class="reveal">${related.length ? `ほかの「${esc(c.label)}」も` : 'ほかのアプリも'}</h2>
    <ul class="grid">
${[...related, ...more].map((a) => cardHtml(a, { root, media })).join('\n')}
    </ul>
    <p class="back reveal"><a class="btn ghost" href="${root}#list">← ${APPS.length} 本の一覧へ</a></p>
  </section>
</main>
${footer(root)}
</body>
</html>
`;
}

// ---------------- 書き出し ----------------
writeFileSync(join(ROOT, 'index.html'), indexPage());
const appsDir = join(ROOT, 'apps');
// 一覧から外したアプリのページは消す
if (existsSync(appsDir)) for (const d of readdirSync(appsDir)) if (!APPS.some((a) => a.id === d)) rmSync(join(appsDir, d), { recursive: true });
for (const a of APPS) {
  mkdirSync(join(appsDir, a.id), { recursive: true });
  writeFileSync(join(appsDir, a.id, 'index.html'), appPage(a));
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE.base}</loc><lastmod>${today}</lastmod></url>
${APPS.map((a) => `  <url><loc>${SITE.base}apps/${a.id}/</loc><lastmod>${a.updated}-01</lastmod></url>`).join('\n')}
</urlset>
`);
// ---------------- PWA ----------------
// マニフェスト(ホーム画面に追加したときの名前・色・アイコン)
writeFileSync(join(ROOT, 'manifest.webmanifest'), JSON.stringify({
  name: SITE.name, short_name: 'アプリ置き場', lang: 'ja',
  description: `${SITE.author} が作った、ブラウザで動くアプリ ${APPS.length} 本の一覧`,
  start_url: './', scope: './', display: 'standalone',
  background_color: '#0b1020', theme_color: '#0b1020',
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
  ],
}, null, 2) + '\n');

// Service Worker。最初に開いたとき、ページ・見た目・画面写真をまとめて保存しておく
// (一度開けば、電波がなくても一覧と紹介ページを読める)。
// CM 動画(合計で数十 MB)は保存しない ── 毎回ネットワークから流す。
// キャッシュ名に書き出した時刻を入れるので、書き出し直すたびに入れ替わる。
const precache = [
  './', 'style.css', 'main.js', 'site.js', 'apps.js', 'analytics.js', 'icon.svg', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png',
  ...readdirSync(join(ROOT, 'thumbs')).filter((f) => f.endsWith('.webp')).map((f) => `thumbs/${f}`),
  ...APPS.map((a) => `apps/${a.id}/`),
];
writeFileSync(join(ROOT, 'sw.js'), `// scripts/build.mjs が書き出す。手で編集しない
const CACHE = 'myapps-${ver}';
const PRECACHE = ${JSON.stringify(precache, null, 2)};

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('myapps-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 動画は Range 要求で少しずつ取るので、手を出さない
  if (url.pathname.endsWith('.mp4')) return;
  const sameOrigin = url.origin === self.location.origin;
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !font) return;
  // ネットワーク優先(更新がすぐ届く)。つながらないときだけ保存分を出す
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const res = await fetch(req);
      if (res.ok && (sameOrigin || font)) cache.put(req, res.clone());
      return res;
    } catch {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') return (await cache.match('./')) ?? Response.error();
      return Response.error();
    }
  })());
});
`);

console.log(`書き出し: index.html / apps/*(${APPS.length}) / sitemap.xml ・ CM あり ${APPS.filter((a) => hasCm(a.id)).length} 本`);
