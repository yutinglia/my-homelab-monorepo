<script lang="ts">
    import { cn } from "../lib/utils.js";

    interface LocaleOption {
        locale: string;
        href: string;
        label: string;
    }

    interface Props {
        current: string;
        options: LocaleOption[];
        ariaLabel?: string;
        class?: string;
    }

    let {
        current,
        options,
        ariaLabel = "Languages",
        class: className = "",
    }: Props = $props();
</script>

<nav
    class={cn(
        "locale-switcher",
        className
    )}
    aria-label={ariaLabel}
>
    {#each options as opt}
        <a
            class={cn(
                "locale-switcher-link",
            )}
            href={opt.href}
            data-sveltekit-reload
            aria-current={opt.locale === current ? "true" : undefined}
        >
            {opt.label}
        </a>
    {/each}
</nav>
