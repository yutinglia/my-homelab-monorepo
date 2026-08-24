<script lang="ts">
    interface Props {
        size?: number;
        strokeWidth?: number;
    }

    let { size = 16, strokeWidth = 1.8 }: Props = $props();
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
>
    <path
        d="M7 17 17 7M8 7h9v9"
        stroke="currentColor"
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
