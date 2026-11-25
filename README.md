# パピーペット復活ライブ「さるの恩返し」LP

2027.5.15 SAT @アメリカ村 DROP の告知ランディングページ。静的HTML 1枚＋画像で、ビルド工程はありません。

## 構成

```
public/            公開されるファイル（静的アセット）
  index.html       ページ本体（CSS・JSも同梱）
  assets/          画像（KVパーツ、写真、グッズ、フッター背景、マスコットSVG）
src/worker.js      サイト全体にかける Basic 認証（Cloudflare Workers）
wrangler.jsonc     Workers の設定（public/ を配信し、先に worker.js を通す）
```

## Cloudflare Workers の設定

GitHub 連携で作成する場合の入力値：

| 項目 | 値 |
| --- | --- |
| ビルド コマンド | （空欄） |
| デプロイ コマンド | `npx wrangler deploy` |

### Basic 認証

Worker の Settings → Variables and Secrets に次の2つを **Secret** として登録します。

- `BASIC_USER` … ユーザー名
- `BASIC_PASS` … パスワード

どちらかが未設定のあいだは 503 を返し、ページは誰にも表示されません。

### ローカルで確認

```bash
printf 'BASIC_USER=test\nBASIC_PASS=test\n' > .dev.vars   # .gitignore 済み
npx wrangler dev
```

## 差し替えが残っているもの

- チケット購入・SUZURI・パピ録チャンネル（YouTube）のリンクは `href="#"` の仮置き（`index.html` 内の `TODO` コメント）
- 写真・グッズ画像はデザインラフから切り出した低解像度の仮素材
