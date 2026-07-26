<script lang="ts">
    import { AuroraVeil, SiteFooter, SiteHeader } from "@homelab/shared";
    import * as m from "$lib/paraglide/messages.js";
    import { locales, localizeHref, getLocale } from "$lib/paraglide/runtime";
    import { base } from "$app/paths";
    import { page } from "$app/state";

    const profileHref = $derived(`${base}${localizeHref("/")}`);
    const entryHref = $derived(localizeHref("https://www.yutinglia.com"));
    const projectsHref = $derived(
        localizeHref("https://www.yutinglia.com/projects"),
    );

    const navItems = $derived([
        { label: m.nav_home(), href: entryHref },
        { label: m.nav_projects(), href: projectsHref },
        { label: m.nav_profile(), href: profileHref, current: true },
    ]);

    const localeOptions = $derived(
        locales.map((locale) => ({
            locale,
            href: `${base}${localizeHref(page.url.pathname, { locale })}`,
            label: locale === "en" ? m.lang_en() : m.lang_zh_hant(),
        })),
    );

    const focusAreas = $derived([
        {
            index: "01",
            title: m.profile_focus_platform_title(),
            description: m.profile_focus_platform_desc(),
        },
        {
            index: "02",
            title: m.profile_focus_product_title(),
            description: m.profile_focus_product_desc(),
        },
        {
            index: "03",
            title: m.profile_focus_ai_title(),
            description: m.profile_focus_ai_desc(),
        },
    ]);

    const stackGroups = $derived([
        {
            group: m.profile_stack_group_infra(),
            items: [
                "Linux",
                "Docker",
                "Podman",
                "Proxmox VE",
                "OPNsense",
                "Nginx",
                "Caddy",
                "AWS",
                "Cloudflare",
            ],
        },
        {
            group: m.profile_stack_group_languages(),
            items: ["Go", "Python", "TypeScript", "Rust", "C++", "Java"],
        },
        {
            group: m.profile_stack_group_backend(),
            items: ["FastAPI", "NestJS", "Axum", "Fastify", "PostgreSQL"],
        },
        {
            group: m.profile_stack_group_frontend(),
            items: [
                "React",
                "Svelte",
                "Vue",
                "Next.js",
                "TanStack",
                "Tailwind CSS",
            ],
        },
        {
            group: m.profile_stack_group_ai_agents(),
            items: [
                "Ollama",
                "llama.cpp",
                "vLLM",
                "OpenClaw",
                "Hermes Agent",
                "OpenCode",
                "Claude Code",
                "Codex",
            ],
        },
        {
            group: m.profile_stack_group_practice(),
            items: [
                "Self-Hosted",
                "Infrastructure-as-Code",
                "CI/CD",
                "Observability",
            ],
        },
    ]);

    const portfolioTech = [
        "React 19",
        "TypeScript",
        "FastAPI",
        "PostgreSQL 18",
        "Flyway",
        "Docker",
        "GitHub Actions",
    ];

    const elsewhere = $derived([
        {
            label: m.profile_elsewhere_github_label(),
            handle: "@yutinglia",
            href: "https://github.com/yutinglia",
            external: true,
        },
        {
            label: m.profile_elsewhere_email_label(),
            handle: "yutinglia@gmail.com",
            href: "mailto:yutinglia@gmail.com",
            external: false,
        },
    ]);

    let year = $state(new Date().getFullYear());
</script>

<svelte:head>
    <title>{m.profile_meta_title()}</title>
    <meta name="description" content={m.profile_meta_description()} />
    <meta name="theme-color" content="#071018" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content={m.profile_meta_title()} />
    <meta property="og:description" content={m.profile_meta_description()} />
    <meta property="og:url" content="https://profile.yutinglia.com/" />
    <meta property="og:image" content="https://profile.yutinglia.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<AuroraVeil veilVariant="soft" />

<a class="av-skip" href="#main">{m.skip_to_content()}</a>

<div class="av-overlay av-overlay-center">
    <SiteHeader
        brandHref={profileHref}
        brandSubtitle="Profile"
        {navItems}
        currentLocale={getLocale()}
        {localeOptions}
        localeAriaLabel={m.languages_aria()}
    />

    <main id="main">
        <section class="profile-hero">
            <div class="profile-hero-copy">
                <p class="eyebrow">{m.profile_label()}</p>
                <h1 class="display-title">{m.profile_name()}</h1>
                <p class="profile-role">{m.profile_role()}</p>
                <p class="body-lead profile-intro">{m.profile_intro()}</p>
            </div>

            <aside class="profile-card glass-panel" aria-label={m.profile_currently_heading()}>
                <div class="profile-card-top">
                    <span>PROFILE / 2026</span>
                    <span class="status-pill">
                        <span class="status-dot" aria-hidden="true"></span>
                        {m.profile_availability()}
                    </span>
                </div>
                <div class="profile-monogram" aria-hidden="true">T/</div>
                <dl>
                    <div>
                        <dt>{m.entry_signal_location_label()}</dt>
                        <dd>{m.profile_location()}</dd>
                    </div>
                    <div>
                        <dt>{m.profile_currently_heading()}</dt>
                        <dd>Homelab · AI · Systems</dd>
                    </div>
                </dl>
            </aside>
        </section>

        <section class="about-section" aria-labelledby="about-title">
            <div class="section-rail">
                <p class="eyebrow">{m.profile_focus_label()}</p>
                <span>01 — 03</span>
            </div>
            <div class="about-content">
                <h2 class="section-heading" id="about-title">
                    {m.profile_about_heading()}
                </h2>
                <div class="about-copy">
                    <p>{m.profile_about_p1()}</p>
                    <p>{m.profile_about_p2()}</p>
                    <p>{m.profile_about_p3()}</p>
                </div>

                <div class="focus-grid">
                    {#each focusAreas as item}
                        <article class="focus-card glass-panel">
                            <span>{item.index}</span>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    {/each}
                </div>
            </div>
        </section>

        <section class="current-panel glass-panel" aria-labelledby="current-title">
            <p class="eyebrow">{m.profile_currently_heading()}</p>
            <p id="current-title">{m.profile_currently_body()}</p>
            <div class="current-signal" aria-hidden="true">
                {#each [30, 68, 44, 82, 56, 92, 70, 48, 76, 62] as height}
                    <span style={`height: ${height}%`}></span>
                {/each}
            </div>
        </section>

        <section class="portfolio-section" aria-labelledby="portfolio-title">
            <div class="portfolio-heading">
                <p class="eyebrow">{m.profile_portfolio_label()}</p>
                <h2 class="section-heading" id="portfolio-title">
                    {m.profile_portfolio_heading()}
                </h2>
                <p>{m.profile_portfolio_body()}</p>
            </div>

            <article class="portfolio-card glass-panel">
                <div class="portfolio-media">
                    <img
                        src={`${base}/projects/setlist-og.png`}
                        alt="Setlist — VTuber Karaoke Search"
                        width="1536"
                        height="1024"
                    />
                    <span class="status-pill">
                        <span class="status-dot" aria-hidden="true"></span>
                        {m.project_live()}
                    </span>
                </div>
                <div class="portfolio-body">
                    <div class="portfolio-title-row">
                        <div>
                            <span>{m.project_setlist_kicker()}</span>
                            <h3>{m.project_setlist_title()}</h3>
                        </div>
                        <code>{m.project_setlist_version()}</code>
                    </div>
                    <p>{m.project_setlist_description()}</p>

                    <div class="portfolio-tech" aria-label={m.project_tech_heading()}>
                        {#each portfolioTech as tech}
                            <code>{tech}</code>
                        {/each}
                    </div>

                    <div class="portfolio-actions">
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
                        <a class="text-link" href={projectsHref}>
                            {m.profile_portfolio_all()}
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </article>
        </section>

        <section class="stack-section" aria-labelledby="stack-title">
            <div class="stack-heading">
                <p class="eyebrow">{m.profile_stack_heading()}</p>
                <div>
                    <h2 class="section-heading" id="stack-title">
                        {m.profile_stack_heading()}
                    </h2>
                    <p>{m.profile_stack_subtitle()}</p>
                </div>
            </div>

            <div class="stack-grid">
                {#each stackGroups as group}
                    <article class="stack-card glass-panel">
                        <h3>{group.group}</h3>
                        <div>
                            {#each group.items as item}
                                <code>{item}</code>
                            {/each}
                        </div>
                    </article>
                {/each}
            </div>
        </section>

        <section class="elsewhere-section" aria-labelledby="elsewhere-title">
            <div>
                <p class="eyebrow">{m.profile_elsewhere_heading()}</p>
                <h2 class="section-heading" id="elsewhere-title">
                    {m.profile_elsewhere_heading()}
                </h2>
                <p>{m.profile_elsewhere_subtitle()}</p>
            </div>
            <nav class="elsewhere-links" aria-label={m.profile_elsewhere_heading()}>
                {#each elsewhere as link}
                    <a
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                    >
                        <span>
                            <strong>{link.label}</strong>
                            <small>{link.handle}</small>
                        </span>
                        <span aria-hidden="true">↗</span>
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
    .profile-hero {
        display: grid;
        grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
        align-items: end;
        gap: clamp(56px, 9vw, 128px);
        min-height: min(750px, calc(100vh - 120px));
        padding: clamp(88px, 13vw, 156px) 0 clamp(70px, 9vw, 110px);
    }

    .profile-hero .display-title {
        margin-top: 30px;
    }

    .profile-role {
        margin: 20px 0 0;
        color: var(--color-foreground);
        font-family: var(--font-display);
        font-size: clamp(14px, 1.5vw, 18px);
        letter-spacing: 0.04em;
    }

    .profile-intro {
        max-width: 710px;
        margin: 28px 0 0;
    }

    .profile-card {
        min-height: 420px;
        padding: 24px;
    }

    .profile-card-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.12em;
    }

    .profile-card .status-pill {
        max-width: 190px;
        line-height: 1.35;
    }

    .profile-monogram {
        display: grid;
        width: 118px;
        height: 118px;
        place-items: center;
        margin: 54px 0 52px auto;
        border: 1px solid var(--color-border-strong);
        border-radius: 32px;
        background: linear-gradient(145deg, rgba(143, 240, 194, 0.12), rgba(141, 199, 255, 0.05));
        box-shadow: 0 20px 70px rgba(143, 240, 194, 0.08);
        font-family: var(--font-display);
        font-size: 38px;
        letter-spacing: -0.1em;
    }

    .profile-card dl {
        display: grid;
        gap: 16px;
        margin: 0;
    }

    .profile-card dl > div {
        display: grid;
        grid-template-columns: 0.8fr 1.2fr;
        gap: 16px;
        padding-top: 14px;
        border-top: 1px solid var(--color-border);
    }

    .profile-card dt,
    .section-rail span {
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.11em;
        text-transform: uppercase;
    }

    .profile-card dd {
        margin: 0;
        font-size: 13px;
        text-align: right;
    }

    .about-section {
        display: grid;
        grid-template-columns: minmax(170px, 0.3fr) minmax(0, 1fr);
        gap: clamp(42px, 8vw, 120px);
        padding-top: clamp(90px, 12vw, 156px);
    }

    .section-rail {
        display: flex;
        min-height: 120px;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 22px;
        border-bottom: 1px solid var(--color-border);
    }

    .about-content {
        max-width: 940px;
    }

    .about-copy {
        columns: 2;
        column-gap: clamp(34px, 5vw, 72px);
        margin-top: 42px;
    }

    .about-copy p {
        margin: 0 0 22px;
        break-inside: avoid;
        color: var(--color-muted-foreground);
        font-size: 16px;
        line-height: 1.75;
    }

    .focus-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 48px;
    }

    .focus-card {
        min-height: 230px;
        padding: 24px;
    }

    .focus-card > span,
    .portfolio-title-row > div > span {
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .focus-card h3 {
        margin: 62px 0 14px;
        font-size: 22px;
        font-weight: 540;
        letter-spacing: -0.03em;
    }

    .focus-card p {
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: 13px;
        line-height: 1.6;
    }

    .current-panel {
        display: grid;
        grid-template-columns: 180px minmax(0, 1fr) 180px;
        align-items: center;
        gap: clamp(30px, 6vw, 84px);
        min-height: 230px;
        margin-top: clamp(74px, 10vw, 128px);
        padding: clamp(28px, 5vw, 56px);
    }

    .current-panel > p:nth-child(2) {
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: clamp(16px, 1.7vw, 20px);
        line-height: 1.68;
    }

    .current-signal {
        display: flex;
        height: 82px;
        align-items: center;
        gap: 6px;
    }

    .current-signal span {
        width: 6px;
        border-radius: 5px;
        background: linear-gradient(to top, rgba(141, 199, 255, 0.12), rgba(143, 240, 194, 0.72));
    }

    .portfolio-section,
    .stack-section,
    .elsewhere-section {
        padding-top: clamp(92px, 13vw, 168px);
    }

    .portfolio-heading {
        display: grid;
        grid-template-columns: minmax(180px, 0.34fr) minmax(0, 0.8fr) minmax(260px, 0.5fr);
        align-items: start;
        gap: clamp(30px, 5vw, 72px);
        margin-bottom: 36px;
    }

    .portfolio-heading > p:last-child,
    .stack-heading p,
    .elsewhere-section > div > p:last-child {
        margin: 0;
        color: var(--color-muted-foreground);
        font-size: 14px;
        line-height: 1.68;
    }

    .portfolio-card {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(420px, 0.82fr);
        overflow: hidden;
    }

    .portfolio-media {
        position: relative;
        min-height: 520px;
        overflow: hidden;
        background: #101223;
    }

    .portfolio-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .portfolio-media .status-pill {
        position: absolute;
        top: 20px;
        left: 20px;
        backdrop-filter: blur(12px);
    }

    .portfolio-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: clamp(32px, 5vw, 64px);
    }

    .portfolio-title-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
    }

    .portfolio-title-row h3 {
        margin: 14px 0 0;
        font-size: clamp(42px, 5vw, 64px);
        font-weight: 520;
        letter-spacing: -0.055em;
    }

    .portfolio-title-row > code {
        padding: 7px 9px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        color: var(--color-dim-foreground);
        font-family: var(--font-display);
        font-size: 9px;
    }

    .portfolio-body > p {
        margin: 24px 0 0;
        color: var(--color-muted-foreground);
        font-size: 15px;
        line-height: 1.72;
    }

    .portfolio-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin-top: 28px;
        padding-top: 26px;
        border-top: 1px solid var(--color-border);
    }

    .portfolio-tech code,
    .stack-card code {
        padding: 7px 9px;
        border: 1px solid var(--color-border);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        color: var(--color-muted-foreground);
        font-family: var(--font-display);
        font-size: 9px;
    }

    .portfolio-actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px 16px;
        margin-top: 32px;
    }

    .stack-heading {
        display: grid;
        grid-template-columns: minmax(180px, 0.34fr) minmax(0, 1fr);
        gap: clamp(30px, 5vw, 72px);
        margin-bottom: 34px;
    }

    .stack-heading p {
        margin-top: 18px;
    }

    .stack-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
    }

    .stack-card {
        min-height: 210px;
        padding: 24px;
    }

    .stack-card h3 {
        margin: 0 0 42px;
        font-family: var(--font-display);
        font-size: 10px;
        font-weight: 520;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .stack-card > div {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
    }

    .elsewhere-section {
        display: grid;
        grid-template-columns: minmax(260px, 0.65fr) minmax(0, 1fr);
        gap: clamp(44px, 9vw, 132px);
    }

    .elsewhere-section h2 {
        margin-top: 22px;
    }

    .elsewhere-section > div > p:last-child {
        margin-top: 20px;
    }

    .elsewhere-links {
        border-top: 1px solid var(--color-border);
    }

    .elsewhere-links a {
        display: flex;
        min-height: 98px;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 16px 8px;
        border-bottom: 1px solid var(--color-border);
        transition:
            padding 180ms var(--ease-quick),
            background 180ms var(--ease-quick);
    }

    .elsewhere-links a:hover {
        padding-inline: 18px;
        background: rgba(255, 255, 255, 0.035);
    }

    .elsewhere-links a > span:first-child {
        display: grid;
        gap: 5px;
    }

    .elsewhere-links strong {
        font-size: 20px;
        font-weight: 520;
    }

    .elsewhere-links small {
        color: var(--color-dim-foreground);
        font-size: 12px;
    }

    @media (max-width: 1020px) {
        .profile-hero,
        .portfolio-card {
            grid-template-columns: 1fr;
        }

        .profile-hero {
            min-height: auto;
        }

        .profile-card {
            width: min(100%, 620px);
        }

        .portfolio-heading {
            grid-template-columns: 1fr 1.4fr;
        }

        .portfolio-heading > p:last-child {
            grid-column: 2;
        }

        .portfolio-media {
            min-height: min(62vw, 560px);
        }

        .stack-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 760px) {
        .profile-hero {
            padding-top: 82px;
        }

        .about-section,
        .portfolio-heading,
        .stack-heading,
        .elsewhere-section {
            grid-template-columns: 1fr;
        }

        .section-rail {
            min-height: auto;
            flex-direction: row;
        }

        .about-copy {
            columns: 1;
        }

        .focus-grid,
        .stack-grid {
            grid-template-columns: 1fr;
        }

        .current-panel {
            grid-template-columns: 1fr;
        }

        .current-signal {
            display: none;
        }

        .portfolio-heading > p:last-child {
            grid-column: auto;
        }

        .portfolio-media {
            min-height: 330px;
        }

        .portfolio-media img {
            object-position: 44% center;
        }

        .portfolio-actions {
            align-items: stretch;
            flex-direction: column;
        }

        .portfolio-actions .text-link {
            justify-content: center;
        }
    }
</style>
