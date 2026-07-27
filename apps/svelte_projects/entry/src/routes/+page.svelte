<script lang="ts">
    import { AuroraVeil, SiteFooter, SiteHeader } from "@homelab/shared";
    import * as m from "$lib/paraglide/messages.js";
    import { locales, localizeHref, getLocale } from "$lib/paraglide/runtime";
    import { base } from "$app/paths";
    import { page } from "$app/state";

    const homeHref = $derived(`${base}${localizeHref("/")}`);
    const projectsHref = $derived(`${base}${localizeHref("/projects")}`);
    const profileHref = $derived(localizeHref("https://profile.yutinglia.com"));

    const navItems = $derived([
        { label: m.nav_home(), href: homeHref, current: true },
        { label: m.nav_projects(), href: projectsHref },
        { label: m.nav_profile(), href: profileHref },
    ]);

    const localeOptions = $derived(
        locales.map((locale) => ({
            locale,
            href: `${base}${localizeHref(page.url.pathname, { locale })}`,
            label: locale === "en" ? m.lang_en() : m.lang_zh_hant(),
        })),
    );

    const signals = $derived([
        {
            label: m.entry_signal_location_label(),
            value: m.entry_signal_location_value(),
        },
        {
            label: m.entry_signal_focus_label(),
            value: m.entry_signal_focus_value(),
        },
        {
            label: m.entry_signal_services_label(),
            value: m.entry_signal_services_value(),
        },
    ]);

    const paths = $derived([
        {
            index: "01",
            title: m.entry_path_profile_title(),
            description: m.entry_path_profile_desc(),
            href: profileHref,
            external: false,
        },
        {
            index: "02",
            title: m.entry_path_github_title(),
            description: m.entry_path_github_desc(),
            href: "https://github.com/yutinglia",
            external: true,
        },
        {
            index: "03",
            title: m.entry_path_email_title(),
            description: m.entry_path_email_desc(),
            href: "mailto:yutinglia@gmail.com",
            external: false,
        },
    ]);

    let year = $state(new Date().getFullYear());
</script>

<svelte:head>
    <title>{m.entry_meta_title()}</title>
    <meta name="description" content={m.entry_meta_description()} />
    <meta name="theme-color" content="#071018" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={m.entry_meta_title()} />
    <meta property="og:description" content={m.entry_meta_description()} />
    <meta property="og:url" content="https://www.yutinglia.com/" />
    <meta property="og:image" content="https://www.yutinglia.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<AuroraVeil />

<a class="av-skip" href="#main">{m.skip_to_content()}</a>

<div class="av-overlay av-overlay-center">
    <SiteHeader
        brandHref={homeHref}
        brandSubtitle="Homelab"
        {navItems}
        currentLocale={getLocale()}
        {localeOptions}
        localeAriaLabel={m.languages_aria()}
    />

    <main id="main">
        <section class="hero">
            <div class="hero-copy">
                <p class="eyebrow">{m.entry_eyebrow()}</p>
                <p class="hero-name">{m.entry_name()}</p>
                <h1 class="display-title">
                    {m.entry_hero_title()}<br />
                    <span class="muted-line">{m.entry_hero_title_muted()}</span>
                </h1>
                <p class="body-lead hero-intro">{m.entry_tagline()}</p>
                <div class="hero-actions">
                    <a class="button-primary" href={projectsHref}>
                        {m.entry_cta_projects()}
                        <span aria-hidden="true">↘</span>
                    </a>
                    <a class="button-secondary" href={profileHref}>
                        {m.entry_cta_profile()}
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </div>

            <aside class="signal-card glass-panel" aria-label={m.entry_signal_label()}>
                <div class="signal-card-header">
                    <span class="eyebrow signal-eyebrow">{m.entry_signal_label()}</span>
                    <span class="status-pill">
                        <span class="status-dot" aria-hidden="true"></span>
                        Online
                    </span>
                </div>
                <div class="signal-grid">
                    {#each signals as signal}
                        <div class="signal-item">
                            <span>{signal.label}</span>
                            <strong>{signal.value}</strong>
                        </div>
                    {/each}
                </div>
                <div class="signal-graph" aria-hidden="true">
                    {#each [34, 58, 44, 76, 52, 86, 64, 94, 72, 88, 60, 78] as height}
                        <span style={`height: ${height}%`}></span>
                    {/each}
                </div>
            </aside>
        </section>

        <section class="featured-section" aria-labelledby="featured-title">
            <div class="section-intro">
                <p class="eyebrow">{m.entry_featured_label()}</p>
                <h2 class="section-heading" id="featured-title">
                    {m.entry_featured_heading()}
                </h2>
            </div>

            <article class="featured-card glass-panel">
                <div class="featured-visual">
                    <img
                        src={`${base}/projects/setlist-og.png`}
                        alt=""
                        width="1731"
                        height="909"
                    />
                    <span class="status-pill featured-status">
                        <span class="status-dot" aria-hidden="true"></span>
                        {m.project_live()}
                    </span>
                </div>
                <div class="featured-copy">
                    <div>
                        <p class="project-kicker">{m.project_setlist_kicker()}</p>
                        <h3>{m.project_setlist_title()}</h3>
                        <p>{m.entry_featured_desc()}</p>
                    </div>
                    <div class="featured-actions">
                        <a
                            class="button-primary"
                            href="https://setlist.yutinglia.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {m.entry_featured_open()}
                            <span aria-hidden="true">↗</span>
                        </a>
                        <a class="text-link" href={projectsHref}>
                            {m.entry_featured_details()}
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </article>
        </section>

        <section class="paths-section" aria-labelledby="paths-title">
            <div class="section-intro paths-intro">
                <p class="eyebrow">{m.entry_paths_label()}</p>
                <h2 class="section-heading" id="paths-title">
                    {m.entry_paths_heading()}
                </h2>
            </div>

            <nav class="path-list" aria-label={m.entry_paths_label()}>
                {#each paths as item}
                    <a
                        class="path-item"
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                    >
                        <span class="path-index">{item.index}</span>
                        <span class="path-copy">
                            <strong>{item.title}</strong>
                            <span>{item.description}</span>
                        </span>
                        <span class="path-arrow" aria-hidden="true">↗</span>
                    </a>
                {/each}
            </nav>
        </section>
    </main>

    <SiteFooter
        copyright={m.copyright_year({ year })}
        status={m.footer_status()}
        links={[
            {
                label: m.footer_github(),
                href: "https://github.com/yutinglia",
                external: true,
            },
        ]}
    />
</div>

<style>
    .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.65fr);
        align-items: end;
        gap: clamp(48px, 8vw, 112px);
        min-height: min(760px, calc(100vh - 120px));
        padding: clamp(80px, 12vw, 148px) 0 clamp(64px, 8vw, 96px);
    }

    .hero-copy {
        max-width: 900px;
    }

    .hero-name {
        margin: 28px 0 12px;
        color: var(--color-foreground);
        font-family: var(--font-display);
        font-size: 13px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .hero-intro {
        max-width: 660px;
        margin: 30px 0 0;
    }

    .hero-actions,
    .featured-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px 20px;
        margin-top: 34px;
    }

    .signal-card {
        padding: 24px;
    }

    .signal-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding-bottom: 22px;
        border-bottom: 1px solid var(--color-border);
    }

    .signal-eyebrow::before {
        display: none;
    }

    .signal-grid {
        display: grid;
    }

    .signal-item {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 16px;
        min-height: 72px;
        border-bottom: 1px solid var(--color-border);
    }

    .signal-item span,
    .project-kicker {
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.13em;
        text-transform: uppercase;
    }

    .signal-item strong {
        color: var(--color-foreground);
        font-size: 13px;
        font-weight: 520;
        text-align: right;
    }

    .signal-graph {
        display: flex;
        height: 72px;
        align-items: end;
        gap: 5px;
        padding-top: 20px;
    }

    .signal-graph span {
        flex: 1;
        min-width: 3px;
        border-radius: 3px 3px 0 0;
        background: linear-gradient(to top, rgba(143, 240, 194, 0.14), rgba(143, 240, 194, 0.72));
    }

    .featured-section,
    .paths-section {
        padding-top: clamp(88px, 12vw, 152px);
    }

    .section-intro {
        display: grid;
        grid-template-columns: minmax(180px, 0.42fr) minmax(0, 1fr);
        align-items: start;
        gap: 40px;
        margin-bottom: 34px;
    }

    .section-intro .section-heading {
        max-width: 740px;
    }

    .featured-card {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
        overflow: hidden;
    }

    .featured-visual {
        position: relative;
        min-height: 420px;
        overflow: hidden;
        background: #101223;
    }

    .featured-visual::after {
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, transparent 45%, rgba(5, 10, 15, 0.35));
        content: "";
    }

    .featured-visual img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 500ms var(--ease-quick);
    }

    .featured-card:hover .featured-visual img {
        transform: scale(1.025);
    }

    .featured-status {
        position: absolute;
        z-index: 2;
        top: 20px;
        left: 20px;
        backdrop-filter: blur(12px);
    }

    .featured-copy {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: clamp(30px, 5vw, 62px);
    }

    .featured-copy h3 {
        margin: 18px 0;
        font-size: clamp(38px, 5vw, 68px);
        font-weight: 520;
        line-height: 1;
        letter-spacing: -0.055em;
    }

    .featured-copy p:not(.project-kicker) {
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: 16px;
        line-height: 1.7;
    }

    .paths-intro {
        margin-bottom: 24px;
    }

    .path-list {
        border-top: 1px solid var(--color-border);
    }

    .path-item {
        display: grid;
        grid-template-columns: 54px minmax(0, 1fr) auto;
        align-items: center;
        gap: 20px;
        min-height: 112px;
        padding: 18px 10px;
        border-bottom: 1px solid var(--color-border);
        transition:
            padding 180ms var(--ease-quick),
            background 180ms var(--ease-quick);
    }

    .path-item:hover {
        padding-inline: 20px;
        background: rgba(255, 255, 255, 0.035);
    }

    .path-index,
    .path-arrow {
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 10px;
        letter-spacing: 0.1em;
    }

    .path-copy {
        display: grid;
        gap: 5px;
    }

    .path-copy strong {
        font-size: clamp(20px, 2vw, 26px);
        font-weight: 520;
        letter-spacing: -0.02em;
    }

    .path-copy > span {
        color: var(--color-muted-foreground);
        font-size: 14px;
        line-height: 1.5;
    }

    .path-arrow {
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        border: 1px solid var(--color-border);
        border-radius: 12px;
        transition:
            border-color 180ms var(--ease-quick),
            color 180ms var(--ease-quick);
    }

    .path-item:hover .path-arrow {
        border-color: rgba(143, 240, 194, 0.32);
        color: var(--color-primary);
    }

    @media (max-width: 980px) {
        .hero {
            grid-template-columns: 1fr;
            align-items: start;
            min-height: auto;
            padding-top: 96px;
        }

        .signal-card {
            width: min(100%, 640px);
        }

        .featured-card {
            grid-template-columns: 1fr;
        }

        .featured-visual {
            min-height: min(58vw, 520px);
        }
    }

    @media (max-width: 680px) {
        .hero {
            gap: 52px;
            padding-top: 76px;
        }

        .section-intro {
            grid-template-columns: 1fr;
            gap: 18px;
        }

        .featured-visual {
            min-height: 280px;
        }

        .featured-actions {
            align-items: stretch;
            flex-direction: column;
        }

        .featured-actions .text-link {
            justify-content: center;
        }

        .path-item {
            grid-template-columns: 36px minmax(0, 1fr) auto;
            gap: 12px;
            min-height: 126px;
        }

        .path-copy > span {
            font-size: 13px;
        }
    }
</style>
