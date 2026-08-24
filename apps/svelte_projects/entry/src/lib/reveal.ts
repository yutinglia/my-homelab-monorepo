export function setupRevealMotion(): () => void {
    const elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        for (const element of elements) {
            element.dataset.revealState = "visible";
        }
        return () => undefined;
    }

    for (const element of elements) {
        element.dataset.revealState = "waiting";
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                (entry.target as HTMLElement).dataset.revealState = "visible";
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: "0px 0px -9%", threshold: 0.08 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
}
