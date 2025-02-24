<script lang="ts">
    import { base } from "$app/paths";
    import { HourByCommission } from "$lib/entities/hourByCommission.entity";
    import { Subject } from "$lib/entities/subject.entity";
    import { addedSubjects } from "$lib/shared.svelte";
    import jsonData from "$lib/subjects.json";
    import { onMount } from "svelte";

    const timeFrames: string[] = [
        "7:15 a 8:00", "8:00 a 8:45", "8:45 a 9:30", "9:45 a 10:30", "10:30 a 11:15",
        "11:20 a 12:05", "12:05 a 12:50", "12:50 a 13:35", "13:35 a 14:10", "14:15 a 15:00",
        "15:00 a 15:45", "16:05 a 16:50", "16:50 a 17:35", "17:40 a 18:25", "18:35 a 19:15",
        "19:15 a 20:00", "20:00 a 20:45", "21:05 a 21:50", "21:50 a 22:35", "22:40 a 23:25",
        "23:25 a 0:10"
    ];

    let subjects: Subject[] = $state<Subject[]>([]);

    onMount(() => {
        subjects = jsonData.map((subject: any) => {
            return new Subject(
                subject.carreer,
                subject.elective,
                subject.name,
                subject.level,
                subject.period,
                subject.hourByCommissions.map((hourByCommission: any) => new HourByCommission(hourByCommission.commission, hourByCommission.hours))
            );
        });
        subjects = [...subjects, ...addedSubjects.subjects];
        console.log(JSON.stringify(subjects));
    });

    let selectedSubjects: {subject: number, commission: number}[] = $state([]);

    let temporalSelectedSubject: number | null = $state(null);
    let temporalCheckedIndex: string | null = $state(null);

    function selectSubject(index: number) {
        temporalSelectedSubject = index;
        const foundSelection = selectedSubjects.find((subject) => subject.subject === temporalSelectedSubject);
        if (foundSelection) {
            temporalCheckedIndex = foundSelection.commission.toString();
        } else {
            temporalCheckedIndex = "null";
        }
    }

    function getAlias(carreer: string) {
        if (carreer === "ISI") {
            return "K";
        } else {
            return "°";
        }
    }

    function addSubject(subjectIndex: number | null, commissionIndex: number | null) {
        if (subjectIndex === null) {
            return;
        }
        if (commissionIndex === null) {
            selectedSubjects = selectedSubjects.filter((selectedSubject) => selectedSubject.subject !== subjectIndex);
        } else {
            selectedSubjects = selectedSubjects.filter((selectedSubject) => selectedSubject.subject !== subjectIndex);
            selectedSubjects.push({subject: subjectIndex, commission: commissionIndex});
        }
    }

    function handleSubmit(event: any) {
        event.preventDefault();
        const formData = new FormData(event.target);
        addSubject(Number(formData.get("subject")), formData.get("commission") !== "null" ? Number(formData.get("commission")) : null);
        temporalSelectedSubject = null;
        temporalCheckedIndex = null;
    }

    function findSlotSubjects(index: number) {
        const foundSubjects = selectedSubjects.filter((subject) => {
            const foundSubject = subjects[subject.subject];
            const foundCommission = foundSubject.hourByCommissions.find((commission) => commission.commission === subject.commission);
            return foundCommission && foundCommission.hours.includes(index)
        });
        return foundSubjects;
    }
</script>

<style>
    .subject-button {
        width: 100%;
        background-color: transparent;
        margin: 0;
        text-align: start;
        border-radius: 0;
        border: none;
        color: inherit;
    }

    .subject-button:not(:last-child) {
        border-bottom: var(--pico-border-width) solid var(--pico-table-border-color);
    }

    .cell {
        padding: 5px;
    }

    .cell p {
        padding: 5px;
        margin: 0;
        color: white;
    }

    .cell p:not(:only-child):not(:last-child) {
        border-bottom: var(--pico-border-width) solid #FFFFFF3F;
    }

    .list-group {
        overflow-y: scroll;
        max-height: 30rem;
    }

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
    <h1>Planificador de horarios UTN Frro</h1>

    {#if temporalSelectedSubject === null}
        <article>
            <strong>Seleccione la materia que desea cursar</strong>
            <footer>
                <div class="list-group">
                    {#each subjects as subject, index}
                        <button type="button" class="subject-button" onclick={() => {selectSubject(index)}}>{subject.name}</button>
                    {/each}
                </div>
            </footer>
        </article>
        <p>¿No encuantra la materia en la lista? <a href={base + "/add-subject"}>Cargue la materia manualmente</a></p>
        {#if selectedSubjects.length !== 0}
            <article>
                <strong>Resumen</strong>
                <footer>
                    <div class="summary-group">
                        {#each selectedSubjects as selectedSubject}
                            <div class="summary-selection">
                                <p>{subjects[selectedSubject.subject].name + " " + subjects[selectedSubject.subject].level.toString() + (subjects[selectedSubject.subject].elective === true ? "E" : "") + getAlias(subjects[selectedSubject.subject].carreer) + selectedSubject.commission.toString()}</p>
                                <button type="button" onclick={() => {addSubject(selectedSubject.subject, null)}} aria-label="Eliminar">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                                </button>
                            </div>
                        {/each}
                    </div>
                </footer>
            </article>
        {/if}
    {:else}
        <article>
            <strong>Seleccione la comision que desea cursar de {subjects[temporalSelectedSubject].name}</strong>
            <footer>
                <form onsubmit={handleSubmit}>
                    <input type="hidden" name="subject" value={temporalSelectedSubject}>
                    <fieldset>
                        <legend>Comisión</legend>
                        {#each subjects[temporalSelectedSubject].hourByCommissions as commission}
                            <label for={commission.commission.toString()}>
                                <input type="radio" id={commission.commission.toString()} name="commission" value={commission.commission.toString()} bind:group={temporalCheckedIndex}/>
                                {subjects[temporalSelectedSubject].level.toString() + (subjects[temporalSelectedSubject].elective === true ? "E" : "") + getAlias(subjects[temporalSelectedSubject].carreer) + commission.commission.toString()}
                            </label>
                        {/each}
                        <label for="none">
                            <input type="radio" id="none" name="commission" value="null" bind:group={temporalCheckedIndex}/>
                            Ninguno
                        </label>
                    </fieldset>

                    <button type="submit">Aceptar</button>
                </form>
            </footer>
        </article>
    {/if}

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
</div>

{#snippet cells(timesRepeated = 0)}
    {#each timeFrames as timeFrame, index}
    <tr>
        <td>{timeFrame}</td>
        {#each Array(6).fill(0) as _, i}
            {#if findSlotSubjects((timeFrames.length * 6 * timesRepeated + index * 6) + i + 1).length !== 0}
                <td style:background-color={findSlotSubjects((timeFrames.length * 6 * timesRepeated + index * 6) + i + 1).length === 1 ? "var(--pico-color-green-500)" : "var(--pico-color-red-500)"} class="cell">
                    {#each findSlotSubjects((timeFrames.length * 6 * timesRepeated + index * 6) + i + 1) as foundMatch}
                        <p>{subjects[foundMatch?.subject ?? 0].name}</p>
                    {/each}
                </td>
            {:else}
                <td class="cell"><p>-</p></td>
            {/if}
        {/each}
    </tr>
    {/each}
{/snippet}