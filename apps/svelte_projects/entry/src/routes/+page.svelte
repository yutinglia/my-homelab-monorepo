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
        { label: m.entry_signal_projects_label(), value: "03" },
        { label: m.entry_signal_services_label(), value: "01" },
        {
            label: m.entry_signal_location_label(),
            value: m.entry_signal_location_value(),
        },
    ]);

    const sideProjects = $derived([
        {
            index: "02",
            title: m.project_fennevia_title(),
            kicker: m.project_fennevia_kicker(),
            description: m.entry_project_fennevia_short(),
            image: `${base}/projects/fennevia-overview.svg`,
            alt: m.project_fennevia_alt(),
            href: "https://github.com/yutinglia/fennevia",
            accent: "#8bc8ff",
        },
        {
            index: "03",
            title: m.project_dial_title(),
            kicker: m.project_dial_kicker(),
            description: m.entry_project_dial_short(),
            image: `${base}/projects/dial-canvas-overview.svg`,
            alt: m.project_dial_alt(),
            href: "https://github.com/yutinglia/dial-canvas",
            accent: "#ff917e",
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

    onMount(() => setupRevealMotion());
</script>

<svelte:head>
    <title>{m.entry_meta_title()}</title>
    <meta name="description" content={m.entry_meta_description()} />
    <meta name="theme-color" content="#06090b" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={m.entry_meta_title()} />
    <meta property="og:description" content={m.entry_meta_description()} />
    <meta property="og:url" content="https://www.yutinglia.com/" />
    <meta property="og:image" content="https://www.yutinglia.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<AuroraVeil veilVariant="soft" />

<a class="av-skip" href="#main">{m.skip_to_content()}</a>

<div class="av-overlay av-overlay-center entry-site">
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
        <section class="hero" aria-labelledby="hero-title">
            <div class="hero-meta" data-reveal>
                <span>{m.entry_name()}</span>
                <span>{m.entry_eyebrow()}</span>
                <span>{m.entry_signal_location_value()}</span>
            </div>

            <div class="hero-heading" data-reveal style="--reveal-delay: 60ms">
                <h1 class="display-title" id="hero-title">
                    {m.entry_hero_title()}<br />
                    <span class="muted-line">{m.entry_hero_title_muted()}</span>
                </h1>
            </div>

            <div class="hero-bottom">
                <div class="hero-intro" data-reveal style="--reveal-delay: 110ms">
                    <p>{m.entry_tagline()}</p>
                    <div class="hero-actions">
                        <a class="button-primary" href={projectsHref}>
                            {m.entry_cta_projects()}
                            <ArrowUpRight />
                        </a>
                        <a class="button-secondary" href={profileHref}>
                            {m.entry_cta_profile()}
                            <ArrowUpRight />
                        </a>
                    </div>
                </div>

                <aside class="now-card" aria-label={m.entry_signal_label()} data-reveal style="--reveal-delay: 160ms">
                    <div class="now-card-head">
                        <span class="section-kicker">{m.entry_signal_label()}</span>
                        <span class="live-mark">
                            <span class="status-dot" aria-hidden="true"></span>
                            {m.entry_signal_status()}
                        </span>
                    </div>
                    <dl>
                        {#each signals as signal}
                            <div>
                                <dt>{signal.label}</dt>
                                <dd>{signal.value}</dd>
                            </div>
                        {/each}
                    </dl>
                    <p>{m.entry_now_body()}</p>
                </aside>
            </div>
        </section>

        <section class="work-section" aria-labelledby="work-title">
            <header class="section-intro" data-reveal>
                <p class="section-kicker">{m.entry_featured_label()}</p>
                <h2 class="section-heading" id="work-title">{m.entry_featured_heading()}</h2>
                <p>{m.entry_work_intro()}</p>
            </header>

            <div class="work-grid">
                <article class="setlist-card glass-panel" data-reveal>
                    <a
                        class="setlist-media"
                        href="https://setlist.yutinglia.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={m.entry_featured_open()}
                    >
                        <img
                            src={`${base}/projects/setlist-og.png`}
                            alt={m.project_setlist_alt()}
                            width="1731"
                            height="909"
                        />
                        <span class="media-number" aria-hidden="true">01</span>
                    </a>
                    <div class="setlist-copy">
                        <div class="project-meta">
                            <span>{m.project_setlist_kicker()}</span>
                            <span class="status-pill">
                                <span class="status-dot" aria-hidden="true"></span>
                                {m.project_live()}
                            </span>
                        </div>
                        <h3>{m.project_setlist_title()}</h3>
                        <p>{m.entry_featured_desc()}</p>
                        <div class="project-actions">
                            <a
                                class="button-primary"
                                href="https://setlist.yutinglia.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {m.entry_featured_open()}
                                <ArrowUpRight />
                            </a>
                            <a class="text-link" href={projectsHref}>
                                {m.entry_featured_details()}
                                <span aria-hidden="true">→</span>
                            </a>
                        </div>
                    </div>
                </article>

                <div class="side-projects">
                    {#each sideProjects as project, index}
                        <article
                            class="side-project glass-panel"
                            data-reveal
                            style={`--project-accent: ${project.accent}; --reveal-delay: ${index * 70}ms`}
                        >
                            <a
                                class="side-project-media"
                                href={project.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${project.title} — ${m.project_view_github()}`}
                            >
                                <img src={project.image} alt={project.alt} width="1600" height="900" />
                            </a>
                            <div class="side-project-copy">
                                <span class="project-index">{project.index}</span>
                                <p>{project.kicker}</p>
                                <h3>{project.title}</h3>
                                <span>{project.description}</span>
                                <a
                                    class="side-project-link"
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {m.project_view_github()}
                                    <ArrowUpRight />
                                </a>
                            </div>
                        </article>
                    {/each}
                </div>
            </div>
        </section>

        <section class="routes-section" aria-labelledby="routes-title" data-reveal>
            <div class="routes-heading">
                <p class="section-kicker">{m.entry_paths_label()}</p>
                <h2 id="routes-title">{m.entry_paths_heading()}</h2>
                <p>{m.entry_paths_intro()}</p>
            </div>
            <nav class="route-list" aria-label={m.entry_paths_label()}>
                {#each paths as item}
                    <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                    >
                        <span class="route-index">{item.index}</span>
                        <span class="route-copy">
                            <strong>{item.title}</strong>
                            <span>{item.description}</span>
                        </span>
                        <ArrowUpRight size={18} />
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
    main {
        min-width: 0;
    }

    .hero {
        display: grid;
        gap: clamp(56px, 8vw, 106px);
        min-height: min(900px, calc(100vh - 66px));
        padding: clamp(86px, 10vw, 148px) 4px clamp(90px, 10vw, 142px);
    }

    .hero-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 9px 0;
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

    .hero-heading {
        max-width: 1280px;
    }

    .hero-bottom {
        display: grid;
        grid-template-columns: minmax(340px, 0.7fr) minmax(390px, 0.58fr);
        justify-content: space-between;
        align-items: end;
        gap: clamp(54px, 10vw, 150px);
    }

    .hero-intro > p {
        max-width: 730px;
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: clamp(19px, 2vw, 26px);
        line-height: 1.56;
        letter-spacing: -0.02em;
        text-wrap: pretty;
    }

    .hero-actions,
    .project-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 32px;
    }

    .now-card {
        padding-left: 22px;
        border-left: 1px solid var(--color-border-strong);
    }

    .now-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
    }

    .now-card .section-kicker::before {
        display: none;
    }

    .live-mark {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--color-primary);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .now-card dl {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        margin: 24px 0 0;
        border-top: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);
    }

    .now-card dl div {
        padding: 18px 10px 18px 0;
    }

    .now-card dl div + div {
        padding-left: 14px;
        border-left: 1px solid var(--color-border);
    }

    .now-card dt {
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .now-card dd {
        margin: 12px 0 0;
        color: var(--color-foreground);
        font-family: var(--font-display);
        font-size: 17px;
        letter-spacing: -0.03em;
    }

    .now-card > p {
        margin: 20px 0 0;
        color: var(--color-muted-foreground);
        font-size: 14px;
        line-height: 1.68;
    }

    .work-section {
        padding-top: clamp(92px, 12vw, 172px);
    }

    .section-intro {
        display: grid;
        grid-template-columns: minmax(180px, 0.35fr) minmax(0, 1fr) minmax(260px, 0.48fr);
        align-items: end;
        gap: clamp(30px, 5vw, 78px);
        margin-bottom: clamp(44px, 6vw, 76px);
    }

    .section-intro > p:last-child {
        max-width: 480px;
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: 15px;
        line-height: 1.7;
    }

    .work-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.22fr) minmax(390px, 0.78fr);
        gap: 16px;
    }

    .setlist-card {
        display: flex;
        min-width: 0;
        flex-direction: column;
        overflow: hidden;
    }

    .setlist-media {
        position: relative;
        display: block;
        overflow: hidden;
        aspect-ratio: 16 / 9;
        border-bottom: 1px solid var(--color-border);
        background: #090a0b;
    }

    .setlist-media::after,
    .side-project-media::after {
        position: absolute;
        inset: 0;
        background: linear-gradient(145deg, transparent 50%, rgba(0, 0, 0, 0.3));
        content: "";
        pointer-events: none;
    }

    .setlist-media img,
    .side-project-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 420ms var(--ease-quick), filter 420ms var(--ease-quick);
    }

    .setlist-media:hover img,
    .side-project-media:hover img {
        filter: saturate(1.08);
        transform: scale(1.018);
    }

    .media-number {
        position: absolute;
        z-index: 2;
        top: 18px;
        left: 18px;
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 999px;
        background: rgba(3, 4, 5, 0.52);
        color: white;
        font-family: var(--font-display);
        font-size: 9px;
        backdrop-filter: blur(12px);
    }

    .setlist-copy {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(230px, 0.55fr);
        gap: 12px 38px;
        padding: clamp(28px, 4vw, 52px);
    }

    .project-meta {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .setlist-copy h3 {
        margin: 34px 0 0;
        font-size: clamp(46px, 6vw, 78px);
        font-weight: 520;
        line-height: 0.94;
        letter-spacing: -0.07em;
    }

    .setlist-copy > p {
        align-self: end;
        margin: 34px 0 0;
        color: var(--color-muted-foreground);
        font-size: 15px;
        line-height: 1.72;
    }

    .project-actions {
        grid-column: 1 / -1;
        align-items: center;
        padding-top: 10px;
    }

    .side-projects {
        display: grid;
        gap: 16px;
    }

    .side-project {
        display: grid;
        grid-template-columns: minmax(160px, 0.72fr) minmax(220px, 1fr);
        min-height: 0;
        overflow: hidden;
    }

    .side-project-media {
        position: relative;
        display: block;
        min-height: 260px;
        overflow: hidden;
        border-right: 1px solid var(--color-border);
        background: #101419;
    }

    .side-project-copy {
        position: relative;
        display: flex;
        min-width: 0;
        flex-direction: column;
        padding: 24px;
    }

    .project-index {
        position: absolute;
        top: 22px;
        right: 22px;
        color: var(--project-accent);
        font-family: var(--font-display);
        font-size: 9px;
    }

    .side-project-copy > p {
        max-width: calc(100% - 34px);
        margin: 0;
        color: var(--project-accent);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.1em;
        line-height: 1.5;
        text-transform: uppercase;
    }

    .side-project-copy h3 {
        margin: 24px 0 0;
        font-size: clamp(29px, 3vw, 42px);
        font-weight: 540;
        line-height: 0.98;
        letter-spacing: -0.055em;
    }

    .side-project-copy > span:not(.project-index) {
        margin-top: 16px;
        color: var(--color-muted-foreground);
        font-size: 13px;
        line-height: 1.6;
    }

    .side-project-link {
        display: flex;
        min-height: 44px;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-top: auto;
        padding-top: 18px;
        color: var(--color-foreground);
        font-family: var(--font-display);
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .side-project-link :global(svg) {
        color: var(--project-accent);
        transition: transform 160ms var(--ease-quick);
    }

    .side-project-link:hover :global(svg) {
        transform: translate(2px, -2px);
    }

    .routes-section {
        display: grid;
        grid-template-columns: minmax(320px, 0.76fr) minmax(0, 1fr);
        gap: clamp(54px, 9vw, 140px);
        margin-top: clamp(124px, 16vw, 230px);
        padding: clamp(34px, 6vw, 80px);
        border-radius: 28px;
        background: var(--color-paper);
        color: var(--color-ink);
    }

    .routes-heading .section-kicker {
        color: rgba(6, 9, 11, 0.5);
    }

    .routes-heading .section-kicker::before {
        background: #315b22;
    }

    .routes-heading h2 {
        max-width: 590px;
        margin: clamp(46px, 7vw, 88px) 0 0;
        font-size: clamp(40px, 5vw, 66px);
        font-weight: 530;
        line-height: 0.98;
        letter-spacing: -0.06em;
        text-wrap: balance;
    }

    .routes-heading > p:last-child {
        max-width: 500px;
        margin: 28px 0 0;
        color: rgba(6, 9, 11, 0.64);
        font-size: 15px;
        line-height: 1.72;
    }

    .route-list {
        border-top: 1px solid rgba(6, 9, 11, 0.2);
    }

    .route-list > a {
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) auto;
        align-items: center;
        gap: 16px;
        min-height: 118px;
        padding: 18px 6px;
        border-bottom: 1px solid rgba(6, 9, 11, 0.16);
        transition: padding 180ms var(--ease-quick), background 180ms var(--ease-quick);
    }

    .route-list > a:hover {
        padding-inline: 14px;
        background: rgba(6, 9, 11, 0.035);
    }

    .route-index {
        color: rgba(6, 9, 11, 0.42);
        font-family: var(--font-display);
        font-size: 9px;
    }

    .route-copy {
        display: grid;
        gap: 8px;
    }

    .route-copy strong {
        font-size: 21px;
        font-weight: 600;
        letter-spacing: -0.035em;
    }

    .route-copy > span {
        color: rgba(6, 9, 11, 0.58);
        font-size: 13px;
        line-height: 1.5;
    }

    @media (max-width: 1120px) {
        .section-intro {
            grid-template-columns: minmax(160px, 0.36fr) minmax(0, 1fr);
            align-items: start;
        }

        .section-intro > p:last-child {
            grid-column: 2;
        }

        .work-grid {
            grid-template-columns: 1fr;
        }

        .side-projects {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .side-project {
            grid-template-columns: 1fr;
        }

        .side-project-media {
            min-height: 0;
            aspect-ratio: 16 / 9;
            border-right: 0;
            border-bottom: 1px solid var(--color-border);
        }

        .side-project-copy {
            min-height: 260px;
        }
    }

    @media (max-width: 860px) {
        .hero {
            min-height: auto;
        }

        .hero-bottom,
        .routes-section {
            grid-template-columns: 1fr;
        }

        .now-card {
            max-width: 650px;
        }

        .setlist-copy {
            grid-template-columns: 1fr;
        }

        .setlist-copy > p,
        .project-actions {
            grid-column: auto;
        }

        .routes-section {
            gap: 58px;
        }
    }

    @media (max-width: 640px) {
        .hero {
            gap: 56px;
            padding: 72px 2px 92px;
        }

        .hero-meta span {
            flex: 0 0 100%;
        }

        .hero-meta span + span::before {
            margin-left: 0;
        }

        .hero-actions,
        .project-actions {
            display: grid;
        }

        .button-primary,
        .button-secondary {
            width: 100%;
        }

        .now-card dl {
            grid-template-columns: 1fr;
        }

        .now-card dl div + div {
            padding-left: 0;
            border-top: 1px solid var(--color-border);
            border-left: 0;
        }

        .section-intro {
            grid-template-columns: 1fr;
            gap: 34px;
        }

        .section-intro > p:last-child {
            grid-column: auto;
        }

        .side-projects {
            grid-template-columns: 1fr;
        }

        .setlist-card,
        .side-project,
        .routes-section {
            border-radius: 22px;
        }

        .setlist-copy {
            padding: 26px 22px 30px;
        }

        .project-meta {
            align-items: flex-start;
            flex-direction: column;
        }

        .setlist-copy h3 {
            margin-top: 22px;
        }

        .setlist-copy > p {
            margin-top: 10px;
        }

        .routes-section {
            padding: 30px 22px;
        }

        .route-list > a {
            grid-template-columns: 30px minmax(0, 1fr) auto;
            min-height: 128px;
        }
    }

    @media (max-height: 620px) and (orientation: landscape) {
        .hero {
            min-height: auto;
            gap: 44px;
            padding-block: 54px 84px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .setlist-media:hover img,
        .side-project-media:hover img,
        .side-project-link:hover :global(svg) {
            transform: none;
        }
    }
</style>
