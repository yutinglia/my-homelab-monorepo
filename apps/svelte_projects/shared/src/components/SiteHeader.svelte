<script lang="ts">
    import LocaleSwitcher from "./LocaleSwitcher.svelte";

    interface NavItem {
        label: string;
        href: string;
        current?: boolean;
        external?: boolean;
    }

    interface LocaleOption {
        locale: string;
        href: string;
        label: string;
    }

    interface Props {
        brandHref: string;
        brandName?: string;
        brandSubtitle?: string;
        navItems: NavItem[];
        currentLocale: string;
        localeOptions: LocaleOption[];
        localeAriaLabel?: string;
    }

    let {
        brandHref,
        brandName = "Ting",
        brandSubtitle = "Homelab",
        navItems,
        currentLocale,
        localeOptions,
        localeAriaLabel = "Languages",
    }: Props = $props();
</script>

<header class="site-header">
    <a class="site-brand" href={brandHref} aria-label={`${brandName} ${brandSubtitle}`}>
        <span class="site-brand-mark" aria-hidden="true">T/</span>
        <span class="site-brand-copy">
            <span class="site-brand-name">{brandName}</span>
            <span class="site-brand-subtitle">{brandSubtitle}</span>
        </span>
    </a>

    <nav class="site-nav" aria-label="Primary">
        {#each navItems as item}
            <a
                class="site-nav-link"
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-current={item.current ? "page" : undefined}
            >
                {item.label}
            </a>
        {/each}
    </nav>

    <LocaleSwitcher
        current={currentLocale}
        options={localeOptions}
        ariaLabel={localeAriaLabel}
    />
</header>
