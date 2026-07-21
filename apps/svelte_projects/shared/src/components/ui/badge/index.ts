import { type VariantProps, tv } from 'tailwind-variants';
import Root from './badge.svelte';

export const badgeVariants = tv({
    base: 'inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-xs font-normal transition-colors',
    variants: {
        variant: {
            default: 'border-border bg-surface text-muted-foreground',
            primary: 'border-primary/25 bg-primary/10 text-primary',
            outline: 'border-border bg-transparent text-foreground'
        }
    },
    defaultVariants: { variant: 'default' }
});

export type Variant = VariantProps<typeof badgeVariants>['variant'];
export { Root, Root as Badge };