<script lang="ts">
    interface FooterLink {
        label: string;
        href: string;
        external?: boolean;
    }

    interface Props {
        copyright: string;
        status: string;
        links?: FooterLink[];
    }

    let { copyright, status, links = [] }: Props = $props();
</script>

<footer class="site-footer">
    <div class="site-footer-group">
        <span>{copyright}</span>
        <span aria-hidden="true">·</span>
        <span class="inline-flex items-center gap-2">
            <span class="status-dot" aria-hidden="true"></span>
            {status}
        </span>
    </div>

    {#if links.length > 0}
        <nav class="site-footer-group" aria-label="Footer">
            {#each links as link}
                <a
                    class="text-link"
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                >
                    {link.label}
                    <span aria-hidden="true">↗</span>
                </a>
            {/each}
        </nav>
    {/if}
</footer>
