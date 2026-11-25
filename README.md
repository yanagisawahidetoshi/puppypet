# パピーペット復活ライブ「さるの恩返し」LP

2027.5.15 SAT @アメリカ村 DROP の告知ランディングページ。静的HTML 1枚＋画像で、ビルド工程はありません。

## 構成

```
public/            公開されるファイル（Cloudflare Pages の出力ディレクトリ）
  index.html       ページ本体（CSS・JSも同梱）
  assets/          画像（KVパーツ、写真、グッズ、フッター背景、マスコットSVG）
functions/
  _middleware.js   サイト全体にかける Basic 認証（Cloudflare Pages Functions）
```

## Cloudflare Pages の設定

| 項目 | 値 |
| --- | --- |
| Framework preset | None |
| Build command | （空欄） |
| Build output directory | `public` |

### Basic 認証

Settings → Variables and Secrets に次の2つを **Secret** として登録し、再デプロイします（Production / Preview の両方）。

- `BASIC_USER` … ユーザー名
- `BASIC_PASS` … パスワード

どちらかが未設定のあいだは 503 を返し、ページは誰にも表示されません。

## 差し替えが残っているもの

- チケット購入・SUZURI・パピ録チャンネル（YouTube）のリンクは `href="#"` の仮置き（`index.html` 内の `TODO` コメント）
- 写真・グッズ画像はデザインラフから切り出した低解像度の仮素材
