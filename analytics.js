// 匿名のアクセス集計(GoatCounter)。Hexfrontier と同じ集計画面に出す。
//
// 集計画面ではパスが大きく出るので、日本語で「何が起きたか」を送る。
// 先頭の 📇 が、このページ(アプリ置き場)から来た行の印。
//   📇 アプリ置き場を開いた
//   📇 → Hexfrontier を開いた
// 送るのはアプリの名前(apps.js に書いた固定の値)だけ。Cookie は使わない。
// 手元の確認(localhost / ファイル直開き)と自動テスト(navigator.webdriver)では数えない。

const ENDPOINT = 'https://hexfrontier.goatcounter.com/count';
const SCRIPT = 'https://gc.zgo.at/count.js';
const PAGEVIEW = { path: '📇 アプリ置き場を開いた', title: 'アプリ置き場(MyApps)のトップ' };

let enabled = false;
const queue = [];

function shouldCount() {
  if (navigator.webdriver) return false;
  return !['localhost', '127.0.0.1', '[::1]', ''].includes(location.hostname);
}

export function initAnalytics() {
  if (enabled || !shouldCount()) return;
  enabled = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = SCRIPT;
  s.dataset.goatcounter = ENDPOINT;
  s.dataset.goatcounterSettings = JSON.stringify(PAGEVIEW);
  s.onload = flush;
  document.head.appendChild(s);
}

export function trackOpen(appName) {
  if (!enabled) return;
  queue.push({ path: `📇 → ${appName} を開いた`, title: 'アプリ置き場からアプリを開いた' });
  flush();
}

function flush() {
  const gc = window.goatcounter;
  if (!gc?.count) return;
  while (queue.length) {
    try { gc.count({ ...queue.shift(), event: true }); } catch { /* 集計の失敗でページを止めない */ }
  }
}
