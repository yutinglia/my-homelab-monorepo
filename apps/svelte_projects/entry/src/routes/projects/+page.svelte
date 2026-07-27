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
        { label: m.nav_home(), href: homeHref },
        { label: m.nav_projects(), href: projectsHref, current: true },
        { label: m.nav_profile(), href: profileHref },
    ]);

    const localeOptions = $derived(
        locales.map((locale) => ({
            locale,
            href: `${base}${localizeHref(page.url.pathname, { locale })}`,
            label: locale === "en" ? m.lang_en() : m.lang_zh_hant(),
        })),
    );

    const projectFeatures = $derived([
        m.project_setlist_feature_search(),
        m.project_setlist_feature_links(),
        m.project_setlist_feature_languages(),
    ]);

    const techGroups = $derived([
        {
            label: m.project_tech_frontend(),
            items: ["React 19", "TypeScript", "TanStack", "Vite"],
        },
        {
            label: m.project_tech_backend(),
            items: ["FastAPI", "Python", "SQLAlchemy", "yt-dlp"],
        },
        {
            label: m.project_tech_data(),
            items: ["PostgreSQL 18", "Flyway", "LLM cleanup"],
        },
        {
            label: m.project_tech_delivery(),
            items: ["Docker", "Nginx", "GitHub Actions", "GHCR"],
        },
    ]);

    let year = $state(new Date().getFullYear());
</script>

<svelte:head>
    <title>{m.projects_meta_title()}</title>
    <meta name="description" content={m.projects_meta_description()} />
    <meta name="theme-color" content="#071018" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={m.projects_meta_title()} />
    <meta property="og:description" content={m.projects_meta_description()} />
    <meta property="og:url" content="https://www.yutinglia.com/projects" />
    <meta property="og:image" content="https://www.yutinglia.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<AuroraVeil veilVariant="soft" />

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
        <section class="projects-hero">
            <div>
                <p class="eyebrow">{m.projects_eyebrow()}</p>
                <h1 class="display-title">
                    {m.projects_heading()}<br />
                    <span class="muted-line">{m.projects_heading_muted()}</span>
                </h1>
                <p class="body-lead projects-intro">{m.projects_intro()}</p>
            </div>
            <div class="project-count glass-panel">
                <span>{m.projects_count_label()}</span>
                <strong>01</strong>
                <small>
                    <span class="status-dot" aria-hidden="true"></span>
                    {m.projects_count_value()}
                </small>
            </div>
        </section>

        <article class="project-card glass-panel" aria-labelledby="setlist-title">
            <div class="project-media">
                <img
                    src={`${base}/projects/setlist-og.png`}
                    alt="Setlist — VTuber Karaoke Search"
                    width="1731"
                    height="909"
                />
                <div class="project-media-meta">
                    <span class="status-pill">
                        <span class="status-dot" aria-hidden="true"></span>
                        {m.project_live()}
                    </span>
                </div>
            </div>

            <div class="project-body">
                <div class="project-overview">
                    <p class="project-kicker">{m.project_setlist_kicker()}</p>
                    <h2 id="setlist-title">{m.project_setlist_title()}</h2>
                    <p class="project-description">
                        {m.project_setlist_description()}
                    </p>

                    <ul class="project-features">
                        {#each projectFeatures as feature}
                            <li>
                                <span aria-hidden="true">✓</span>
                                {feature}
                            </li>
                        {/each}
                    </ul>

                    <div class="project-actions">
                        <a
                            class="button-primary"
                            href="https://setlist.yutinglia.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {m.project_setlist_open()}
                            <span aria-hidden="true">↗</span>
                        </a>
                        <a
                            class="button-secondary"
                            href="https://github.com/yutinglia/setlist"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {m.project_setlist_github()}
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </div>

                <aside class="architecture" aria-labelledby="architecture-title">
                    <p class="architecture-title" id="architecture-title">
                        {m.project_tech_heading()}
                    </p>
                    <div class="tech-groups">
                        {#each techGroups as group}
                            <div class="tech-group">
                                <span>{group.label}</span>
                                <div>
                                    {#each group.items as item}
                                        <code>{item}</code>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </aside>
            </div>
        </article>

        <section class="more-panel glass-panel">
            <div>
                <p class="eyebrow">{m.projects_more_label()}</p>
                <h2>{m.projects_more_heading()}</h2>
            </div>
            <p>{m.projects_more_body()}</p>
            <div class="lab-orbit" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
            </div>
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
    .projects-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 220px;
        align-items: end;
        gap: clamp(48px, 8vw, 120px);
        padding: clamp(92px, 13vw, 160px) 0 clamp(66px, 9vw, 112px);
    }

    .projects-hero .display-title {
        margin-top: 28px;
    }

    .projects-intro {
        max-width: 700px;
        margin: 30px 0 0;
    }

    .project-count {
        display: flex;
        min-height: 220px;
        flex-direction: column;
        justify-content: space-between;
        padding: 24px;
    }

    .project-count > span,
    .project-count small,
    .project-kicker,
    .architecture-title,
    .tech-group > span {
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.13em;
        text-transform: uppercase;
    }

    .project-count strong {
        font-family: var(--font-display);
        font-size: 72px;
        font-weight: 300;
        line-height: 1;
        letter-spacing: -0.08em;
    }

    .project-count small {
        display: flex;
        align-items: center;
        gap: 9px;
        color: var(--color-primary);
    }

    .project-card {
        overflow: hidden;
    }

    .project-media {
        position: relative;
        min-height: min(58vw, 620px);
        overflow: hidden;
        background: #101223;
    }

    .project-media::after {
        position: absolute;
        inset: 45% 0 0;
        background: linear-gradient(to top, rgba(5, 11, 17, 0.72), transparent);
        content: "";
    }

    .project-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .project-media-meta {
        position: absolute;
        z-index: 2;
        right: 22px;
        bottom: 22px;
        left: 22px;
        display: flex;
        align-items: center;
        gap: 16px;
    }

    .project-body {
        display: grid;
        grid-template-columns: minmax(0, 1.18fr) minmax(320px, 0.82fr);
    }

    .project-overview {
        padding: clamp(32px, 6vw, 76px);
    }

    .project-overview h2 {
        margin: 18px 0 24px;
        font-size: clamp(52px, 8vw, 96px);
        font-weight: 520;
        line-height: 0.92;
        letter-spacing: -0.065em;
    }

    .project-description {
        max-width: 720px;
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: clamp(16px, 1.6vw, 19px);
        line-height: 1.72;
    }

    .project-features {
        display: grid;
        gap: 13px;
        margin: 34px 0 0;
        padding: 28px 0 0;
        border-top: 1px solid var(--color-border);
        list-style: none;
    }

    .project-features li {
        display: grid;
        grid-template-columns: 20px minmax(0, 1fr);
        gap: 10px;
        color: var(--color-muted-foreground);
        font-size: 14px;
        line-height: 1.55;
    }

    .project-features li span {
        color: var(--color-accent);
        font-family: var(--font-display);
    }

    .project-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 36px;
    }

    .architecture {
        padding: clamp(32px, 5vw, 62px);
        border-left: 1px solid var(--color-border);
        background: rgba(255, 255, 255, 0.018);
    }

    .architecture-title {
        margin: 0 0 26px;
        color: var(--color-foreground);
    }

    .tech-groups {
        display: grid;
        gap: 30px;
    }

    .tech-group {
        display: grid;
        gap: 12px;
    }

    .tech-group > div {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
    }

    .tech-group code {
        padding: 7px 9px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.035);
        color: var(--color-muted-foreground);
        font-family: var(--font-display);
        font-size: 10px;
    }

    .more-panel {
        position: relative;
        display: grid;
        grid-template-columns: minmax(0, 0.85fr) minmax(300px, 0.75fr) 160px;
        align-items: center;
        gap: clamp(32px, 6vw, 84px);
        min-height: 300px;
        margin-top: clamp(64px, 9vw, 112px);
        padding: clamp(30px, 5vw, 64px);
        overflow: hidden;
    }

    .more-panel h2 {
        max-width: 560px;
        margin: 20px 0 0;
        font-size: clamp(30px, 4vw, 50px);
        font-weight: 520;
        line-height: 1.06;
        letter-spacing: -0.045em;
    }

    .more-panel > p {
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: 15px;
        line-height: 1.7;
    }

    .lab-orbit {
        position: relative;
        width: 140px;
        height: 140px;
        border: 1px solid var(--color-border);
        border-radius: 50%;
    }

    .lab-orbit::before,
    .lab-orbit::after {
        position: absolute;
        inset: 22px;
        border: 1px solid var(--color-border);
        border-radius: 50%;
        content: "";
    }

    .lab-orbit::after {
        inset: 48px;
        background: rgba(143, 240, 194, 0.13);
        box-shadow: 0 0 34px rgba(143, 240, 194, 0.18);
    }

    .lab-orbit span {
        position: absolute;
        z-index: 2;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--color-accent);
    }

    .lab-orbit span:nth-child(1) {
        top: 14px;
        left: 46px;
    }

    .lab-orbit span:nth-child(2) {
        right: 20px;
        bottom: 34px;
        background: var(--color-accent-blue);
    }

    .lab-orbit span:nth-child(3) {
        bottom: 32px;
        left: 30px;
        background: var(--color-accent-violet);
    }

    @media (max-width: 940px) {
        .project-body,
        .more-panel {
            grid-template-columns: 1fr;
        }

        .architecture {
            border-top: 1px solid var(--color-border);
            border-left: 0;
        }

        .more-panel {
            align-items: start;
        }
    }

    @media (max-width: 680px) {
        .projects-hero {
            grid-template-columns: 1fr;
            padding-top: 80px;
        }

        .project-count {
            min-height: 160px;
        }

        .project-media {
            min-height: 330px;
        }

        .project-media img {
            object-position: 44% center;
        }

        .project-actions {
            flex-direction: column;
        }

        .lab-orbit {
            display: none;
        }
    }
</style>
