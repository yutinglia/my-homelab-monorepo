<script lang="ts">
    interface Props {
        size?: number;
        strokeWidth?: number;
    }

    let { size = 16, strokeWidth = 1.6 }: Props = $props();
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
>
    <path
        d="M4.25 11.75 11.75 4.25M5.25 4.25h6.5v6.5"
        stroke="currentColor"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
