# Paraglide JS i18n setup notes

## Overview

The `entry` and `profile` SvelteKit apps under `apps/svelte_projects/` use [Paraglide JS](https://paraglidejs.com/sveltekit) for internationalization, supporting `en` and `zh-hant`.

This uses monorepo Pattern 1 (each app compiles independently):
- Share a single inlang project (`apps/svelte_projects/project.inlang/`) and translation messages (`apps/svelte_projects/messages/`)
- Each app compiles via `paraglideVitePlugin` from `../project.inlang` and outputs to its own `src/lib/paraglide/`

## Directory structure

```
apps/svelte_projects/
├── project.inlang/
│   └── settings.json        # Shared inlang project (baseLocale, locales, plugin)
├── messages/
│   ├── en.json              # English translations
│   └── zh-hant.json         # Traditional Chinese translations
├── entry/
│   ├── vite.config.ts       # paraglideVitePlugin (project: '../project.inlang')
│   ├── src/
│   │   ├── app.html         # <html lang="%lang%" dir="%dir%">
│   │   ├── hooks.server.ts  # paraglideMiddleware
│   │   ├── hooks.ts         # reroute (deLocalizeUrl)
│   │   ├── lib/paraglide/   # Compiled output (auto-gitignored)
│   │   └── routes/
│   │       ├── +layout.svelte  # locale switcher (data-sveltekit-reload)
│   │       └── +page.svelte    # use m.*() instead of hardcoded strings
│   └── Dockerfile
└── profile/
    └── (same structure as entry)
```

## Key settings

### vite.config.ts

```ts
paraglideVitePlugin({
    project: '../project.inlang',
    outdir: './src/lib/paraglide',
    emitTsDeclarations: true,
    experimentalPerLocaleBuild: true,    // requires Vite 8 + SvelteKit 2.69+
    strategy: ['url', 'cookie', 'baseLocale']
})
```

- `experimentalPerLocaleBuild`: produces an independent client asset graph per locale (`_app/immutable/__paraglide/zh-hant-<hash>/`); the base locale still uses `_app/immutable/`
- `strategy`: URL first (`/` = en, `/zh-hant` = zh-hant), then cookie, finally falls back to baseLocale

### app.html

```html
<!doctype html>
<html lang="%lang%" dir="%dir%">
```

`%lang%` / `%dir%` are replaced by `transformPageChunk` in `hooks.server.ts` during SSR.

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

### hooks.ts (reroute)

```ts
export const reroute: Reroute = (request) => deLocalizeUrl(request.url).pathname;
```

`reroute` must be placed in `src/hooks.ts` (not `hooks.server.ts`) so SvelteKit maps localized URLs (e.g., `/zh-hant/`) to the unlocalized internal route.

### +layout.svelte (locale switcher)

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

`data-sveltekit-reload` is required: cross-locale navigation must be a full document reload (not hydration only), otherwise client graphs of different locales get mixed. This switcher also lets the SvelteKit prerender crawler reach pages of every locale.

### Preserving locale across apps (subdomains)

`entry` (`www.yutinglia.com`) and `profile` (`profile.yutinglia.com`) are two independent SvelteKit apps deployed on different subdomains. The strategy is `['url', 'cookie', 'baseLocale']`, but:

- The default pattern of the `url` strategy `:protocol://:domain(.*)::port?/:path(.*)?` matches *any* URL (the base locale `en` pattern has no prefix), so the root URL `/` always resolves to `en` and the cookie strategy never gets a turn.
- `cookieDomain` defaults to `""` (no domain attribute written), so the cookie only attaches to the current subdomain and won't cross `www` ↔ `profile`.

In other words, when a user on `www.yutinglia.com/zh-hant` clicks a profile link that is hardcoded as `https://profile.yutinglia.com`, they land on `profile.yutinglia.com/` (English); the locale is not remembered.

**Solution**: wrap cross-app links with `localizeHref()` for absolute URLs. `localizeHref` internally uses `getLocale()` to determine the current locale, then applies the URL pattern to add the prefix:

```svelte
<!-- entry/+page.svelte -->
href: localizeHref("https://profile.yutinglia.com")
// in en build  → "https://profile.yutinglia.com"
// in zh-hant build → "https://profile.yutinglia.com/zh-hant"

<!-- profile/+page.svelte -->
href={localizeHref("https://www.yutinglia.com")}
```

With `experimentalPerLocaleBuild: true`, each per-locale build defines `__PARAGLIDE_STATIC_LOCALE__` as that locale, so `getLocale()` is the build's locale at build time and the prerendered HTML links carry the correct prefix. Note:

- No need to set `cookieDomain: "yutinglia.com"`. Under SSG, nginx serves static HTML directly without reading cookies, so cross-subdomain cookies have no effect in this architecture.
- `localizeHref` returns an absolute URL (with origin) for cross-origin URLs rather than degrading to a relative path, which suits cross-app links.

## Using messages

```ts
import * as m from "$lib/paraglide/messages.js";

m.entry_tagline();                          // "IT engineer · Hong Kong. ..."
m.copyright_year({ year: 2026 });            // "© 2026 Ting"
m.profile_role({ locale: "zh-hant" });       // force a specific locale
```

## SSG / Prerender

Both apps use `adapter-static` + `prerender = true`:

- `/` → en (baseLocale, no prefix)
- `/zh-hant` → zh-hant (URL prefix)

Build output:
```
build/
├── index.html          # en, <html lang="en" dir="ltr">
├── zh-hant.html        # zh-hant, <html lang="zh-hant" dir="ltr">
└── _app/immutable/
    ├── __paraglide/zh-hant-<hash>/   # zh-hant-specific client graph
    └── (base locale uses _app/immutable)
```

## Pitfalls encountered

### 1. Docker build ENOENT for settings.json

**Symptom**: CI `docker build` fails:
```
ERROR [paraglide-js] Failed to compile project:
ENOENT: no such file or directory, open '../project.inlang/settings.json'
```

**Cause**: The Dockerfile only `COPY shared/` and the app directory; it does not copy the workspace root's `project.inlang/` and `messages/`. `vite.config.ts` uses `project: '../project.inlang'` (relative to the app directory), which inside the container points to `/build/project.inlang/`, but that directory does not exist.

**Fix**: Add the following to the Dockerfile before the build:
```dockerfile
COPY project.inlang/ project.inlang/
COPY messages/ messages/
```

### 2. `resolve(localizeHref(...))` type error

**Symptom**: svelte-check reports:
```
Argument of type '[string]' is not assignable to parameter of type
'[route: "/"] | [route: `/?${string}`] | [route: `/#${string}`]'.
```

**Cause**: SvelteKit 2.70's `resolve()` from `$app/paths` is strictly typed to known routes and does not accept a plain string. The Paraglide docs example `resolve(localizeHref(...))` does not typecheck on this version.

**Fix**: Use `base` concatenation instead (`base` is an empty string in this project, so behavior is identical):
```svelte
href={`${base}${localizeHref(page.url.pathname, { locale })}`}
```

### 3. Compiled output is not in git

`src/lib/paraglide/` has an auto-generated `.gitignore` (content `*`) from paraglide, so the entire directory is not version-controlled.

**Impact**: Running `svelte-check` right after clone reports "cannot find `$lib/paraglide/*`"; you must run `pnpm dev` or `pnpm build` once first so the vite plugin emits the files.

### 4. nginx 404 for `/zh-hant` (extension-less route)

**Symptom**: After deploying the Docker container (`nginx:alpine`), visiting `/zh-hant` returns 404; only `/` works.

**Cause**: `adapter-static`'s prerender for non-base locales produces `build/zh-hant.html` (a single file, not a `zh-hant/index.html` directory). nginx's default `try_files` does not try `.html` extension fallback, so `/zh-hant` finds no matching file.

**Fix**: Custom nginx config (`shared/nginx/default.conf.template`, COPY'd to `/etc/nginx/conf.d/default.conf` in the Dockerfile), adding `.html` fallback:

```nginx
location / {
    try_files $uri $uri.html $uri/ =404;
}
```

Also add an immutable caching header for `_app/immutable/` (SvelteKit assets include per-locale paraglide client graphs; filenames are hashed and safe to cache permanently).

### 5. nginx 404 for `/zh-hant/` (trailing slash)

**Symptom**: After fixing `/zh-hant`, `/zh-hant/` (with trailing slash) still returns 404.

**Cause**: `try_files $uri $uri.html $uri/` for `/zh-hant/` tries `/zh-hant/`, `/zh-hant/.html` (invalid), and `/zh-hant/` (no index); all fail.

**Fix**: Add a regex location to redirect trailing slashes to the `.html` of the same name:

```nginx
location ~ ^/(.+)/$ {
    try_files $uri /$1.html =404;
}
```

### 6. `/zh-hant` page has no styles (asset 404)

**Symptom**: The `/zh-hant` HTML loads but CSS/JS under `_app/immutable/...` all 404, leaving the page unstyled. The browser requests `/zh-hant/_app/...` instead of `/_app/...`.

**Cause**: Asset paths in `zh-hant.html` are **relative** (`./_app/...`). When visiting `/zh-hant/` (trailing slash), the browser resolves `./_app/...` relative to `/zh-hant/`, yielding `/zh-hant/_app/...`, which does not exist (assets live under the root `_app/`).

**Fix**: Set `kit.paths.relative = false` in `svelte.config.js` so SvelteKit emits root-absolute asset paths (`/_app/...`) that are not affected by the page URL path. This is also the setting Paraglide's SSG docs recommend for per-locale builds.

## Related files

- [project.inlang/settings.json](../apps/svelte_projects/project.inlang/settings.json) — inlang project settings
- [messages/en.json](../apps/svelte_projects/messages/en.json) — English translations
- [messages/zh-hant.json](../apps/svelte_projects/messages/zh-hant.json) — Traditional Chinese translations
- [entry/vite.config.ts](../apps/svelte_projects/entry/vite.config.ts) / [profile/vite.config.ts](../apps/svelte_projects/profile/vite.config.ts) — paraglide Vite plugin
- [entry/Dockerfile](../apps/svelte_projects/entry/Dockerfile) / [profile/Dockerfile](../apps/svelte_projects/profile/Dockerfile) — Docker build (includes project.inlang + messages COPY + nginx config)
- [shared/nginx/default.conf.template](../apps/svelte_projects/shared/nginx/default.conf.template) — nginx site config (`.html` fallback + immutable caching)
- [docs/cicd_github_actions.md](cicd_github_actions.md) — CI/CD deployment notes