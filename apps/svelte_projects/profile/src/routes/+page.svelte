<script lang="ts">
    import { base } from "$app/paths";
    import { page } from "$app/state";
    import ArrowUpRight from "$lib/components/ArrowUpRight.svelte";
    import * as m from "$lib/paraglide/messages.js";
    import { getLocale, locales, localizeHref } from "$lib/paraglide/runtime";
    import { AuroraVeil } from "@homelab/shared";
    import { onMount } from "svelte";

    const profileHref = $derived(`${base}${localizeHref("/")}`);

    const navItems = $derived([
        { label: m.profile_nav_work(), href: "#work" },
        { label: m.profile_nav_about(), href: "#about" },
        { label: m.profile_nav_contact(), href: "#contact" },
    ]);

    const localeOptions = $derived(
        locales.map((locale) => ({
            locale,
            href: `${base}${localizeHref(page.url.pathname, { locale })}`,
            label: locale === "en" ? m.lang_en() : m.lang_zh_hant(),
        })),
    );

    const projects = $derived([
        {
            index: "01",
            slug: "setlist",
            title: m.project_setlist_title(),
            kicker: m.project_setlist_kicker(),
            status: m.project_live(),
            description: m.project_setlist_description(),
            image: `${base}/projects/setlist-og.png`,
            alt: m.project_setlist_alt(),
            width: 1731,
            height: 909,
            technologies: ["React", "FastAPI", "PostgreSQL", "Docker"],
            links: [
                {
                    label: m.project_setlist_open(),
                    href: "https://setlist.yutinglia.com",
                    primary: true,
                },
                {
                    label: m.project_setlist_github(),
                    href: "https://github.com/yutinglia/setlist",
                    primary: false,
                },
            ],
        },
        {
            index: "02",
            slug: "fennevia",
            title: m.project_fennevia_title(),
            kicker: m.project_fennevia_kicker(),
            status: m.project_fennevia_status(),
            description: m.project_fennevia_description(),
            image: `${base}/projects/fennevia-overview.svg`,
            alt: m.project_fennevia_alt(),
            width: 1600,
            height: 900,
            technologies: ["JavaScript", "TypeScript", "Svelte", "PowerShell"],
            links: [
                {
                    label: m.project_fennevia_github(),
                    href: "https://github.com/yutinglia/fennevia",
                    primary: true,
                },
            ],
        },
        {
            index: "03",
            slug: "dial",
            title: m.project_dial_title(),
            kicker: m.project_dial_kicker(),
            status: m.project_dial_status(),
            description: m.project_dial_description(),
            image: `${base}/projects/dial-canvas-overview.svg`,
            alt: m.project_dial_alt(),
            width: 1600,
            height: 900,
            technologies: ["Svelte 5", "TypeScript", "WXT", "WebExtension"],
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

    const focusAreas = $derived([
        {
            index: "01",
            title: m.profile_focus_product_title(),
            description: m.profile_focus_product_desc(),
        },
        {
            index: "02",
            title: m.profile_focus_platform_title(),
            description: m.profile_focus_platform_desc(),
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
            items: ["Linux", "Proxmox VE", "Docker / Podman", "OPNsense", "Cloudflare"],
        },
        {
            group: m.profile_stack_group_languages(),
            items: ["TypeScript", "Go", "Python", "Rust", "Svelte", "React"],
        },
        {
            group: m.profile_stack_group_backend(),
            items: ["FastAPI", "PostgreSQL", "Nginx", "Caddy", "GitHub Actions"],
        },
        {
            group: m.profile_stack_group_ai_agents(),
            items: ["Ollama", "llama.cpp", "vLLM", "Codex", "Claude Code"],
        },
    ]);

    const year = new Date().getFullYear();

    onMount(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const revealItems = Array.from(
            document.querySelectorAll<HTMLElement>("[data-reveal]"),
        );

        if (!("IntersectionObserver" in window)) return;

        for (const item of revealItems) item.dataset.revealState = "waiting";

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const target = entry.target as HTMLElement;
                    target.dataset.revealState = "visible";
                    observer.unobserve(target);
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        );

        for (const item of revealItems) observer.observe(item);

        return () => observer.disconnect();
    });
</script>

<svelte:head>
    <title>{m.profile_meta_title()}</title>
    <meta name="description" content={m.profile_meta_description()} />
    <meta name="theme-color" content="#06090b" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content={m.profile_meta_title()} />
    <meta property="og:description" content={m.profile_meta_description()} />
    <meta property="og:url" content="https://profile.yutinglia.com/" />
    <meta property="og:image" content="https://profile.yutinglia.com/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<AuroraVeil veilVariant="soft" />

<a class="skip-link" href="#main">{m.skip_to_content()}</a>

<div class="portfolio-site">
    <div class="ambient-grid" aria-hidden="true"></div>

    <header class="topbar">
        <a class="wordmark" href={profileHref} aria-label={m.home_aria()}>
            <span class="wordmark-name">Ting</span>
            <span class="wordmark-context">/ portfolio</span>
        </a>

        <nav class="topnav" aria-label={m.profile_nav_aria()}>
            {#each navItems as item}
                <a href={item.href}>{item.label}</a>
            {/each}
        </nav>

        <nav class="language-nav" aria-label={m.languages_aria()}>
            {#each localeOptions as option}
                <a
                    href={option.href}
                    data-sveltekit-reload
                    aria-current={option.locale === getLocale() ? "true" : undefined}
                >
                    {option.label}
                </a>
            {/each}
        </nav>
    </header>

    <main id="main">
        <section class="hero" aria-labelledby="hero-title">
            <div class="hero-meta">
                <span>{m.profile_location()}</span>
                <span aria-hidden="true">22.3° N / 114.2° E</span>
                <span>{m.profile_role()}</span>
            </div>

            <div class="hero-heading">
                <p class="section-kicker">{m.profile_hero_kicker()}</p>
                <h1 id="hero-title">
                    <span>{m.profile_hero_title_line_1()}</span>
                    <span class="hero-title-accent">{m.profile_hero_title_line_2()}</span>
                </h1>
            </div>

            <div class="hero-bottom">
                <div class="hero-intro">
                    <p>{m.profile_hero_intro()}</p>
                    <div class="hero-actions">
                        <a class="cta cta-primary" href="#work">
                            <span aria-hidden="true">01</span>
                            {m.profile_hero_primary()}
                        </a>
                        <a class="cta cta-secondary" href="#about">
                            <span aria-hidden="true">02</span>
                            {m.profile_hero_secondary()}
                        </a>
                    </div>
                </div>

                <aside class="now-note" aria-labelledby="now-title">
                    <div class="now-note-heading">
                        <span class="live-dot" aria-hidden="true"></span>
                        <p id="now-title">{m.profile_now_label()}</p>
                    </div>
                    <p>{m.profile_now_body()}</p>
                </aside>
            </div>
        </section>

        <section class="work-section" id="work" aria-labelledby="work-title">
            <header class="section-intro" data-reveal>
                <div>
                    <p class="section-kicker">{m.profile_work_kicker()}</p>
                    <span class="section-count" aria-hidden="true">01 — 03</span>
                </div>
                <h2 id="work-title">{m.profile_work_heading()}</h2>
                <p>{m.profile_work_intro()}</p>
            </header>

            <div class="project-grid">
                {#each projects as project, index}
                    <article
                        class={`project-card project-${project.slug}`}
                        data-reveal
                        style={`--reveal-delay: ${index * 70}ms`}
                    >
                        <div class="project-visual">
                            <img
                                src={project.image}
                                alt={project.alt}
                                width={project.width}
                                height={project.height}
                                loading="lazy"
                                decoding="async"
                            />
                        </div>

                        <div class="project-copy">
                            <div class="project-meta">
                                <span>{project.index} / 03</span>
                                <span class="project-status">
                                    <span class="status-light" aria-hidden="true"></span>
                                    {project.status}
                                </span>
                            </div>

                            <p class="project-kicker">{project.kicker}</p>
                            <h3>{project.title}</h3>
                            <p class="project-description">{project.description}</p>

                            <ul class="tech-list" aria-label={m.project_tech_heading()}>
                                {#each project.technologies as technology}
                                    <li>{technology}</li>
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
                                        <span>{link.label}</span>
                                        <ArrowUpRight />
                                    </a>
                                {/each}
                            </div>
                        </div>
                    </article>
                {/each}
            </div>
        </section>

        <section class="about-section" id="about" aria-labelledby="about-title">
            <header class="about-heading" data-reveal>
                <div>
                    <p class="section-kicker">{m.profile_about_kicker()}</p>
                    <span class="section-count" aria-hidden="true">04 / approach</span>
                </div>
                <h2 id="about-title">{m.profile_about_heading()}</h2>
            </header>

            <div class="about-layout">
                <div class="about-copy" data-reveal>
                    <p class="about-lead">{m.profile_about_p1()}</p>
                    <p>{m.profile_about_p2()}</p>
                    <p>{m.profile_about_p3()}</p>
                </div>

                <div class="focus-list">
                    {#each focusAreas as area, index}
                        <article data-reveal style={`--reveal-delay: ${index * 70}ms`}>
                            <span>{area.index}</span>
                            <div>
                                <h3>{area.title}</h3>
                                <p>{area.description}</p>
                            </div>
                        </article>
                    {/each}
                </div>
            </div>

            <section class="stack-panel" aria-labelledby="stack-title" data-reveal>
                <header>
                    <p class="section-kicker">{m.profile_stack_kicker()}</p>
                    <h3 id="stack-title">{m.profile_stack_heading()}</h3>
                    <p>{m.profile_stack_subtitle()}</p>
                </header>

                <div class="stack-groups">
                    {#each stackGroups as group}
                        <section>
                            <h4>{group.group}</h4>
                            <ul>
                                {#each group.items as item}
                                    <li>{item}</li>
                                {/each}
                            </ul>
                        </section>
                    {/each}
                </div>
            </section>
        </section>

        <section class="contact-section" id="contact" aria-labelledby="contact-title" data-reveal>
            <p class="section-kicker">{m.profile_contact_kicker()}</p>
            <div class="contact-layout">
                <h2 id="contact-title">{m.profile_contact_heading()}</h2>
                <div class="contact-copy">
                    <p>{m.profile_contact_body()}</p>
                    <div class="contact-links">
                        <a class="contact-link-primary" href="mailto:yutinglia@gmail.com">
                            <span>{m.profile_contact_email()}</span>
                            <ArrowUpRight size={20} />
                        </a>
                        <a
                            href="https://github.com/yutinglia"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>{m.profile_contact_github()}</span>
                            <ArrowUpRight size={20} />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="portfolio-footer">
        <div>
            <span>{m.copyright_year({ year })}</span>
            <span class="footer-status">
                <span class="live-dot" aria-hidden="true"></span>
                {m.footer_status()}
            </span>
        </div>
        <nav aria-label="Footer">
            <a href="https://www.yutinglia.com">{m.profile_footer_home()}</a>
            <a href="https://github.com/yutinglia" target="_blank" rel="noopener noreferrer">
                GitHub
            </a>
        </nav>
    </footer>
</div>

<style>
    :global(html) {
        scroll-padding-top: 112px;
    }

    :global(body) {
        background: #06090b;
    }

    .portfolio-site {
        --site-ink: #06090b;
        --site-surface: rgba(8, 12, 14, 0.84);
        --site-surface-raised: rgba(13, 18, 20, 0.9);
        --site-paper: #f3f2eb;
        --site-text: #f4f6f1;
        --site-muted: rgba(234, 240, 235, 0.72);
        --site-dim: rgba(234, 240, 235, 0.48);
        --site-line: rgba(238, 246, 240, 0.16);
        --site-line-strong: rgba(238, 246, 240, 0.3);
        --site-signal: #c9ff72;
        --site-blue: #8bc8ff;
        --site-coral: #ff917e;
        --site-radius: 30px;
        --site-ease: cubic-bezier(0.2, 0.75, 0.25, 1);

        position: relative;
        z-index: 2;
        isolation: isolate;
        width: min(100%, 1536px);
        min-height: 100dvh;
        margin-inline: auto;
        padding: clamp(16px, 2.4vw, 36px) clamp(18px, 4vw, 64px) 28px;
        color: var(--site-text);
    }

    .portfolio-site::before {
        position: fixed;
        inset: 0;
        z-index: -2;
        pointer-events: none;
        background:
            radial-gradient(circle at 78% 8%, rgba(139, 200, 255, 0.08), transparent 28%),
            linear-gradient(180deg, rgba(4, 7, 8, 0.2), rgba(4, 7, 8, 0.68) 82%);
        content: "";
    }

    .ambient-grid {
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background-image:
            linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
        background-size: 72px 72px;
        mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.65), transparent 72%);
        opacity: 0.52;
    }

    .skip-link {
        position: fixed;
        top: 12px;
        left: 12px;
        z-index: 100;
        min-height: 44px;
        padding: 12px 18px;
        border-radius: 999px;
        background: var(--site-signal, #c9ff72);
        color: #06090b;
        font-family: var(--font-display);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transform: translateY(-180%);
        transition: transform 180ms var(--site-ease, ease-out);
    }

    .skip-link:focus {
        transform: translateY(0);
    }

    .skip-link:focus-visible {
        outline-color: #ffffff;
    }

    .topbar {
        position: sticky;
        top: clamp(8px, 2vw, 24px);
        z-index: 30;
        display: grid;
        grid-template-areas: "brand nav locale";
        grid-template-columns: minmax(180px, 0.8fr) minmax(300px, 1fr) minmax(180px, 0.8fr);
        align-items: center;
        min-height: 64px;
        padding: 8px 10px 8px 18px;
        border: 1px solid var(--site-line);
        border-radius: 999px;
        background: rgba(5, 9, 10, 0.74);
        box-shadow: 0 18px 55px rgba(0, 0, 0, 0.22);
        backdrop-filter: blur(22px) saturate(125%);
    }

    .wordmark {
        grid-area: brand;
        display: inline-flex;
        width: fit-content;
        min-height: 44px;
        align-items: center;
        gap: 10px;
        border-radius: 12px;
        font-family: var(--font-display);
    }

    .wordmark-name {
        color: var(--site-text);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.13em;
        text-transform: uppercase;
    }

    .wordmark-context {
        color: var(--site-dim);
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .topnav {
        grid-area: nav;
        display: flex;
        justify-content: center;
        gap: 4px;
    }

    .topnav a,
    .language-nav a {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        color: var(--site-dim);
        font-family: var(--font-display);
        font-size: 10px;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        transition:
            color 180ms var(--site-ease),
            background 180ms var(--site-ease);
    }

    .topnav a {
        padding-inline: 16px;
    }

    .topnav a:hover,
    .language-nav a:hover {
        background: rgba(255, 255, 255, 0.07);
        color: var(--site-text);
    }

    .language-nav {
        grid-area: locale;
        display: flex;
        justify-content: flex-end;
    }

    .language-nav a {
        min-width: 46px;
        padding-inline: 10px;
    }

    .language-nav a[aria-current="true"] {
        background: var(--site-paper);
        color: var(--site-ink);
    }

    main {
        display: block;
    }

    .hero {
        display: grid;
        min-height: min(900px, calc(100dvh - 88px));
        align-content: space-between;
        gap: clamp(56px, 8vw, 112px);
        padding: clamp(68px, 10vw, 142px) 0 clamp(72px, 9vw, 128px);
    }

    .hero-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px 24px;
        color: var(--site-dim);
        font-family: var(--font-display);
        font-size: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .hero-meta span + span::before {
        margin-right: 24px;
        color: var(--site-line-strong);
        content: "/";
    }

    .section-kicker {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0;
        color: var(--site-dim);
        font-family: var(--font-display);
        font-size: 10px;
        letter-spacing: 0.12em;
        line-height: 1.5;
        text-transform: uppercase;
    }

    .section-kicker::before {
        width: 26px;
        height: 1px;
        flex: 0 0 auto;
        background: currentColor;
        content: "";
    }

    .hero-heading h1 {
        max-width: 1370px;
        margin: clamp(28px, 4vw, 52px) 0 0;
        font-size: clamp(58px, 8.7vw, 138px);
        font-weight: 510;
        line-height: 0.93;
        letter-spacing: -0.072em;
        text-wrap: balance;
    }

    .hero-heading h1 span {
        display: block;
    }

    .hero-title-accent {
        color: var(--site-signal);
    }

    .hero-bottom {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 0.52fr);
        align-items: end;
        gap: clamp(40px, 8vw, 128px);
    }

    .hero-intro > p {
        max-width: 760px;
        margin: 0;
        color: var(--site-muted);
        font-size: clamp(18px, 2vw, 25px);
        line-height: 1.58;
        letter-spacing: -0.02em;
        text-wrap: pretty;
    }

    .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 34px;
    }

    .cta {
        display: inline-flex;
        min-height: 50px;
        align-items: center;
        gap: 14px;
        padding: 0 20px;
        border: 1px solid transparent;
        border-radius: 999px;
        font-family: var(--font-display);
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 0.09em;
        text-transform: uppercase;
        transition:
            transform 180ms var(--site-ease),
            background 180ms var(--site-ease),
            border-color 180ms var(--site-ease);
    }

    .cta span {
        color: currentColor;
        font-size: 9px;
        opacity: 0.58;
    }

    .cta-primary {
        background: var(--site-signal);
        color: var(--site-ink);
    }

    .cta-secondary {
        border-color: var(--site-line-strong);
        background: rgba(7, 11, 12, 0.42);
        color: var(--site-text);
    }

    .cta:hover {
        transform: translateY(-2px);
    }

    .cta-primary:hover {
        background: #dbffa3;
    }

    .cta-secondary:hover {
        border-color: rgba(255, 255, 255, 0.48);
        background: rgba(255, 255, 255, 0.08);
    }

    .now-note {
        padding: 22px 0 4px 24px;
        border-left: 1px solid var(--site-line-strong);
    }

    .now-note-heading {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .now-note-heading p {
        margin: 0;
        color: var(--site-text);
        font-family: var(--font-display);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .live-dot,
    .status-light {
        display: inline-block;
        width: 7px;
        height: 7px;
        flex: 0 0 auto;
        border-radius: 999px;
        background: var(--site-signal);
        box-shadow: 0 0 0 5px rgba(201, 255, 114, 0.09);
    }

    .now-note > p {
        max-width: 420px;
        margin: 18px 0 0;
        color: var(--site-muted);
        font-size: 15px;
        line-height: 1.7;
    }

    .work-section,
    .about-section {
        padding-top: clamp(92px, 12vw, 168px);
        border-top: 1px solid var(--site-line);
        scroll-margin-top: 106px;
    }

    .section-intro {
        display: grid;
        grid-template-columns: minmax(180px, 0.42fr) minmax(380px, 1fr) minmax(240px, 0.48fr);
        align-items: start;
        gap: clamp(30px, 5vw, 72px);
        margin-bottom: clamp(42px, 6vw, 76px);
    }

    .section-count {
        display: block;
        margin-top: 18px;
        color: var(--site-dim);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .section-intro h2,
    .about-heading h2,
    .contact-layout h2 {
        margin: 0;
        font-size: clamp(38px, 5.3vw, 76px);
        font-weight: 520;
        line-height: 1.02;
        letter-spacing: -0.058em;
        text-wrap: balance;
    }

    .section-intro > p {
        margin: 0;
        color: var(--site-muted);
        font-size: 15px;
        line-height: 1.72;
    }

    .project-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 18px;
    }

    .project-card {
        --project-accent: var(--site-signal);

        position: relative;
        overflow: hidden;
        border: 1px solid var(--site-line);
        border-radius: var(--site-radius);
        background: var(--site-surface);
        box-shadow: 0 32px 100px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(22px) saturate(115%);
        transition:
            transform 240ms var(--site-ease),
            border-color 240ms var(--site-ease),
            box-shadow 240ms var(--site-ease);
    }

    .project-card:hover {
        border-color: color-mix(in srgb, var(--project-accent) 44%, transparent);
        box-shadow: 0 38px 110px rgba(0, 0, 0, 0.3);
        transform: translateY(-4px);
    }

    .project-setlist {
        grid-column: 1 / -1;
        display: flex;
        flex-direction: column;
        min-height: 0;
    }

    .project-fennevia {
        --project-accent: var(--site-blue);
        grid-column: 1 / 8;
    }

    .project-dial {
        --project-accent: var(--site-coral);
        grid-column: 8 / -1;
    }

    .project-visual {
        position: relative;
        min-height: 0;
        overflow: hidden;
        aspect-ratio: 16 / 9;
        border-bottom: 1px solid var(--site-line);
        background: #0b0c0e;
    }

    .project-visual::after {
        position: absolute;
        inset: 0;
        background: linear-gradient(145deg, transparent 50%, rgba(0, 0, 0, 0.3));
        content: "";
        pointer-events: none;
    }

    .project-visual img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition:
            filter 420ms var(--site-ease),
            transform 420ms var(--site-ease);
    }

    .project-card:hover .project-visual img {
        filter: saturate(1.08);
        transform: scale(1.018);
    }

    .project-copy {
        display: flex;
        min-height: 410px;
        flex-direction: column;
        padding: clamp(28px, 4vw, 54px);
    }

    .project-setlist .project-copy {
        justify-content: center;
        min-height: auto;
    }

    .project-meta {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        color: var(--site-dim);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
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
    }

    .status-light {
        width: 6px;
        height: 6px;
        background: var(--project-accent);
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--project-accent) 10%, transparent);
    }

    .project-kicker {
        margin: clamp(46px, 7vw, 76px) 0 0;
        color: var(--project-accent);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.11em;
        line-height: 1.6;
        text-transform: uppercase;
    }

    .project-setlist .project-kicker {
        margin-top: clamp(36px, 5vw, 64px);
    }

    .project-copy h3 {
        margin: 14px 0 0;
        font-size: clamp(42px, 5vw, 68px);
        font-weight: 520;
        line-height: 0.96;
        letter-spacing: -0.065em;
    }

    .project-description {
        max-width: 640px;
        margin: 24px 0 0;
        color: var(--site-muted);
        font-size: 16px;
        line-height: 1.72;
        text-wrap: pretty;
    }

    .tech-list {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        margin: 30px 0 0;
        padding: 24px 0 0;
        border-top: 1px solid var(--site-line);
        list-style: none;
    }

    .tech-list li {
        padding: 7px 9px;
        border: 1px solid var(--site-line);
        border-radius: 8px;
        color: var(--site-dim);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.06em;
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
        min-height: 48px;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 0 16px;
        border: 1px solid var(--site-line-strong);
        border-radius: 999px;
        color: var(--site-text);
        font-family: var(--font-display);
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition:
            background 180ms var(--site-ease),
            border-color 180ms var(--site-ease),
            color 180ms var(--site-ease);
    }

    .project-link-primary {
        border-color: var(--project-accent);
        background: var(--project-accent);
        color: var(--site-ink);
    }

    .project-link:hover {
        border-color: var(--project-accent);
        background: color-mix(in srgb, var(--project-accent) 12%, transparent);
    }

    .project-link-primary:hover {
        background: color-mix(in srgb, var(--project-accent) 82%, white);
        color: var(--site-ink);
    }

    .project-link :global(svg),
    .contact-links :global(svg) {
        flex: 0 0 auto;
        transition: transform 180ms var(--site-ease);
    }

    .project-link:hover :global(svg),
    .contact-links a:hover :global(svg) {
        transform: translate(2px, -2px);
    }

    .about-section {
        margin-top: clamp(120px, 15vw, 220px);
    }

    .about-heading {
        display: grid;
        grid-template-columns: minmax(200px, 0.42fr) minmax(0, 1fr);
        gap: clamp(34px, 7vw, 104px);
    }

    .about-heading h2 {
        max-width: 920px;
    }

    .about-layout {
        display: grid;
        grid-template-columns: minmax(320px, 0.72fr) minmax(430px, 1fr);
        gap: clamp(56px, 9vw, 140px);
        margin-top: clamp(64px, 9vw, 124px);
    }

    .about-copy p {
        max-width: 650px;
        margin: 0 0 26px;
        color: var(--site-muted);
        font-size: 16px;
        line-height: 1.78;
        text-wrap: pretty;
    }

    .about-copy .about-lead {
        color: var(--site-text);
        font-size: clamp(22px, 2.6vw, 34px);
        line-height: 1.42;
        letter-spacing: -0.035em;
    }

    .focus-list {
        border-top: 1px solid var(--site-line-strong);
    }

    .focus-list article {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr);
        gap: 20px;
        padding: 30px 0;
        border-bottom: 1px solid var(--site-line);
    }

    .focus-list article > span {
        color: var(--site-signal);
        font-family: var(--font-display);
        font-size: 10px;
        letter-spacing: 0.08em;
    }

    .focus-list h3 {
        margin: 0;
        font-size: 21px;
        font-weight: 550;
        letter-spacing: -0.03em;
    }

    .focus-list p {
        max-width: 560px;
        margin: 10px 0 0;
        color: var(--site-muted);
        font-size: 15px;
        line-height: 1.7;
    }

    .stack-panel {
        display: grid;
        grid-template-columns: minmax(280px, 0.58fr) minmax(0, 1fr);
        gap: clamp(48px, 8vw, 120px);
        margin-top: clamp(92px, 12vw, 168px);
        padding: clamp(32px, 5vw, 68px);
        border: 1px solid var(--site-line);
        border-radius: var(--site-radius);
        background: rgba(8, 12, 14, 0.68);
        backdrop-filter: blur(18px) saturate(112%);
    }

    .stack-panel h3 {
        max-width: 420px;
        margin: 28px 0 0;
        font-size: clamp(34px, 4vw, 54px);
        font-weight: 520;
        line-height: 1.02;
        letter-spacing: -0.055em;
    }

    .stack-panel header > p:last-child {
        max-width: 430px;
        margin: 24px 0 0;
        color: var(--site-muted);
        font-size: 15px;
        line-height: 1.7;
    }

    .stack-groups {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 34px 48px;
    }

    .stack-groups section {
        padding-top: 14px;
        border-top: 1px solid var(--site-line-strong);
    }

    .stack-groups h4 {
        margin: 0;
        color: var(--site-text);
        font-family: var(--font-display);
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
    }

    .stack-groups ul {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 12px;
        margin: 18px 0 0;
        padding: 0;
        list-style: none;
    }

    .stack-groups li {
        color: var(--site-muted);
        font-size: 14px;
        line-height: 1.5;
    }

    .stack-groups li:not(:last-child)::after {
        margin-left: 12px;
        color: var(--site-line-strong);
        content: "/";
    }

    .contact-section {
        margin-top: clamp(132px, 17vw, 240px);
        padding: clamp(34px, 6vw, 82px);
        border-radius: var(--site-radius);
        background: var(--site-paper);
        color: var(--site-ink);
        scroll-margin-top: 106px;
    }

    .contact-section .section-kicker {
        color: rgba(6, 9, 11, 0.52);
    }

    .contact-layout {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.55fr);
        align-items: end;
        gap: clamp(44px, 9vw, 132px);
        margin-top: clamp(54px, 8vw, 104px);
    }

    .contact-layout h2 {
        max-width: 850px;
        font-size: clamp(46px, 6.8vw, 96px);
    }

    .contact-copy > p {
        margin: 0;
        color: rgba(6, 9, 11, 0.68);
        font-size: 16px;
        line-height: 1.7;
    }

    .contact-links {
        display: grid;
        gap: 8px;
        margin-top: 30px;
    }

    .contact-links a {
        display: flex;
        min-height: 54px;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 0 18px;
        border: 1px solid rgba(6, 9, 11, 0.22);
        border-radius: 999px;
        color: var(--site-ink);
        font-family: var(--font-display);
        font-size: 10px;
        font-weight: 650;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition:
            background 180ms var(--site-ease),
            color 180ms var(--site-ease),
            border-color 180ms var(--site-ease);
    }

    .contact-links .contact-link-primary {
        border-color: var(--site-ink);
        background: var(--site-ink);
        color: var(--site-paper);
    }

    .contact-links a:hover {
        border-color: var(--site-ink);
        background: var(--site-signal);
        color: var(--site-ink);
    }

    .contact-links a:focus-visible {
        outline-color: #174c38;
    }

    .portfolio-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        margin-top: clamp(72px, 9vw, 116px);
        padding: 26px 2px 4px;
        border-top: 1px solid var(--site-line);
        color: var(--site-dim);
        font-family: var(--font-display);
        font-size: 9px;
        letter-spacing: 0.09em;
        text-transform: uppercase;
    }

    .portfolio-footer > div,
    .portfolio-footer nav,
    .footer-status {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px 22px;
    }

    .footer-status {
        gap: 9px;
    }

    .footer-status .live-dot {
        width: 6px;
        height: 6px;
        box-shadow: none;
    }

    .portfolio-footer a {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        color: var(--site-muted);
        transition: color 160ms var(--site-ease);
    }

    .portfolio-footer a:hover {
        color: var(--site-signal);
    }

    :global([data-reveal][data-reveal-state="waiting"]) {
        opacity: 0;
        transform: translateY(24px);
    }

    :global([data-reveal][data-reveal-state="visible"]) {
        opacity: 1;
        transform: translateY(0);
        transition:
            opacity 480ms var(--site-ease) var(--reveal-delay, 0ms),
            transform 480ms var(--site-ease) var(--reveal-delay, 0ms);
    }

    @media (max-width: 1120px) {
        .section-intro {
            grid-template-columns: minmax(160px, 0.34fr) minmax(0, 1fr);
        }

        .section-intro > p {
            grid-column: 2;
            max-width: 620px;
        }

        .project-fennevia {
            grid-column: 1 / 7;
        }

        .project-dial {
            grid-column: 7 / -1;
        }

        .about-layout {
            grid-template-columns: minmax(280px, 0.68fr) minmax(380px, 1fr);
            gap: 64px;
        }

        .stack-panel {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 900px) {
        .topbar {
            grid-template-columns: 1fr auto;
            grid-template-areas:
                "brand locale"
                "nav nav";
            gap: 6px 12px;
            padding: 8px 10px;
            border-radius: 22px;
        }

        .wordmark {
            padding-left: 6px;
        }

        .topnav {
            justify-content: stretch;
            padding-top: 6px;
            border-top: 1px solid var(--site-line);
        }

        .topnav a {
            flex: 1;
        }

        .hero {
            min-height: auto;
        }

        .hero-bottom,
        .about-layout,
        .contact-layout {
            grid-template-columns: 1fr;
        }

        .hero-bottom {
            gap: 48px;
        }

        .now-note {
            max-width: 620px;
        }

        .project-fennevia,
        .project-dial {
            grid-column: 1 / -1;
        }

        .project-visual {
            min-height: 0;
        }

        .about-heading {
            grid-template-columns: 1fr;
            gap: 42px;
        }

        .about-layout {
            gap: 58px;
        }

        .contact-layout {
            align-items: start;
        }

        .contact-copy {
            max-width: 620px;
        }
    }

    @media (max-width: 640px) {
        :global(html) {
            scroll-padding-top: 128px;
        }

        .portfolio-site {
            padding-inline: 14px;
        }

        .wordmark-context {
            display: none;
        }

        .language-nav a {
            min-width: 43px;
            padding-inline: 7px;
        }

        .topnav a {
            padding-inline: 8px;
            font-size: 9px;
        }

        .hero {
            gap: 56px;
            padding: 70px 2px 82px;
        }

        .hero-meta {
            gap: 8px 0;
        }

        .hero-meta span {
            flex: 0 0 100%;
        }

        .hero-meta span + span::before {
            margin-right: 10px;
        }

        .hero-heading h1 {
            font-size: clamp(48px, 14.5vw, 76px);
            line-height: 0.98;
            letter-spacing: -0.065em;
        }

        .hero-intro > p {
            font-size: 18px;
        }

        .hero-actions {
            display: grid;
        }

        .cta {
            justify-content: center;
        }

        .now-note {
            padding-left: 18px;
        }

        .work-section,
        .about-section {
            padding-top: 86px;
        }

        .section-intro {
            grid-template-columns: 1fr;
            gap: 38px;
        }

        .section-intro > p {
            grid-column: auto;
        }

        .section-intro h2,
        .about-heading h2 {
            font-size: clamp(38px, 11.5vw, 58px);
        }

        .project-grid {
            display: block;
        }

        .project-card + .project-card {
            margin-top: 16px;
        }

        .project-card {
            border-radius: 22px;
        }

        .project-visual {
            min-height: 0;
        }

        .project-copy {
            min-height: 0;
            padding: 26px 22px 28px;
        }

        .project-kicker,
        .project-setlist .project-kicker {
            margin-top: 44px;
        }

        .project-copy h3 {
            font-size: 42px;
        }

        .project-description {
            font-size: 16px;
        }

        .project-links {
            display: grid;
            margin-top: 4px;
        }

        .project-link {
            width: 100%;
        }

        .about-section {
            margin-top: 116px;
        }

        .about-layout {
            margin-top: 58px;
        }

        .focus-list article {
            grid-template-columns: 36px minmax(0, 1fr);
        }

        .stack-panel {
            margin-top: 92px;
            padding: 28px 22px;
            border-radius: 22px;
        }

        .stack-groups {
            grid-template-columns: 1fr;
        }

        .contact-section {
            margin-top: 120px;
            padding: 32px 22px;
            border-radius: 22px;
        }

        .contact-layout {
            margin-top: 52px;
        }

        .contact-layout h2 {
            font-size: clamp(43px, 12.5vw, 64px);
        }

        .portfolio-footer {
            align-items: flex-start;
            flex-direction: column;
        }
    }

    @media (max-height: 620px) and (orientation: landscape) {
        .hero {
            min-height: auto;
            padding-block: 72px;
        }
    }

    @media (min-width: 700px) and (max-height: 620px) and (orientation: landscape) {
        .topbar {
            grid-template-areas: "brand nav locale";
            grid-template-columns: minmax(150px, 0.7fr) minmax(280px, 1fr) minmax(110px, 0.55fr);
            gap: 16px;
            min-height: 64px;
            padding: 8px 10px 8px 18px;
            border-radius: 999px;
        }

        .topnav {
            justify-content: center;
            padding-top: 0;
            border-top: 0;
        }

        .topnav a {
            flex: 0 0 auto;
        }

        .hero {
            gap: 44px;
            padding-block: 48px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .project-card:hover,
        .project-card:hover .project-visual img,
        .cta:hover {
            transform: none;
        }

        :global([data-reveal][data-reveal-state]) {
            opacity: 1;
            transform: none;
        }
    }

    @supports not (backdrop-filter: blur(1px)) {
        .topbar,
        .project-card,
        .stack-panel {
            background: #090d0f;
        }
    }
</style>
