<script lang="ts">
    import { cn } from "../lib/utils.js";

    interface Props {
        label: string;
        flanked?: boolean;
        class?: string;
    }

    let { label, flanked = true, class: className = "" }: Props = $props();
</script>

<div
    class={cn(
        "flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-dim-foreground",
        !flanked && "justify-start",
        className
    )}
>
    {#if flanked}
        <span class="h-px flex-1 bg-border"></span>
    {/if}
    <span>{label}</span>
    {#if flanked}
        <span class="h-px flex-1 bg-border"></span>
    {/if}
</div>