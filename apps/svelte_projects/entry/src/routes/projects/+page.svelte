<script lang="ts">
    import { onMount } from "svelte";
    import {
        ArrowUpRight,
        AuroraVeil,
        SiteFooter,
        SiteHeader,
    } from "@homelab/shared";
    import * as m from "$lib/paraglide/messages.js";
    import { locales, localizeHref, getLocale } from "$lib/paraglide/runtime";
    import { base } from "$app/paths";
    import { page } from "$app/state";
    import { setupRevealMotion } from "$lib/reveal";

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

    const setlistFeatures = $derived([
        m.project_setlist_feature_search(),
        m.project_setlist_feature_links(),
        m.project_setlist_feature_languages(),
    ]);

    const secondaryProjects = $derived([
        {
            number: "02",
            slug: "fennevia",
            title: m.project_fennevia_title(),
            kicker: m.project_fennevia_kicker(),
            status: m.project_fennevia_status(),
            description: m.project_fennevia_description(),
            image: `${base}/projects/fennevia-overview.svg`,
            alt: m.project_fennevia_alt(),
            accent: "#8bc8ff",
            features: [
                m.project_fennevia_feature_edges(),
                m.project_fennevia_feature_native(),
                m.project_fennevia_feature_recovery(),
            ],
            tags: ["Firefox", "userChrome.css", "JavaScript", "Windows"],
            links: [
                {
                    label: m.project_fennevia_github(),
                    href: "https://github.com/yutinglia/fennevia",
                    primary: true,
                },
            ],
        },
        {
            number: "03",
            slug: "dial",
            title: m.project_dial_title(),
            kicker: m.project_dial_kicker(),
            status: m.project_dial_status(),
            description: m.project_dial_description(),
            image: `${base}/projects/dial-canvas-overview.svg`,
            alt: m.project_dial_alt(),
            accent: "#ff917e",
            features: [
                m.project_dial_feature_canvas(),
                m.project_dial_feature_widgets(),
                m.project_dial_feature_storage(),
            ],
            tags: ["Svelte 5", "WXT", "TypeScript", "Firefox"],
            links: [
                {
                    label: m.project_dial_open(),
                    href: "https://addons.mozilla.org/firefox/addon/dial-canvas/",
                    primary: true,
                },
                {
                    label: m.project_dial_github(),
                    href: "https://github.com/yutinglia/dial-canvas",
                    primary: false,
                },
            ],
        },
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

    onMount(() => setupRevealMotion());
</script>

<svelte:head>
    <title>{m.projects_meta_title()}</title>
    <meta name="description" content={m.projects_meta_description()} />
    <meta name="theme-color" content="#06090b" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={m.projects_meta_title()} />
    <meta property="og:description" content={m.projects_meta_description()} />
    <meta property="og:url" content="https://www.yutinglia.com/projects" />
    <meta property="og:image" content="https://www.yutinglia.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<AuroraVeil veilVariant="soft" />

<a class="av-skip" href="#main">{m.skip_to_content()}</a>

<div class="av-overlay av-overlay-center projects-site">
    <SiteHeader
        brandHref={homeHref}
        brandSubtitle="Homelab"
        {navItems}
        currentLocale={getLocale()}
        {localeOptions}
        localeAriaLabel={m.languages_aria()}
        navAriaLabel={m.entry_nav_aria()}
    />

    <main id="main">
        <section class="projects-hero" aria-labelledby="projects-title">
            <div class="hero-meta" data-reveal>
                <span>{m.projects_eyebrow()}</span>
                <span>{m.project_public_source()}</span>
                <span>2026</span>
            </div>

            <h1 class="display-title" id="projects-title" data-reveal style="--reveal-delay: 60ms">
                {m.projects_heading()}<br />
                <span class="muted-line">{m.projects_heading_muted()}</span>
            </h1>

            <div class="hero-bottom">
                <p data-reveal style="--reveal-delay: 110ms">{m.projects_intro()}</p>
                <aside class="project-count" aria-label={m.projects_count_label()} data-reveal style="--reveal-delay: 160ms">
                    <span>{m.projects_count_label()}</span>
                    <strong>03</strong>
                    <small>
                        <span class="status-dot" aria-hidden="true"></span>
                        {m.projects_count_value()}
                    </small>
                </aside>
            </div>
        </section>

        <section class="project-section" aria-labelledby="setlist-title">
            <article class="setlist-project glass-panel" data-reveal>
                <a
                    class="project-media setlist-media"
                    href="https://setlist.yutinglia.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={m.project_setlist_open()}
                >
                    <img
                        src={`${base}/projects/setlist-og.png`}
                        alt={m.project_setlist_alt()}
                        width="1731"
                        height="909"
                    />
                    <span class="project-number" aria-hidden="true">01</span>
                </a>

                <div class="project-copy">
                    <div class="project-meta">
                        <span>{m.project_setlist_kicker()}</span>
                        <span class="project-status">
                            <span class="status-light" aria-hidden="true"></span>
                            {m.project_live()}
                        </span>
                    </div>
                    <h2 id="setlist-title">{m.project_setlist_title()}</h2>
                    <p class="project-description">{m.project_setlist_description()}</p>

                    <ul class="feature-list">
                        {#each setlistFeatures as feature}
                            <li>{feature}</li>
                        {/each}
                    </ul>

                    <div class="project-links">
                        <a
                            class="project-link project-link-primary"
                            href="https://setlist.yutinglia.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {m.project_setlist_open()}
                            <ArrowUpRight />
                        </a>
                        <a
                            class="project-link"
                            href="https://github.com/yutinglia/setlist"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {m.project_setlist_github()}
                            <ArrowUpRight />
                        </a>
                    </div>
                </div>
            </article>

            <div class="architecture-panel" data-reveal>
                <header>
                    <p class="section-kicker">{m.project_tech_heading()}</p>
                    <p>{m.project_tech_intro()}</p>
                </header>
                <div class="tech-groups">
                    {#each techGroups as group}
                        <section>
                            <h3>{group.label}</h3>
                            <ul>
                                {#each group.items as item}
                                    <li>{item}</li>
                                {/each}
                            </ul>
                        </section>
                    {/each}
                </div>
            </div>
        </section>

        <section class="secondary-grid" aria-label={m.projects_more_label()}>
            {#each secondaryProjects as project, index}
                <article
                    class={`secondary-project project-${project.slug} glass-panel`}
                    data-reveal
                    style={`--project-accent: ${project.accent}; --reveal-delay: ${index * 80}ms`}
                >
                    <div class="secondary-media">
                        <img src={project.image} alt={project.alt} width="1600" height="900" />
                    </div>
                    <div class="secondary-copy">
                        <div class="project-meta">
                            <span>
                                <span class="inline-number" aria-hidden="true">{project.number}</span>
                                {project.kicker}
                            </span>
                            <span class="project-status">
                                <span class="status-light" aria-hidden="true"></span>
                                {project.status}
                            </span>
                        </div>
                        <h2>{project.title}</h2>
                        <p class="project-description">{project.description}</p>

                        <ul class="feature-list">
                            {#each project.features as feature}
                                <li>{feature}</li>
                            {/each}
                        </ul>

                        <ul class="tag-list" aria-label={m.project_tech_tags()}>
                            {#each project.tags as tag}
                                <li>{tag}</li>
                            {/each}
                        </ul>

                        <div class="project-links">
                            {#each project.links as link}
                                <a
                                    class:project-link-primary={link.primary}
                                    class="project-link"
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.label}
                                    <ArrowUpRight />
                                </a>
                            {/each}
                        </div>
                    </div>
                </article>
            {/each}
        </section>

        <section class="closing-panel" data-reveal aria-labelledby="closing-title">
            <p class="section-kicker">{m.projects_more_label()}</p>
            <div>
                <h2 id="closing-title">{m.projects_more_heading()}</h2>
                <p>{m.projects_more_body()}</p>
            </div>
            <a class="closing-link" href={profileHref}>
                {m.entry_cta_profile()}
                <ArrowUpRight size={18} />
            </a>
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
    main {
        min-width: 0;
    }

    .projects-hero {
        display: grid;
        gap: clamp(54px, 8vw, 102px);
        padding: clamp(88px, 10vw, 150px) 4px clamp(96px, 12vw, 172px);
    }

    .hero-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 0;
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .hero-meta span + span::before {
        margin: 0 14px;
        color: var(--color-primary);
        content: "/";
    }

    .hero-bottom {
        display: grid;
        grid-template-columns: minmax(360px, 0.82fr) minmax(260px, 0.38fr);
        justify-content: space-between;
        align-items: end;
        gap: clamp(52px, 10vw, 150px);
    }

    .hero-bottom > p {
        max-width: 760px;
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: clamp(18px, 2vw, 25px);
        line-height: 1.58;
        letter-spacing: -0.02em;
        text-wrap: pretty;
    }

    .project-count {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: end;
        padding-left: 22px;
        border-left: 1px solid var(--color-border-strong);
    }

    .project-count > span {
        align-self: start;
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.11em;
        text-transform: uppercase;
    }

    .project-count strong {
        grid-row: 1 / 3;
        grid-column: 2;
        color: var(--color-primary);
        font-family: var(--font-display);
        font-size: clamp(68px, 8vw, 100px);
        font-weight: 400;
        line-height: 0.78;
        letter-spacing: -0.1em;
    }

    .project-count small {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        margin-top: 32px;
        color: var(--color-muted-foreground);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .project-section {
        display: grid;
        gap: 16px;
    }

    .setlist-project {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        --project-accent: #c9ff72;
    }

    .project-media,
    .secondary-media {
        position: relative;
        min-width: 0;
        overflow: hidden;
        background: #0b0c0e;
    }

    .setlist-media {
        min-height: 0;
        aspect-ratio: 16 / 9;
        border-bottom: 1px solid var(--color-border);
    }

    .project-media::after,
    .secondary-media::after {
        position: absolute;
        inset: 0;
        background: linear-gradient(150deg, transparent 52%, rgba(0, 0, 0, 0.36));
        content: "";
        pointer-events: none;
    }

    .project-media img,
    .secondary-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 440ms var(--ease-quick), filter 440ms var(--ease-quick);
    }

    .project-media:hover img {
        filter: saturate(1.08);
        transform: scale(1.018);
    }

    .project-number {
        position: absolute;
        z-index: 2;
        top: 20px;
        left: 20px;
        display: grid;
        width: 44px;
        height: 44px;
        place-items: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 999px;
        background: rgba(3, 4, 5, 0.54);
        color: #fff;
        font-family: var(--font-display);
        font-size: 9px;
        backdrop-filter: blur(12px);
    }

    .project-copy,
    .secondary-copy {
        display: flex;
        min-width: 0;
        flex-direction: column;
        padding: clamp(30px, 4.4vw, 62px);
    }

    .project-meta {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.1em;
        line-height: 1.5;
        text-transform: uppercase;
    }

    .project-meta > span:first-child {
        max-width: 56%;
    }

    .inline-number {
        margin-right: 12px;
        color: var(--project-accent);
    }

    .project-status {
        display: inline-flex;
        min-height: 28px;
        align-items: center;
        gap: 8px;
        padding: 0 10px;
        border: 1px solid color-mix(in srgb, var(--project-accent) 34%, transparent);
        border-radius: 999px;
        color: color-mix(in srgb, var(--project-accent) 88%, white);
        white-space: nowrap;
    }

    .status-light {
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: var(--project-accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--project-accent) 10%, transparent);
    }

    .project-copy h2,
    .secondary-copy h2 {
        margin: clamp(50px, 7vw, 84px) 0 0;
        font-size: clamp(46px, 6vw, 78px);
        font-weight: 520;
        line-height: 0.94;
        letter-spacing: -0.07em;
    }

    .project-description {
        margin: 26px 0 0;
        color: var(--color-muted-foreground);
        font-size: 15px;
        line-height: 1.72;
        text-wrap: pretty;
    }

    .feature-list {
        display: grid;
        gap: 0;
        margin: 32px 0 0;
        padding: 0;
        border-top: 1px solid var(--color-border);
        list-style: none;
    }

    .feature-list li {
        position: relative;
        padding: 15px 4px 15px 24px;
        border-bottom: 1px solid var(--color-border);
        color: var(--color-muted-foreground);
        font-size: 13px;
        line-height: 1.55;
    }

    .feature-list li::before {
        position: absolute;
        top: 21px;
        left: 3px;
        width: 6px;
        height: 6px;
        border-radius: 999px;
        background: var(--project-accent);
        content: "";
    }

    .project-links {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin-top: auto;
        padding-top: 34px;
    }

    .project-link {
        display: inline-flex;
        min-height: 50px;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 0 17px;
        border: 1px solid var(--color-border-strong);
        border-radius: 999px;
        color: var(--color-foreground);
        font-family: var(--font-display);
        font-size: 8px;
        font-weight: 650;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        transition: background 170ms var(--ease-quick), border-color 170ms var(--ease-quick), color 170ms var(--ease-quick);
    }

    .project-link-primary {
        border-color: var(--project-accent);
        background: var(--project-accent);
        color: var(--color-ink);
    }

    .project-link:hover {
        border-color: var(--project-accent);
        background: color-mix(in srgb, var(--project-accent) 12%, transparent);
    }

    .project-link-primary:hover {
        background: color-mix(in srgb, var(--project-accent) 82%, white);
        color: var(--color-ink);
    }

    .project-link :global(svg) {
        transition: transform 160ms var(--ease-quick);
    }

    .project-link:hover :global(svg) {
        transform: translate(2px, -2px);
    }

    .architecture-panel {
        display: grid;
        grid-template-columns: minmax(280px, 0.52fr) minmax(0, 1fr);
        gap: clamp(50px, 8vw, 120px);
        padding: clamp(30px, 4.8vw, 64px);
        border: 1px solid var(--color-border);
        border-radius: 28px;
        background: rgba(8, 12, 14, 0.68);
        backdrop-filter: blur(18px);
    }

    .architecture-panel header > p:last-child {
        max-width: 420px;
        margin: 34px 0 0;
        color: var(--color-muted-foreground);
        font-size: 15px;
        line-height: 1.7;
    }

    .tech-groups {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 34px 46px;
    }

    .tech-groups section {
        padding-top: 14px;
        border-top: 1px solid var(--color-border-strong);
    }

    .tech-groups h3 {
        margin: 0;
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .tech-groups ul {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 12px;
        margin: 18px 0 0;
        padding: 0;
        list-style: none;
    }

    .tech-groups li {
        color: var(--color-muted-foreground);
        font-size: 13px;
    }

    .tech-groups li:not(:last-child)::after {
        margin-left: 12px;
        color: var(--color-border-strong);
        content: "/";
    }

    .secondary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        margin-top: clamp(112px, 15vw, 210px);
    }

    .secondary-project {
        display: flex;
        min-width: 0;
        flex-direction: column;
        overflow: hidden;
    }

    .secondary-media {
        aspect-ratio: 16 / 9;
        border-bottom: 1px solid var(--color-border);
    }

    .secondary-copy {
        flex: 1;
        min-height: 620px;
    }

    .secondary-copy h2 {
        margin-top: clamp(44px, 6vw, 72px);
        font-size: clamp(44px, 5vw, 68px);
    }

    .tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin: 26px 0 0;
        padding: 0;
        list-style: none;
    }

    .tag-list li {
        padding: 7px 9px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.05em;
    }

    .closing-panel {
        display: grid;
        grid-template-columns: minmax(170px, 0.28fr) minmax(0, 1fr) auto;
        align-items: end;
        gap: clamp(38px, 7vw, 100px);
        margin-top: clamp(120px, 16vw, 224px);
        padding: clamp(34px, 6vw, 78px);
        border-radius: 28px;
        background: var(--color-paper);
        color: var(--color-ink);
    }

    .closing-panel .section-kicker {
        align-self: start;
        color: rgba(6, 9, 11, 0.5);
    }

    .closing-panel .section-kicker::before {
        background: #315b22;
    }

    .closing-panel h2 {
        max-width: 720px;
        margin: 0;
        font-size: clamp(40px, 5vw, 68px);
        font-weight: 530;
        line-height: 0.98;
        letter-spacing: -0.06em;
        text-wrap: balance;
    }

    .closing-panel div > p {
        max-width: 650px;
        margin: 26px 0 0;
        color: rgba(6, 9, 11, 0.64);
        font-size: 15px;
        line-height: 1.72;
    }

    .closing-link {
        display: inline-flex;
        min-height: 52px;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 0 18px;
        border: 1px solid rgba(6, 9, 11, 0.28);
        border-radius: 999px;
        font-family: var(--font-display);
        font-size: 9px;
        font-weight: 650;
        letter-spacing: 0.09em;
        white-space: nowrap;
        text-transform: uppercase;
        transition: background 170ms var(--ease-quick), color 170ms var(--ease-quick);
    }

    .closing-link:hover {
        background: var(--color-primary);
        color: var(--color-ink);
    }

    .closing-link:focus-visible {
        outline-color: #315b22;
    }

    @media (max-width: 1120px) {
        .closing-panel {
            grid-template-columns: minmax(140px, 0.25fr) minmax(0, 1fr);
        }

        .closing-link {
            grid-column: 2;
            width: fit-content;
        }
    }

    @media (max-width: 900px) {
        .hero-bottom,
        .architecture-panel,
        .closing-panel {
            grid-template-columns: 1fr;
        }

        .project-count {
            max-width: 460px;
        }

        .setlist-media {
            min-height: 0;
            aspect-ratio: 16 / 9;
            border-right: 0;
            border-bottom: 1px solid var(--color-border);
        }

        .architecture-panel {
            gap: 58px;
        }

        .secondary-grid {
            grid-template-columns: 1fr;
        }

        .secondary-copy {
            min-height: 0;
        }

        .closing-link {
            grid-column: auto;
        }
    }

    @media (max-width: 640px) {
        .projects-hero {
            gap: 56px;
            padding: 72px 2px 104px;
        }

        .hero-meta span {
            flex: 0 0 100%;
        }

        .hero-meta span + span::before {
            margin-left: 0;
        }

        .project-count {
            grid-template-columns: 1fr auto;
        }

        .setlist-project,
        .architecture-panel,
        .secondary-project,
        .closing-panel {
            border-radius: 22px;
        }

        .project-copy,
        .secondary-copy {
            padding: 26px 22px 30px;
        }

        .project-meta {
            align-items: flex-start;
            flex-direction: column;
        }

        .project-meta > span:first-child {
            max-width: none;
        }

        .project-copy h2,
        .secondary-copy h2 {
            margin-top: 44px;
            font-size: 44px;
        }

        .project-links {
            display: grid;
        }

        .project-link {
            width: 100%;
        }

        .architecture-panel,
        .closing-panel {
            padding: 30px 22px;
        }

        .tech-groups {
            grid-template-columns: 1fr;
        }

        .secondary-grid {
            margin-top: 112px;
        }

        .closing-link {
            width: 100%;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .project-media:hover img,
        .project-link:hover :global(svg) {
            transform: none;
        }
    }
</style>
