<script lang="ts">
    import type { LayoutProps } from "./$types";
    import "@picocss/pico/css/pico.min.css";
    import "@picocss/pico/css/pico.colors.min.css";

    let { children }: LayoutProps = $props();
</script>
{@render children()}