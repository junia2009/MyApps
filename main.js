// ページの動き。カードや紹介文は scripts/build.mjs が HTML に書き出しているので、
// ここは「絞り込み・検索」と「動き」と「集計」だけを足す(JS が無くても全部読める)。

import { APPS, catOf } from './site.js';
import { initAnalytics, trackOpen } from './analytics.js';

document.documentElement.classList.add('js');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---- スクロールで現れる ----
const io = new IntersectionObserver((ents) => {
  for (const e of ents) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px' });
function watchReveal() {
  $$('.grid').forEach((g) => $$('.card:not(.in)', g).forEach((c, i) => { c.style.setProperty('--d', i % 4); io.observe(c); }));
  $$('.reveal:not(.in)').forEach((el) => io.observe(el));
  // 速くスクロールすると、画面を一瞬で通り過ぎた段に合図が来ないことがある。
  // 止まったところで、画面より上にあるものは全部出しておく
  let timer;
  addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      for (const el of $$('.card:not(.in), .reveal:not(.in)')) {
        if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('in'); io.unobserve(el); }
      }
    }, 120);
  }, { passive: true });
}

// ---- 数を数え上げる(見出しの「38 本」) ----
function countUp() {
  const el = $('.count'); if (!el || calm) return;
  const to = +el.dataset.to; const t0 = performance.now();
  const step = (t) => { const k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
  el.textContent = '0'; setTimeout(() => requestAnimationFrame(step), 600);
}

// ---- カードを指先に向けて少し傾ける(マウスのある端末だけ) ----
function tilt() {
  if (!finePointer || calm) return;
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.card'); if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty('--ry', `${x * 10}deg`); card.style.setProperty('--rx', `${-y * 10}deg`);
  });
  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest('.card');
    if (card && !card.contains(e.relatedTarget)) { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); }
  });
}

// ---- 試し見: カードの写真の上で、実物の動きを流す ----
// マウスなら重ねたとき。指の端末なら、画面のまんなかに来たカードを(同時に2つまで)。
function previews() {
  if (calm) return;
  const start = (card) => {
    const a = $('.thumb[data-preview]', card); if (!a) return;
    let v = $('video', a);
    if (!v) { v = Object.assign(document.createElement('video'), { src: a.dataset.preview, muted: true, loop: true, playsInline: true, preload: 'auto' }); v.setAttribute('aria-hidden', 'true'); a.prepend(v); }
    v.play().then(() => card.classList.add('playing')).catch(() => {});
  };
  const stop = (card) => { const v = $('.thumb video', card); if (v) { v.pause(); card.classList.remove('playing'); } };
  if (finePointer) {
    document.addEventListener('pointerover', (e) => { const c = e.target.closest('.card'); if (c && !c.contains(e.relatedTarget)) start(c); });
    document.addEventListener('pointerout', (e) => { const c = e.target.closest('.card'); if (c && !c.contains(e.relatedTarget)) stop(c); });
    return;
  }
  const live = new Set();
  const mid = new IntersectionObserver((ents) => {
    for (const e of ents) {
      if (e.isIntersecting) { live.add(e.target); if (live.size > 2) { const first = live.values().next().value; live.delete(first); stop(first); } start(e.target); }
      else { live.delete(e.target); stop(e.target); }
    }
  }, { rootMargin: '-35% 0px -35% 0px' });
  $$('.card').forEach((c) => $('.thumb[data-preview]', c) && mid.observe(c));
}

// ---- 動画: 見えている間だけ流す(音なし) ----
function autoplayVideos() {
  const vio = new IntersectionObserver((ents) => {
    for (const e of ents) { const v = e.target; if (e.isIntersecting && !calm) v.play().catch(() => {}); else v.pause(); }
  }, { threshold: 0.35 });
  $$('video[data-autoplay]').forEach((v) => { v.preload = 'metadata'; vio.observe(v); });
  // 紹介動画はタップで止める/流す(音は入っていないので操作バーは出さない)
  $$('video[data-tap]').forEach((v) => v.addEventListener('click', () => (v.paused ? v.play() : v.pause())));
}

// ---- 押したときの波紋 ----
function ripples() {
  document.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.btn'); if (!b || calm) return;
    const r = b.getBoundingClientRect(); const s = Math.max(r.width, r.height);
    const dot = Object.assign(document.createElement('span'), { className: 'ripple' });
    Object.assign(dot.style, { width: `${s}px`, height: `${s}px`, left: `${e.clientX - r.left - s / 2}px`, top: `${e.clientY - r.top - s / 2}px` });
    b.append(dot); setTimeout(() => dot.remove(), 650);
  });
}

// ---- 絞り込みと検索(トップだけ) ----
function filters() {
  const grid = $('#grid'); if (!grid) return;
  const state = { cat: 'all', q: '' };
  // 個人ページのパンくずから来たら、その分類で開く
  const fromHash = new URLSearchParams(location.hash.replace(/^#list\??/, '')).get('cat');
  if (fromHash && catOf(fromHash)) state.cat = fromHash;
  const hay = Object.fromEntries(APPS.map((a) => [a.id, [a.name, a.desc, a.id, a.catch ?? '', catOf(a.cat)?.label, ...a.tags].join(' ').toLowerCase()]));
  const apply = () => {
    const q = state.q.trim().toLowerCase();
    let n = 0;
    for (const card of $$('.card', grid)) {
      const ok = (state.cat === 'all' || card.dataset.cat === state.cat) && (!q || q.split(/\s+/).every((w) => hay[card.dataset.id]?.includes(w)));
      card.hidden = !ok; if (ok) { n++; card.classList.add('in'); }
    }
    $$('.chip').forEach((c) => c.setAttribute('aria-selected', String(c.dataset.cat === state.cat)));
    $('#empty').hidden = n > 0;
    const label = state.cat === 'all' ? 'すべて' : catOf(state.cat).label;
    $('#result').textContent = `${label}: ${n} 本${state.q ? `(「${state.q}」で絞り込み)` : ''}`;
  };
  const go = () => (document.startViewTransition && !calm ? document.startViewTransition(apply) : apply());
  $('.chips').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; state.cat = b.dataset.cat; go(); });
  $('#q').addEventListener('input', (e) => { state.q = e.target.value; apply(); });
  if (state.cat !== 'all') apply();
}

// ---- 共有(個人ページ) ----
function share() {
  const b = $('[data-share]'); if (!b) return;
  b.addEventListener('click', async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} return; }
    try { await navigator.clipboard.writeText(location.href); toast('リンクをコピーしました'); } catch { toast(location.href); }
  });
}
function toast(msg) {
  const t = Object.assign(document.createElement('div'), { className: 'toast', textContent: msg });
  document.body.append(t); setTimeout(() => t.remove(), 2200);
}

// ---- どのアプリが開かれたかを数える(匿名) ----
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-open]'); if (!a) return;
  const app = APPS.find((x) => x.id === a.dataset.open); if (app) trackOpen(app.name);
});

watchReveal();
countUp();
tilt();
previews();
autoplayVideos();
ripples();
filters();
share();
initAnalytics();
