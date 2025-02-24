<script>
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { PUBLIC_EMAIL } from "$env/static/public";
    import { addedSubjects } from "$lib/shared.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        if (addedSubjects.subjects.length === 0) {
            goto(base + "/", {replaceState: true})
        }
    });
</script>
<style>
    .centerer {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
</style>

<div class="container">
    <div class="centerer">
        <article>
            <strong>Materia añadida a la lista</strong>
            <footer>
                <p>¿Le gustaría contribuir compartiendo los cambios para todos? ☭</p>
                <button type="submit" onclick={() => {
                    window.open("mailto:" + PUBLIC_EMAIL + "?subject=Aporte materias planificador&body=" + JSON.stringify(addedSubjects.subjects), "_blank");
                    goto(base + "/");
                }}>Si</button>
                <button type="submit" onclick={() => goto(base + "/")}>No</button>
            </footer>
        </article>
    </div>
</div>