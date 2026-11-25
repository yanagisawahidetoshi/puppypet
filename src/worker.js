// Cloudflare Workers: public/ の静的ファイルを配信する前に、サイト全体へ Basic 認証をかける。
// （wrangler.jsonc の assets.run_worker_first: true により、全リクエストが先にここを通る）
// ユーザー名とパスワードは Cloudflare 側の環境変数 BASIC_USER / BASIC_PASS で設定する（リポジトリには書かない）。
// どちらかが未設定のあいだは誰も入れない（503 を返す）。

const REALM = "PUPPYPET preview";

function unauthorized() {
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

// 長さや一致位置が処理時間に出ないよう、ハッシュ同士を固定時間で比べる
async function safeEqual(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const x = new Uint8Array(ha);
  const y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export default {
  async fetch(request, env) {
    const user = env.BASIC_USER;
    const pass = env.BASIC_PASS;

    if (!user || !pass) {
      return new Response("Basic auth is not configured (set BASIC_USER and BASIC_PASS).", {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const header = request.headers.get("Authorization") || "";
    const [scheme, encoded] = header.split(" ");
    if (scheme !== "Basic" || !encoded) return unauthorized();

    let decoded;
    try {
      decoded = new TextDecoder().decode(Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)));
    } catch {
      return unauthorized();
    }
    const sep = decoded.indexOf(":");
    if (sep < 0) return unauthorized();

    const okUser = await safeEqual(decoded.slice(0, sep), user);
    const okPass = await safeEqual(decoded.slice(sep + 1), pass);
    if (!(okUser && okPass)) return unauthorized();

    // 認証を通ったら静的ファイルを返す
    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("X-Robots-Tag", "noindex, nofollow");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
};
