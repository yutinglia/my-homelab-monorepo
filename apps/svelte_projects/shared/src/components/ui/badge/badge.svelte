<script lang="ts">
  import { badgeVariants, type Variant } from './index.js';
  import { cn } from '../../../lib/utils.js';

  interface Props {
    variant?: Variant;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let { variant = 'default', class: className = '', children }: Props = $props();
</script>

<span class={cn(badgeVariants({ variant }), className)}>
  {@render children?.()}
</span>