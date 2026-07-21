<script lang="ts">
    import { AuroraVeil, LocaleSwitcher } from "@homelab/shared";
    import * as m from "$lib/paraglide/messages.js";
    import { locales, localizeHref, getLocale } from "$lib/paraglide/runtime";
    import { base } from "$app/paths";
    import { page } from "$app/state";

    const links = $derived([
        {
            title: m.entry_link_profile_title(),
            description: m.entry_link_profile_desc(),
            href: localizeHref("https://profile.yutinglia.com"),
            external: false,
        },
        {
            title: m.entry_link_github_title(),
            description: m.entry_link_github_desc(),
            href: "https://github.com/yutinglia",
            external: true,
        },
        {
            title: m.entry_link_email_title(),
            description: m.entry_link_email_desc(),
            href: "mailto:yutinglia@gmail.com",
            external: false,
        },
    ]);

    const localeOptions = $derived(
        locales.map((locale) => ({
            locale,
            href: `${base}${localizeHref(page.url.pathname, { locale })}`,
            label: locale === "en" ? m.lang_en() : m.lang_zh_hant(),
        }))
    );

    let year = $state(new Date().getFullYear());

    $effect(() => {
        year = new Date().getFullYear();
    });
</script>

<svelte:head>
    <title>{m.entry_meta_title()}</title>
    <meta name="description" content={m.entry_meta_description()} />
    <meta name="theme-color" content="#1f2228" />
</svelte:head>

<AuroraVeil />

<a class="av-skip" href="#main">{m.skip_to_content()}</a>

<div class="av-overlay av-overlay-between av-overlay-center">
    <header class="flex items-center justify-between font-display text-[clamp(11px,1vw,13px)] uppercase tracking-[0.22em] text-dim-foreground">
        <a
            class="inline-flex min-h-7 min-w-7 items-center justify-center px-2.5 py-1.5 font-display text-sm font-normal uppercase tracking-[0.14em] text-foreground no-underline transition-colors duration-150 ease-quick touch-manipulation hover:text-dim-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring motion-reduce:transition-none"
            href="/"
            aria-label={m.home_aria()}
        >T</a>
        <LocaleSwitcher current={getLocale()} options={localeOptions} />
    </header>

    <main id="main">
        <section class="mt-[8vh] max-sm:mt-[6vh]">
            <p class="mb-3.5 font-display text-xs uppercase tracking-[0.24em] text-dim-foreground">{m.entry_label()}</p>
            <h1 class="m-0 font-display text-[clamp(64px,11vw,156px)] font-light leading-[0.92] tracking-[-0.03em] text-balance">{m.entry_name()}</h1>
            <p class="mt-4 max-w-[52ch] font-sans text-[clamp(15px,1.4vw,18px)] leading-normal text-muted-foreground">
                {m.entry_tagline()}
            </p>
        </section>

        <nav class="my-12 border-y border-border max-sm:my-9" aria-label="Links">
            {#each links as link}
                <a
                    class="flex min-h-11 items-center justify-between gap-6 border-t border-border px-2 py-[18px] text-foreground no-underline transition-[background,color,box-shadow] duration-150 ease-quick touch-manipulation hover:bg-surface-2 hover:text-dim-foreground active:bg-white/10 active:text-meta-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring first:border-t-0 max-sm:gap-4 max-sm:px-1 max-sm:py-4 motion-reduce:transition-none"
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                >
                    <div class="min-w-0 flex-1">
                        <div class="font-sans text-base font-normal text-inherit">{link.title}</div>
                        <div class="mt-0.5 min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-sm text-muted-foreground max-sm:whitespace-normal">{link.description}</div>
                    </div>
                    <span class="shrink-0 font-display text-[13px] tracking-[0.1em] text-dim-foreground" aria-hidden="true">→</span>
                </a>
            {/each}
        </nav>
    </main>

    <footer class="flex flex-wrap items-end justify-between gap-6">
        <p class="m-0 font-display text-xs uppercase tracking-[0.14em] text-meta-foreground">{m.copyright_year({ year })}</p>
    </footer>
</div>