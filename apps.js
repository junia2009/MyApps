// 載せるアプリの一覧。新しく作ったら、ここに1件足すだけでページに出る。
//
//   id       サムネイルの名前(thumbs/<id>.webp)。GitHub のリポジトリ名と同じにしている
//   name     カードの見出し
//   desc     ひとこと説明(2行に収まるくらい)
//   cat      分類(CATEGORIES の id)
//   url      公開先
//   tags     使っている技術など
//   updated  最後に手を入れた月(並び順と「最近の更新」に使う)
//   orient   'landscape' なら横持ちで遊ぶアプリ(カードに印が出る)

export const CATEGORIES = [
  { id: 'game', label: 'ゲーム', icon: '🎮' },
  { id: 'calm', label: '癒し・鑑賞', icon: '🌊' },
  { id: 'make', label: 'つくる', icon: '🎨' },
  { id: 'life', label: '暮らし・便利', icon: '🏠' },
  { id: 'learn', label: '学び', icon: '📚' },
  { id: 'sec', label: 'セキュリティ・CTF', icon: '🔐' },
];

const GH = 'https://junia2009.github.io/';

export const FEATURED = 'hexfrontier';

export const APPS = [
  // ---- ゲーム ----
  {
    id: 'hexfrontier', name: 'Hexfrontier', cat: 'game', updated: '2026-10',
    desc: 'Three.js 製の 3D ヘックス開拓ゲーム。5種類のルールを CPU 戦と合言葉のオンライン対戦で遊べる。',
    url: GH + 'hexfrontier/', tags: ['Three.js', 'Cloudflare', 'PWA'],
  },
  {
    id: 'hover-dodge', name: 'HOVER DODGE', cat: 'game', updated: '2026-10',
    desc: 'ホバー操作で障害物をかわし続けるアクションゲーム。',
    url: GH + 'hover-dodge/', tags: ['Three.js', 'PWA'],
  },
  {
    id: 'play_the_tennis', name: 'Play the Tennis', cat: 'game', updated: '2026-10',
    desc: 'バーチャルスティックと4種のショットで戦う、スマホ向けの 3D テニス。',
    url: GH + 'play_the_tennis/', tags: ['Three.js', 'PWA'],
  },
  {
    id: 'dragon-cradle', name: 'Dragon Cradle', cat: 'game', updated: '2026-10', orient: 'landscape',
    desc: 'ドラゴンを育てて戦わせる育成バトルゲーム。',
    url: GH + 'dragon-cradle/', tags: ['Three.js', 'PWA'],
  },
  {
    id: 'my_suica_game', name: 'スライム合成パズル', cat: 'game', updated: '2026-07',
    desc: 'Matter.js の物理演算で遊ぶ合成パズル。深海でスライムを合体させて最上位を目指す。',
    url: GH + 'my_suica_game/', tags: ['Matter.js', 'PWA'],
  },
  {
    id: 'My_Jigsaw_Puzzle', name: 'マイジグソーパズル', cat: 'game', updated: '2026-07',
    desc: '好きな写真からジグソーパズルを作って遊べる。オフラインでも遊べる。',
    url: GH + 'My_Jigsaw_Puzzle/', tags: ['Canvas', 'PWA'],
  },
  {
    id: 'planet-puzzle', name: 'PLANET PUZZLE', cat: 'game', updated: '2026-06',
    desc: '惑星タイルを3枚そろえて消すマッチ3パズル。全405枚のクリアを目指す。',
    url: GH + 'planet-puzzle/', tags: ['Canvas', 'PWA'],
  },
  {
    id: 'Othello', name: 'Deep Othello', cat: 'game', updated: '2026-06',
    desc: '深海の闇に沈む石たちの戦い。CPU 対戦と2人対戦ができるオセロ。',
    url: GH + 'Othello/', tags: ['JS', 'PWA'],
  },
  {
    id: 'cosmic_shooter', name: 'Cosmic Shooter 3D', cat: 'game', updated: '2026-05',
    desc: '宇宙を舞台にした 3D シューティング。',
    url: GH + 'cosmic_shooter/', tags: ['Three.js', 'PWA'],
  },
  {
    id: 'netguard-rpg', name: 'SECURITY WARS://', cat: 'game', updated: '2026-04',
    desc: 'サイバー空間を舞台にしたアクション RPG。',
    url: GH + 'netguard-rpg/', tags: ['Canvas', 'PWA'],
  },
  {
    id: 'void-runner', name: 'VOID RUNNER', cat: 'game', updated: '2026-04', orient: 'landscape',
    desc: '宇宙を走り続けるエンドレスランナー。',
    url: GH + 'void-runner/', tags: ['Canvas', 'PWA'],
  },
  {
    id: 'card_game_1', name: '3D ソリティア', cat: 'game', updated: '2026-04',
    desc: '宇宙空間に浮かぶテーブルで遊ぶ、Three.js 製のクロンダイク・ソリティア。',
    url: GH + 'card_game_1/', tags: ['Three.js', 'PWA'],
  },
  {
    id: 'breaking_block', name: 'STAR BREAKER', cat: 'game', updated: '2026-04',
    desc: '銀河を舞台にしたブロック崩し。',
    url: GH + 'breaking_block/', tags: ['Three.js', 'PWA'],
  },
  {
    id: 'my_aquarium', name: '癒し水槽 ― エビ育成', cat: 'game', updated: '2026-09',
    desc: '水槽でエビを育てる、のんびり育成ゲーム。',
    url: GH + 'my_aquarium/', tags: ['Canvas', 'PWA'],
  },

  // ---- 癒し・鑑賞 ----
  {
    id: 'aquarium2', name: '大水槽 ― バーチャル水族館', cat: 'calm', updated: '2026-09',
    desc: '水の光学現象も生き物の形も泳ぎ方も、すべてコードで手続き生成した Three.js の水族館。',
    url: GH + 'aquarium2/', tags: ['Three.js', 'Vite', 'PWA'],
  },
  {
    id: 'fire_works', name: '花火シミュレーター', cat: 'calm', updated: '2026-08',
    desc: '空気抵抗・風・燃焼・黒体放射・音速までモデル化した、物理演算の打ち上げ花火。',
    url: GH + 'fire_works/', tags: ['WebGL2', 'PWA'],
  },
  {
    id: 'relax_space', name: 'Relax Space', cat: 'calm', updated: '2026-10',
    desc: '瞑想とリラックスのための、静かな空間。',
    url: GH + 'relax_space/', tags: ['Three.js', 'Vite', 'PWA'],
  },

  // ---- つくる ----
  {
    id: '3d_model_studio', name: '3D Model Studio', cat: 'make', updated: '2026-10',
    desc: '部品を組み合わせて 3D モデルを作れる、ブラウザのスタジオ。',
    url: GH + '3d_model_studio/', tags: ['Three.js', 'Vite'],
  },
  {
    id: 'stamp_generater', name: 'LINE スタンプメーカー', cat: 'make', updated: '2026-10',
    desc: 'ブラウザだけで LINE スタンプを作成。背景透過・白フチ・文字入れから申請用 ZIP まで。',
    url: GH + 'stamp_generater/', tags: ['TypeScript', 'Vite', 'PWA'],
  },
  {
    id: 'cosmic-score', name: 'Cosmic Score', cat: 'make', updated: '2026-04', orient: 'landscape',
    desc: 'ピアノロールと Gemini AI を載せた、ブラウザの音楽スタジオ。',
    url: GH + 'cosmic-score/', tags: ['Web Audio', 'MIDI', 'Gemini'],
  },

  // ---- 暮らし・便利 ----
  {
    id: 'smart_home_db', name: 'リビング環境ダッシュボード', cat: 'life', updated: '2026-10',
    desc: 'SwitchBot Hub 2 の温度・湿度・照度を15分ごとに記録して、グラフで見られる。',
    url: GH + 'smart_home_db/', tags: ['SwitchBot', 'GitHub Actions', 'PWA'],
  },
  {
    id: 'Home_loan_rate', name: '住宅ローン金利ナビ', cat: 'life', updated: '2026-10',
    desc: '各銀行の変動金利を比べて、借入額と期間から返済額をシミュレーションできる。',
    url: GH + 'Home_loan_rate/', tags: ['Next.js', 'TypeScript'],
  },
  {
    id: 'higashikurume_gomi', name: '東久留米ごみナビ', cat: 'life', updated: '2026-07',
    desc: '東久留米市のごみ分別検索と収集日カレンダー。今日・明日出せるごみが一目でわかる。',
    url: GH + 'higashikurume_gomi/', tags: ['JS', 'PWA'],
  },
  {
    id: 'used_good_list', name: 'Totte', cat: 'life', updated: '2026-06',
    desc: '日用品のパッケージ写真とメーカーを家族で共有して、買い間違いを防ぐ。',
    url: 'https://used-goods-list.web.app/', tags: ['React', 'Firebase', 'PWA'],
  },
  {
    id: 'family-memo', name: '家族めも', cat: 'life', updated: '2026-06',
    desc: '家族で共有できるメモアプリ。',
    url: 'https://memo0901-7138a.web.app', tags: ['React', 'Firebase', 'PWA'],
  },
  {
    id: 'my-tasks', name: 'Abyss タスク管理', cat: 'life', updated: '2026-06',
    desc: '深海テーマの、スマホ特化のタスク管理。データはすべて端末の中に保存。',
    url: GH + 'my-tasks/', tags: ['React', 'TypeScript', 'PWA'],
  },
  {
    id: 'app_timer', name: 'My タイマー', cat: 'life', updated: '2026-09',
    desc: '日本標準時の表示とカウントダウンができる、シンプルなタイマー。',
    url: GH + 'app_timer/', tags: ['JS', 'PWA'],
  },
  {
    id: 'droid_navi', name: 'RT91 Navi', cat: 'life', updated: '2026-04',
    desc: 'アストロメク風のナビゲータードロイドが、天気と時刻を教えてくれる。',
    url: GH + 'droid_navi/', tags: ['Three.js', 'PWA'],
  },
  {
    id: 'suudoku_resolver', name: 'ナンプレ絶対解くマン', cat: 'life', updated: '2026-04',
    desc: '写真を撮るか選ぶだけで、数独を読み取って解く。',
    url: GH + 'suudoku_resolver/', tags: ['OpenCV.js', 'Tesseract.js', 'PWA'],
  },
  {
    id: 'disc-shelf', name: 'DISC SHELF', cat: 'life', updated: '2026-08',
    desc: '自作アプリをレコードに見立てて棚に並べる、3D のアプリポータル。',
    url: GH + 'disc-shelf/', tags: ['Three.js', 'PWA'],
  },

  // ---- 学び ----
  {
    id: 'vocabulary_book', name: '単語帳', cat: 'learn', updated: '2026-07',
    desc: '間隔反復・発音・クイズ・学習記録に対応した、汎用のフラッシュカード。',
    url: GH + 'vocabulary_book/', tags: ['JS', 'PWA'],
  },
  {
    id: 'webdev-reference', name: 'WebDev Reference', cat: 'learn', updated: '2026-05',
    desc: 'JS / HTML5 / Three.js / CSS のリファレンス。',
    url: GH + 'webdev-reference/', tags: ['PWA'],
  },
  {
    id: 'grow-recruiter-app', name: 'GROW モデル ワークシート', cat: 'learn', updated: '2026-02',
    desc: 'GROW モデルで目標と行動を整理する、実践用のワークシート。',
    url: GH + 'grow-recruiter-app/', tags: ['HTML'],
  },

  // ---- セキュリティ・CTF ----
  {
    id: 'log_hunter', name: 'CTF ログハンター', cat: 'sec', updated: '2026-02',
    desc: 'ログファイルから怪しい箇所やフラグを抜き出す。',
    url: GH + 'log_hunter/', tags: ['JS'],
  },
  {
    id: 'photo_geo_locator', name: 'Photo Geo Locator', cat: 'sec', updated: '2026-02',
    desc: '写真に残った位置情報を調べる。',
    url: GH + 'photo_geo_locator/', tags: ['JS'],
  },
  {
    id: 'RSA_decoder', name: 'RSA デコーダー', cat: 'sec', updated: '2026-02',
    desc: 'RSA 暗号の暗号化と復号。',
    url: GH + 'RSA_decoder/', tags: ['JS'],
  },
  {
    id: 'caesar_decoder', name: 'Caesar デコーダー', cat: 'sec', updated: '2026-02',
    desc: 'シーザー暗号を復号する。',
    url: GH + 'caesar_decoder/', tags: ['JS'],
  },
  {
    id: 'hex-decoder', name: 'Hex デコーダー', cat: 'sec', updated: '2026-02',
    desc: '16進数を文字列に戻す。',
    url: GH + 'hex-decoder/', tags: ['JS'],
  },
  {
    id: 'base64-decoder', name: 'Base64 デコーダー', cat: 'sec', updated: '2026-02',
    desc: 'Base64 のエンコードとデコード。',
    url: GH + 'base64-decoder/', tags: ['JS'],
  },
];

export const repoUrl = (app) => `https://github.com/junia2009/${app.id}`;
