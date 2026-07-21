<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { buttonVariants, type Variant, type Size } from './index.js';
  import { cn } from '../../../lib/utils.js';

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    class?: string;
  }

  let { variant = 'default', size = 'default', class: className = '', children, ...restProps }: Props = $props();
</script>

<button class={cn(buttonVariants({ variant, size }), className)} {...restProps}>
  {@render children?.()}
</button>