<script lang="ts">
    import { AuroraVeil, LocaleSwitcher } from "@homelab/shared";
    import * as m from "$lib/paraglide/messages.js";
    import { locales, localizeHref, getLocale } from "$lib/paraglide/runtime";
    import { base } from "$app/paths";
    import { page } from "$app/state";

    const stackGroups = $derived([
        {
            group: m.profile_stack_group_infra(),
            items: [
                "Linux",
                "Docker",
                "Podman",
                "Proxmox VE",
                "OPNsense",
                "Networking",
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
            items: ["NestJS", "Axum", "Fastify"],
        },
        {
            group: m.profile_stack_group_frontend(),
            items: ["React", "Svelte", "Vue", "Next.js", "TanStack", "HTML/CSS", "Tailwind CSS"],
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
            ],
        },
        {
            group: m.profile_stack_group_editors(),
            items: ["VSCode", "JetBrains"],
        },
        {
            group: m.profile_stack_group_practice(),
            items: ["Self-Hosted", "Infrastructure-as-Code"],
        },
    ]);

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

    const localeOptions = $derived(
        locales.map((locale) => ({
            locale,
            href: `${base}${localizeHref(page.url.pathname, { locale })}`,
            label: locale === "en" ? m.lang_en() : m.lang_zh_hant(),
        })),
    );

    let year = $state(new Date().getFullYear());

    $effect(() => {
        year = new Date().getFullYear();
    });
</script>

<svelte:head>
    <title>{m.profile_meta_title()}</title>
    <meta name="description" content={m.profile_meta_description()} />
    <meta name="theme-color" content="#1f2228" />
</svelte:head>

<AuroraVeil veilVariant="soft" />

<a class="av-skip" href="#main">{m.skip_to_content()}</a>

<div class="av-overlay av-overlay-between av-overlay-center">
    <header
        class="flex items-center justify-between font-display text-[clamp(11px,1vw,13px)] uppercase tracking-[0.22em] text-dim-foreground"
    >
        <a
            class="inline-flex min-h-7 items-center gap-2 px-2.5 py-1.5 font-display text-[11px] uppercase tracking-[0.22em] text-dim-foreground no-underline transition-colors duration-150 ease-quick touch-manipulation hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring motion-reduce:transition-none"
            href={localizeHref("https://www.yutinglia.com")}
        >
            <span class="text-[13px]" aria-hidden="true">↗</span>
            {m.entry_link()}
        </a>
        <LocaleSwitcher current={getLocale()} options={localeOptions} />
    </header>

    <main id="main">
        <section class="mt-[8vh] max-sm:mt-[6vh]">
            <p
                class="mb-3.5 font-display text-xs uppercase tracking-[0.24em] text-dim-foreground"
            >
                {m.profile_label()}
            </p>
            <h1
                class="m-0 font-display text-[clamp(64px,11vw,156px)] font-light leading-[0.92] tracking-[-0.03em] text-balance"
            >
                {m.profile_name()}
            </h1>
            <p
                class="mt-4 font-sans text-[clamp(18px,1.8vw,26px)] leading-tight text-muted-foreground"
            >
                {m.profile_role()}
            </p>
            <p
                class="mt-3.5 font-display text-xs uppercase tracking-[0.14em] text-dim-foreground"
            >
                {m.profile_location()}
            </p>
        </section>

        <section class="mt-16 max-sm:mt-12">
            <h2 class="mb-5 font-sans text-lg font-normal text-foreground">
                {m.profile_currently_heading()}
            </h2>
            <p
                class="m-0 font-display text-[clamp(14px,1.3vw,17px)] leading-normal tracking-[0.02em] text-muted-foreground"
            >
                {m.profile_currently_body()}
            </p>
        </section>

        <section class="av-about mt-16 max-sm:mt-12">
            <h2 class="mb-5 font-sans text-lg font-normal text-foreground">
                {m.profile_about_heading()}
            </h2>
            <p
                class="mb-4 max-w-[62ch] font-sans text-[17px] leading-relaxed text-muted-foreground last:mb-0"
            >
                {m.profile_about_p1()}
            </p>
            <p
                class="mb-4 max-w-[62ch] font-sans text-[17px] leading-relaxed text-muted-foreground last:mb-0"
            >
                {m.profile_about_p2()}
            </p>
            <p
                class="mb-4 max-w-[62ch] font-sans text-[17px] leading-relaxed text-muted-foreground last:mb-0"
            >
                {m.profile_about_p3()}
            </p>
        </section>

        <section class="mt-16 max-sm:mt-12">
            <h2 class="mb-5 font-sans text-lg font-normal text-foreground">
                {m.profile_stack_heading()}
            </h2>
            <div class="flex flex-col gap-4">
                {#each stackGroups as group}
                    <div class="flex flex-wrap items-center gap-2">
                        <span
                            class="mr-1.5 min-w-[110px] font-display text-[11px] uppercase tracking-[0.2em] text-dim-foreground max-sm:min-w-0 max-sm:mr-0 max-sm:basis-full"
                            >{group.group}</span
                        >
                        {#each group.items as item}
                            <span
                                class="border border-border-strong px-2.5 py-[5px] font-display text-[11px] tracking-[0.12em] text-foreground transition-[border-color,color] duration-200 ease-quick touch-manipulation hover:border-border-strong hover:text-dim-foreground motion-reduce:transition-none"
                                >{item}</span
                            >
                        {/each}
                    </div>
                {/each}
            </div>
        </section>

        <section class="mt-16 max-sm:mt-12">
            <h2 class="mb-5 font-sans text-lg font-normal text-foreground">
                {m.profile_elsewhere_heading()}
            </h2>
            <nav class="border-y border-border" aria-label="Elsewhere">
                {#each elsewhere as link}
                    <a
                        class="flex min-h-11 items-center justify-between gap-6 border-t border-border px-2 py-[18px] text-foreground no-underline transition-[background,color,box-shadow] duration-150 ease-quick touch-manipulation hover:bg-surface-2 hover:text-dim-foreground active:bg-white/10 active:text-meta-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring first:border-t-0 max-sm:gap-4 max-sm:px-1 max-sm:py-4 motion-reduce:transition-none"
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                    >
                        <span class="flex min-w-0 flex-1 items-baseline gap-3.5">
                            <span class="font-sans text-base text-inherit"
                                >{link.label}</span
                            >
                            <span
                                class="font-sans text-sm text-muted-foreground"
                                >{link.handle}</span
                            >
                        </span>
                        <span
                            class="shrink-0 font-display text-[13px] tracking-[0.1em] text-dim-foreground"
                            aria-hidden="true">→</span
                        >
                    </a>
                {/each}
            </nav>
        </section>
    </main>

    <footer class="flex flex-wrap items-end justify-between gap-6">
        <p
            class="m-0 font-display text-xs uppercase tracking-[0.14em] text-meta-foreground"
            >{m.copyright_year({ year })}</p
        >
    </footer>
</div>
