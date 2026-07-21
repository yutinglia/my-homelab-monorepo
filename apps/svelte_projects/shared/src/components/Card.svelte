<script lang="ts">
    import type { Snippet } from "svelte";
    import { cn } from "../lib/utils.js";

    interface Props {
        class?: string;
        children: Snippet;
    }

    let { class: className = "", children }: Props = $props();
</script>

<div
    class={cn(
        "rounded-lg border border-border bg-surface p-6 transition-colors hover:border-border-strong",
        className
    )}
>
    {@render children()}
</div>