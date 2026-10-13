# MyApps — junia2009 のアプリ置き場

自分で作ったアプリを紹介するページ。ブラウザで動く個人開発アプリを一覧にしている。

**▶ https://junia2009.github.io/MyApps/**

## できること

- 分類(ゲーム / 癒し・鑑賞 / つくる / 暮らし・便利 / 学び / セキュリティ・CTF)で絞り込む
- 名前・説明・技術(例: `three`)で探す
- 各アプリのカードから、公開先とソースへ飛ぶ
- スマホ・PC、ダーク・ライトのどちらでも読める

## アプリを足すとき

1. `apps.js` の `APPS` に1件足す(書き方はファイルの先頭にある)
2. 画面を撮って `thumbs/<id>.webp` に置く(縦横 3:4、480×640 くらい)
3. 見出しの「39 本」は `apps.js` の件数から自動で書き換わる

イチオシ欄は `apps.js` の `FEATURED` で選ぶ(横長の `thumbs/<id>-wide.webp` を使う)。
Qiita の記事やプロフィールへのリンクは `main.js` の先頭(`QIITA_PROFILE` / `ARTICLES`)に書くと出る。

## 構成

ビルドなし。ファイルをそのまま GitHub Pages で配信している。

```
index.html    ページの骨組み(OGP もここ)
style.css     見た目
main.js       一覧の描画・絞り込み・検索
apps.js       載せるアプリの一覧(ここだけ触れば増やせる)
analytics.js  匿名のアクセス集計(GoatCounter、Cookie なし)
thumbs/       各アプリの画面
og.png        SNS で共有したときの画像
```

## アクセス集計

[GoatCounter](https://www.goatcounter.com/) で、このページを開いた数と、どのアプリへ進んだかだけを数えている。
集計画面では `📇` から始まる行がこのページのもの。手元(localhost)では数えない。
