<script lang="ts">
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import type { HourByCommission } from '$lib/entities/hourByCommission.entity';
    import { Subject } from '$lib/entities/subject.entity';
    import { addedSubjects } from '$lib/shared.svelte';

    const timeFrames: string[] = [
        "7:15 a 8:00", "8:00 a 8:45", "8:45 a 9:30", "9:45 a 10:30", "10:30 a 11:15",
        "11:20 a 12:05", "12:05 a 12:50", "12:50 a 13:35", "13:35 a 14:10", "14:15 a 15:00",
        "15:00 a 15:45", "16:05 a 16:50", "16:50 a 17:35", "17:40 a 18:25", "18:35 a 19:15",
        "19:15 a 20:00", "20:00 a 20:45", "21:05 a 21:50", "21:50 a 22:35", "22:40 a 23:25",
        "23:25 a 0:10"
    ];

    let selectedHours = $state([]);
    let commission = $state(1);

    let hourByCommissions: HourByCommission[] = $state<HourByCommission[]>([]);

    function handleSubmit(event: any) {
        event.preventDefault();
        const formData = new FormData(event.target);
        let subject: Subject = new Subject(
            formData.get("carreer")?.toString() || "",
            formData.get("elective")?.toString() === "true",
            formData.get("name")?.toString() || "",
            Number(formData.get("year")?.toString() || "0"),
            formData.get("period")?.toString() || "ANUAL",
            hourByCommissions
        );
        console.log(subject);
        addedSubjects.subjects = [...addedSubjects.subjects, subject];
        goto(base + "/add-subject/contribute-dialog");
    }
</script>

<style>
    .summary-selection {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: var(--pico-form-element-spacing-vertical) var(--pico-form-element-spacing-horizontal);
    }

    .summary-selection:not(:last-child) {
        border-bottom: var(--pico-border-width) solid var(--pico-table-border-color);
    }

    .summary-selection p {
        margin: 0;
    }

    .summary-selection button {
        border: none;
        padding: 5px;
        margin: 0;
        background-color: var(--pico-color-red-500);
        display: flex;
        align-items: center;
    }
</style>

<div class="container">

    <h1>Datos de la materia</h1>
    
    <article>
        <strong>Ingrese los datos de la materia</strong>
        <footer>
            <form onsubmit={handleSubmit}>
                <label for="name">
                    Nombre
                    <input type="text" id="name" name="name" required>
                </label>
                <label for="carreer">
                    Carrera
                    <input type="text" id="carreer" name="carreer" required>
                </label>
                <label for="elective">
                    <input type="checkbox" id="elective" name="elective" value="true">
                    Electiva
                </label>
                <label for="year">
                    Año
                    <input type="number" id="year" name="year" min="0" max="5" required>
                </label>
                <fieldset>
                    <legend>Período</legend>
                    <label for="period">
                        <input type="radio" id="period" name="period" value="ANUAL" required>
                        Anual
                    </label>
                    <label for="period">
                        <input type="radio" id="period" name="period" value="CUATR" required>
                        Cuatrimestral
                    </label>
                </fieldset>
                <div data-tooltip={hourByCommissions.length === 0 ? "Sin comisiones" : null} style:border="none">
                    <button type="submit" disabled={hourByCommissions.length === 0}>Guardar materia y comisiones</button>
                </div>
            </form>
        </footer>
    </article>

    <h1>Horarios por comisión</h1>

    {#if hourByCommissions.length !== 0}
    <article>
        <strong>Comisiones añadidas</strong>
        <footer>
            <div class="summary-group">
                {#each hourByCommissions as hourByCommission}
                    <div class="summary-selection">
                        <p>{hourByCommission.commission}</p>
                        <button type="button" onclick={() => { hourByCommissions = hourByCommissions.filter(h => h !== hourByCommission); }} aria-label="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </button>
                    </div>
                {/each}
            </div>
        </footer>
    </article>
    {/if}

    <label for="commission">
        Comisión
        <input type="number" id="commission" name="commission" min="1" bind:value={commission}>
    </label>

    <h2>Primer cuatrimestre</h2>

    <div class="overflow-auto">
        <table>
            <thead>
                <tr>
                    <th>Horario</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                </tr>
            </thead>
            <tbody>
                {@render cells()}
            </tbody>
        </table>
    </div>

    <h2>Segundo cuatrimestre</h2>

    <div class="overflow-auto">
        <table>
            <thead>
                <tr>
                    <th>Horario</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miércoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sábado</th>
                </tr>
            </thead>
            <tbody>
                {@render cells(1)}
            </tbody>
        </table>
    </div>

    <button type="submit" onclick={() => {
        if (hourByCommissions.some(h => h.commission === commission)) {
            alert("Ya existe una comisión con ese número. Para realizar cambios, elimine la comisión y vuelva a agregarla.");
            return;
        }
        hourByCommissions = [...hourByCommissions, {
            commission: commission,
            hours: selectedHours
        }];
        selectedHours = [];
        commission++;
    }}
    disabled={selectedHours.length === 0}>Guardar comisión</button>

</div>

{#snippet cells(timesRepeated = 0)}
    {#each timeFrames as timeFrame, index}
    <tr>
        <td>{timeFrame}</td>
        {#each Array(6).fill(0) as _, i}
            <td>
                <!--<p>{(timeFrames.length * 6 * timesRepeated + index * 6) + i + 1}</p>-->
                <input type="checkbox" value={(timeFrames.length * 6 * timesRepeated + index * 6) + i + 1} bind:group={selectedHours}>
            </td>
        {/each}
    </tr>
    {/each}
{/snippet}