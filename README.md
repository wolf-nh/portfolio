# Hill Noriko Portfolio — Darkroom

暗室で印画紙を現像するイメージのポートフォリオ。静的HTML/CSS/JSのみ（ビルド不要）。

## 見かた

- CSS/JS を更新したら、`index.html` の `?v=3` の数字を上げてください（ブラウザのキャッシュ対策）。

- `index.html` をブラウザで開くだけで表示できます。
- GitHub Pages にそのまま置けば公開できます。

## 原稿の差し替え（`data/` だけ触ればOK）

| ファイル | 内容 |
|---|---|
| `data/site.js` | 名前、肩書き、エフェクト初期値、works のタブ順（`workGroups`） |
| `data/works.js` | 実績。全作品が works に並びます。`group` で works のタブ、`top: 1〜8` で TOP 掲載（0 は非掲載） |
| `data/history.js` | 経歴。`works` に実績の `id` を並べるとサムネイルになります |
| `data/profile.js` | history 左側のプロフィール本文と補足（Tools など） |

### 実績を追加する

1. 画像を `images/works/` に置く（TOP用の四つ切り画像は `images/print/`）
2. `data/works.js` に1ブロック追加（既存のブロックをコピーして書き換え）
3. history に出す場合は `data/history.js` の該当期間の `works` に `id` を追加

### TOP の画像

- `print` に四つ切り用の画像を指定します。空の場合は `images` の1枚目を使います。
- `printShape` は用紙の向きで、`"portrait"`（縦）か `"landscape"`（横）を指定します。
- 置き場所は `assets/js/top.js` の `SLOTS` で調整します。どの作品をどこに置くか、傾き・重なり・現像の順番は、読み込むたびにランダムに決まります。
- OFF時のグリッドは `works.js` の `top` の順に並びます。

## 構成

```
index.html          TOP（暗室）
works.html          カテゴリ別の全作品（タブ切り替え）
history.html        経歴（プロフィール＋年表）
data/               原稿
images/             画像
assets/css/style.css
assets/js/water.js  水面・霧・反射光の背景（WebGL）
assets/js/ink.js    インクのにじみ・水滴（ヘッダーのホバー、モーダルでマウスを止めたとき）
assets/js/common.js 全ページ共通（エフェクト切り替え、作品詳細モーダル）
assets/js/top.js    TOP の動作
assets/js/works-page.js    works の動作
assets/js/history-page.js  history の動作
```
