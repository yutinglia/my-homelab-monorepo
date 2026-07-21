# Paraglide JS i18n 設定筆記

## 概覽

`apps/svelte_projects/` 下的 `entry` 與 `profile` 兩個 SvelteKit app 使用 [Paraglide JS](https://paraglidejs.com/sveltekit) 做國際化，支援 `en` 與 `zh-hant`。

採用 monorepo Pattern 1（每個 app 各自編譯）：
- 共用一個 inlang project（`apps/svelte_projects/project.inlang/`）與翻譯訊息（`apps/svelte_projects/messages/`）
- 每個 app 透過 `paraglideVitePlugin` 從 `../project.inlang` 編譯，輸出到各自的 `src/lib/paraglide/`

## 目錄結構

```
apps/svelte_projects/
├── project.inlang/
│   └── settings.json        # 共用 inlang project (baseLocale, locales, plugin)
├── messages/
│   ├── en.json              # 英文翻譯
│   └── zh-hant.json         # 繁體中文翻譯
├── entry/
│   ├── vite.config.ts       # paraglideVitePlugin (project: '../project.inlang')
│   ├── src/
│   │   ├── app.html         # <html lang="%lang%" dir="%dir%">
│   │   ├── hooks.server.ts  # paraglideMiddleware
│   │   ├── hooks.ts         # reroute (deLocalizeUrl)
│   │   ├── lib/paraglide/   # 編譯產出 (auto-gitignored)
│   │   └── routes/
│   │       ├── +layout.svelte  # locale switcher (data-sveltekit-reload)
│   │       └── +page.svelte    # 用 m.*() 取代硬編碼字串
│   └── Dockerfile
└── profile/
    └── (同 entry 結構)
```

## 關鍵設定

### vite.config.ts

```ts
paraglideVitePlugin({
    project: '../project.inlang',
    outdir: './src/lib/paraglide',
    emitTsDeclarations: true,
    experimentalPerLocaleBuild: true,    // 需 Vite 8 + SvelteKit 2.69+
    strategy: ['url', 'cookie', 'baseLocale']
})
```

- `experimentalPerLocaleBuild`: 每個 locale 產出獨立的 client asset graph（`_app/immutable/__paraglide/zh-hant-<hash>/`），base locale 仍用 `_app/immutable/`
- `strategy`: URL 為主（`/` = en, `/zh-hant` = zh-hant），cookie 次之，最後 fallback 到 baseLocale

### app.html

```html
<!doctype html>
<html lang="%lang%" dir="%dir%">
```

`%lang%` / `%dir%` 由 `hooks.server.ts` 的 `transformPageChunk` 在 SSR 時替換。

### hooks.server.ts

```ts
const paraglideHandle: Handle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
        event.request = localizedRequest;
        return resolve(event, {
            transformPageChunk: ({ html }) => html
                .replace('%lang%', locale)
                .replace('%dir%', getTextDirection(locale))
        });
    });
```

### hooks.ts（reroute）

```ts
export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
```

`reroute` 必須放在 `src/hooks.ts`（不是 `hooks.server.ts`），讓 SvelteKit 把 localized URL（如 `/zh-hant/`）對應到未本地化的內部路由。

### +layout.svelte（locale switcher）

```svelte
<script lang="ts">
    import { page } from "$app/state";
    import { base } from "$app/paths";
    import { locales, localizeHref } from "$lib/paraglide/runtime";
</script>

<nav class="locale-switcher" aria-label="Languages">
    {#each locales as locale}
        <a href={`${base}${localizeHref(page.url.pathname, { locale })}`}
           data-sveltekit-reload>
            {locale}
        </a>
    {/each}
</nav>
```

`data-sveltekit-reload` 必加：cross-locale navigation 必須是完整 document reload（不能只 hydration），否則會混用不同 locale 的 client graph。同時這個 switcher 讓 SvelteKit prerender crawler 能爬到所有 locale 的頁面。

### 跨 app（子網域）保留 locale

`entry`（`www.yutinglia.com`）和 `profile`（`profile.yutinglia.com`）是兩個獨立的 SvelteKit app，分別部署在不同子網域。strategy 是 `['url', 'cookie', 'baseLocale']`，但：

- `url` 策略的 default pattern `:protocol://:domain(.*)::port?/:path(.*)?` 對 *任何* URL 都會 match（base locale `en` 的 pattern 沒有 prefix），所以 root URL `/` 永遠解析成 `en`，cookie 策略根本輪不到。
- `cookieDomain` 預設為 `""`（不寫 domain 屬性），cookie 只附在當前子網域，不會跨 `www` ↔ `profile`。

也就是說，使用者在 `www.yutinglia.com/zh-hant` 點 profile 連結時，若連結是硬編碼 `https://profile.yutinglia.com`，會落到 `profile.yutinglia.com/`（英文），locale 不會被記住。

**解法**：跨 app 連結改用 `localizeHref()` 包住絕對 URL。`localizeHref` 內部會用 `getLocale()` 算出當前 locale，再套 URL pattern 加 prefix：

```svelte
<!-- entry/+page.svelte -->
href: localizeHref("https://profile.yutinglia.com")
// 在 en build  → "https://profile.yutinglia.com"
// 在 zh-hant build → "https://profile.yutinglia.com/zh-hant"

<!-- profile/+page.svelte -->
href={localizeHref("https://www.yutinglia.com")}
```

`experimentalPerLocaleBuild: true` 時，每個 per-locale build 會把 `__PARAGLIDE_STATIC_LOCALE__` define 成該 locale，所以 `getLocale()` 在 build time 就是該 build 的 locale，prerender 出來的 HTML 裡連結會帶正確 prefix。注意：

- 不需要設 `cookieDomain: "yutinglia.com"`。因為 SSG 下 nginx 直接吐 static HTML，不讀 cookie，跨子網域 cookie 在這個架構裡沒有作用。
- `localizeHref` 對 cross-origin URL 會回傳絕對 URL（含 origin），不會降成相對路徑，符合跨 app 連結的需求。

## 使用訊息

```ts
import * as m from "$lib/paraglide/messages.js";

m.entry_tagline();                          // "IT engineer · Hong Kong. ..."
m.copyright_year({ year: 2026 });            // "© 2026 Ting"
m.profile_role({ locale: "zh-hant" });       // 強制特定 locale
```

## SSG / Prerender

兩個 app 都用 `adapter-static` + `prerender = true`：

- `/` → en（baseLocale，無 prefix）
- `/zh-hant` → zh-hant（URL prefix）

Build 產出：
```
build/
├── index.html          # en, <html lang="en" dir="ltr">
├── zh-hant.html        # zh-hant, <html lang="zh-hant" dir="ltr">
└── _app/immutable/
    ├── __paraglide/zh-hant-<hash>/   # zh-hant 專屬 client graph
    └── (base locale 用 _app/immutable)
```

## 踩到的坑

### 1. Docker build ENOENT for settings.json

**症狀**：CI `docker build` 失敗：
```
ERROR [paraglide-js] Failed to compile project:
ENOENT: no such file or directory, open '../project.inlang/settings.json'
```

**原因**：Dockerfile 只 `COPY shared/` 和 app 目錄，沒有 copy workspace root 的 `project.inlang/` 和 `messages/`。`vite.config.ts` 用 `project: '../project.inlang'`（相對於 app 目錄），在容器內會指到 `/build/project.inlang/`，但該目錄不存在。

**解法**：Dockerfile 在 build 前加上：
```dockerfile
COPY project.inlang/ project.inlang/
COPY messages/ messages/
```

### 2. `resolve(localizeHref(...))` type error

**症狀**：svelte-check 報錯：
```
Argument of type '[string]' is not assignable to parameter of type
'[route: "/"] | [route: `/?${string}`] | [route: `/#${string}`]'.
```

**原因**：SvelteKit 2.70 的 `resolve()` from `$app/paths` 強型別到已知路由，不接受 plain string。Paraglide 文件的範例 `resolve(localizeHref(...))` 在這個版本 typecheck 不過。

**解法**：改用 `base` 拼接（`base` 在此專案為空字串，行為等同）：
```svelte
href={`${base}${localizeHref(page.url.pathname, { locale })}`}
```

### 3. 編譯產出不在 git 裡

`src/lib/paraglide/` 由 paraglide 自動生成 `.gitignore`（內容 `*`），整個目錄不進版控。

**影響**：clone 後直接跑 `svelte-check` 會報「找不到 `$lib/paraglide/*`」，必須先跑過一次 `pnpm dev` 或 `pnpm build` 讓 vite plugin 編譯產出檔案。

### 4. nginx 404 for `/zh-hant`（無副檔名路由）

**症狀**：Docker 容器（`nginx:alpine`）部署後，訪問 `/zh-hant` 回 404，只有 `/` 正常。

**原因**：`adapter-static` 的 prerender 對非 base locale 產出的是 `build/zh-hant.html`（單一檔案，非 `zh-hant/index.html` 目錄）。nginx 預設 `try_files` 不會嘗試 `.html` 副檔名 fallback，所以 `/zh-hant` 找不到對應檔案。

**解法**：自訂 nginx config（`shared/nginx/default.conf.template`，在 Dockerfile 裡 COPY 到 `/etc/nginx/conf.d/default.conf`），加上 `.html` fallback：

```nginx
location / {
    try_files $uri $uri.html $uri/ =404;
}
```

同時加上 `_app/immutable/` 的 immutable caching header（SvelteKit 資產含 per-locale paraglide client graph，檔名有 hash 可安全永久快取）。

### 5. nginx 404 for `/zh-hant/`（trailing slash）

**症狀**：`/zh-hant` 修好後，`/zh-hant/`（結尾斜線）仍回 404。

**原因**：`try_files $uri $uri.html $uri/` 對 `/zh-hant/` 會試 `/zh-hant/`、`/zh-hant/.html`（無效）、`/zh-hant/`（無 index），都失敗。

**解法**：加一條 regex location 把 trailing slash 導向同名 `.html`：

```nginx
location ~ ^/(.+)/$ {
    try_files $uri /$1.html =404;
}
```

### 6. `/zh-hant` 頁面無樣式（asset 404）

**症狀**：`/zh-hant` HTML 載入但 `_app/immutable/...` 的 CSS/JS 全 404，頁面無樣式。瀏覽器請求的是 `/zh-hant/_app/...` 而非 `/_app/...`。

**原因**：`zh-hant.html` 的 asset 路徑是**相對**的（`./_app/...`）。訪問 `/zh-hant/`（trailing slash）時，瀏覽器把 `./_app/...` 解析成相對於 `/zh-hant/`，得到 `/zh-hant/_app/...`，但該路徑不存在（資產都在根 `_app/`）。

**解法**：`svelte.config.js` 設 `kit.paths.relative = false`，讓 SvelteKit 產出 root-absolute asset 路徑（`/_app/...`），不再受頁面 URL 路徑影響。這也是 Paraglide SSG 文件針對 per-locale build 建議的設定。

## 相關檔案

- [project.inlang/settings.json](../apps/svelte_projects/project.inlang/settings.json) — inlang project 設定
- [messages/en.json](../apps/svelte_projects/messages/en.json) — 英文翻譯
- [messages/zh-hant.json](../apps/svelte_projects/messages/zh-hant.json) — 繁體中文翻譯
- [entry/vite.config.ts](../apps/svelte_projects/entry/vite.config.ts) / [profile/vite.config.ts](../apps/svelte_projects/profile/vite.config.ts) — paraglide Vite plugin
- [entry/Dockerfile](../apps/svelte_projects/entry/Dockerfile) / [profile/Dockerfile](../apps/svelte_projects/profile/Dockerfile) — Docker build（含 project.inlang + messages COPY + nginx config）
- [shared/nginx/default.conf.template](../apps/svelte_projects/shared/nginx/default.conf.template) — nginx 站點設定（`.html` fallback + immutable caching）
- [docs/cicd_github_actions.md](cicd_github_actions.md) — CI/CD 部署筆記