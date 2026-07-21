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
        class?: string;
    }

    let { current, options, class: className = "" }: Props = $props();
</script>

<nav
    class={cn(
        "inline-flex items-center gap-3 font-display text-[clamp(11px,1vw,13px)] uppercase tracking-[0.18em]",
        className
    )}
    aria-label="Languages"
>
    {#each options as opt, i}
        {#if i > 0}
            <span class="text-meta-foreground" aria-hidden="true">·</span>
        {/if}
        <a
            class={cn(
                "no-underline transition-colors duration-150 ease-quick touch-manipulation motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus-ring",
                opt.locale === current
                    ? "text-foreground"
                    : "text-dim-foreground hover:text-foreground"
            )}
            href={opt.href}
            data-sveltekit-reload
            aria-current={opt.locale === current ? "true" : undefined}
        >
            {opt.label}
        </a>
    {/each}
</nav>