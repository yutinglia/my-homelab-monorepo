import { type VariantProps, tv } from 'tailwind-variants';
import Root from './button.svelte';

export const buttonVariants = tv({
    base: 'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-sans text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50',
    variants: {
        variant: {
            default: 'bg-primary text-white hover:bg-primary-hover border border-transparent',
            outline:
                'border border-border bg-transparent text-foreground hover:bg-surface-2 hover:border-border-strong',
            ghost: 'text-foreground hover:bg-surface-2',
            link: 'text-primary underline-offset-4 hover:underline p-0 h-auto'
        },
        size: {
            default: 'h-9 px-4 py-2',
            sm: 'h-8 px-3 text-xs',
            lg: 'h-11 px-8 text-base',
            icon: 'h-9 w-9'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});

export type Variant = VariantProps<typeof buttonVariants>['variant'];
export type Size = VariantProps<typeof buttonVariants>['size'];
export { Root, Root as Button };