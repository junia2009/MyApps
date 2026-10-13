// scripts/build.mjs が書き出す。手で編集しない
const CACHE = 'myapps-mv6tkp0z';
const PRECACHE = [
  "./",
  "style.css",
  "main.js",
  "site.js",
  "apps.js",
  "analytics.js",
  "icon.svg",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "thumbs/3d_model_studio.webp",
  "thumbs/Home_loan_rate.webp",
  "thumbs/My_Jigsaw_Puzzle.webp",
  "thumbs/Othello.webp",
  "thumbs/RSA_decoder.webp",
  "thumbs/app_timer.webp",
  "thumbs/aquarium2.webp",
  "thumbs/base64-decoder.webp",
  "thumbs/breaking_block.webp",
  "thumbs/caesar_decoder.webp",
  "thumbs/card_game_1.webp",
  "thumbs/cosmic-score.webp",
  "thumbs/cosmic_shooter.webp",
  "thumbs/disc-shelf.webp",
  "thumbs/dragon-cradle.webp",
  "thumbs/droid_navi.webp",
  "thumbs/family-memo.webp",
  "thumbs/fire_works.webp",
  "thumbs/grow-recruiter-app.webp",
  "thumbs/hex-decoder.webp",
  "thumbs/hexfrontier-wide.webp",
  "thumbs/hexfrontier.webp",
  "thumbs/hover-dodge.webp",
  "thumbs/log_hunter.webp",
  "thumbs/my-tasks.webp",
  "thumbs/my_aquarium.webp",
  "thumbs/my_suica_game.webp",
  "thumbs/netguard-rpg.webp",
  "thumbs/photo_geo_locator.webp",
  "thumbs/planet-puzzle.webp",
  "thumbs/play_the_tennis.webp",
  "thumbs/relax_space.webp",
  "thumbs/smart_home_db.webp",
  "thumbs/stamp_generater.webp",
  "thumbs/suudoku_resolver.webp",
  "thumbs/used_good_list.webp",
  "thumbs/vocabulary_book.webp",
  "thumbs/void-runner.webp",
  "thumbs/webdev-reference.webp",
  "apps/hexfrontier/",
  "apps/hover-dodge/",
  "apps/play_the_tennis/",
  "apps/dragon-cradle/",
  "apps/my_suica_game/",
  "apps/My_Jigsaw_Puzzle/",
  "apps/planet-puzzle/",
  "apps/Othello/",
  "apps/cosmic_shooter/",
  "apps/netguard-rpg/",
  "apps/void-runner/",
  "apps/card_game_1/",
  "apps/breaking_block/",
  "apps/my_aquarium/",
  "apps/aquarium2/",
  "apps/fire_works/",
  "apps/relax_space/",
  "apps/3d_model_studio/",
  "apps/stamp_generater/",
  "apps/cosmic-score/",
  "apps/smart_home_db/",
  "apps/Home_loan_rate/",
  "apps/used_good_list/",
  "apps/family-memo/",
  "apps/my-tasks/",
  "apps/app_timer/",
  "apps/droid_navi/",
  "apps/suudoku_resolver/",
  "apps/disc-shelf/",
  "apps/vocabulary_book/",
  "apps/webdev-reference/",
  "apps/grow-recruiter-app/",
  "apps/log_hunter/",
  "apps/photo_geo_locator/",
  "apps/RSA_decoder/",
  "apps/caesar_decoder/",
  "apps/hex-decoder/",
  "apps/base64-decoder/"
];

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
