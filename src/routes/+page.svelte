<script lang="ts">
    import { HourByCommission } from "$lib/entities/hourByCommission.entity";
    import { Subject } from "$lib/entities/subject.entity";
    import jsonData from "$lib/subjects.json";

    const timeFrames: string[] = [
        "7:15 a 8:00", "8:00 a 8:45", "8:45 a 9:30", "9:45 a 10:30", "10:30 a 11:15",
        "11:20 a 12:05", "12:05 a 12:50", "12:50 a 13:35", "13:35 a 14:10", "14:15 a 15:00",
        "15:00 a 15:45", "16:05 a 16:50", "16:50 a 17:35", "17:40 a 18:25", "18:35 a 19:15",
        "19:15 a 20:00", "20:00 a 20:45", "21:05 a 21:50", "21:50 a 22:35", "22:40 a 23:25",
        "23:25 a 0:10"
    ];

    const subjects: Subject[] = jsonData.map((subject: any) => {
        return new Subject(
            subject.carreer,
            subject.elective,
            subject.name,
            subject.level,
            subject.period,
            subject.hourByCommissions.map((hourByCommission: any) => new HourByCommission(hourByCommission.commission, hourByCommission.hours))
        );
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

    $effect(() => {
            //$inspect(temporalSelectedSubject);
            $inspect(temporalCheckedIndex);
            $inspect(selectedSubjects);
        }
    );


    function findSlotSubjects(index: number) {
        const foundSubjects = selectedSubjects.filter((subject) => {
            const foundSubject = subjects[subject.subject];
            const foundCommission = foundSubject.hourByCommissions[subject.commission];
            return foundCommission.hours.includes(index)
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

    .icon-button {
        display: flex;
        padding: 0;
        padding-right: 10px;
        margin: 0;
        align-items: center;
        align-content: center;
        background-color: transparent;
        border: none;
        border-radius: 0;
        border-right: var(--pico-border-width) solid var(--pico-table-border-color);
        color: inherit;
        gap: 5px;
    }

    .sbs {
        display: flex;
        flex-direction: row;
    }

    .radio-option {
        padding: 0.5rem;
    }
</style>

<div class="container">
    <h1>Planificador de horarios UTN Frro</h1>

    {#if temporalSelectedSubject === null}
        <article>
            <strong>Seleccione las materias que desea cursar</strong>
            <footer>
                {#each subjects as subject, index}
                    <button type="button" class="subject-button" onclick={() => {selectSubject(index)}}>{subject.name}</button>
                {/each}
            </footer>
        </article>
    {:else}
        <article>
            <div class="sbs" style:gap="10px">
                <button class="icon-button" onclick={() => {temporalSelectedSubject = null; temporalCheckedIndex = null}} aria-label="Volver a lista de materias">
                    <svg xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5 12l14 0" />
                        <path d="M5 12l6 6" />
                        <path d="M5 12l6 -6" />
                    </svg>
                    Volver
                </button>
                <strong>Seleccione la comision que desea cursar de {subjects[temporalSelectedSubject].name}</strong>
            </div>
            <footer>
                <form onsubmit={handleSubmit}>
                    <input type="hidden" name="subject" value={temporalSelectedSubject}>
                    {#each subjects[temporalSelectedSubject].hourByCommissions as commission, index}
                        <div class="radio-option">
                            <input type="radio" id={index.toString()} name="commission" value={index.toString()} bind:group={temporalCheckedIndex}/>
                            <label for={index.toString()}>{subjects[temporalSelectedSubject].level.toString() + (subjects[temporalSelectedSubject].elective === true ? "E" : "") + getAlias(subjects[temporalSelectedSubject].carreer) + commission.commission.toString()}</label>
                        </div>    
                    {/each}
                    <div class="radio-option">
                        <input type="radio" id="none" name="commission" value="null" bind:group={temporalCheckedIndex}/>
                        <label for="none">Ninguno</label>
                    </div>
                    <hr>
                    <button type="submit">Aceptar</button>
                </form>
            </footer>
        </article>
    {/if}

    <h2>Primer cuatrimestre</h2>
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
            {#each timeFrames as timeFrame, index}
                <tr>
                    <td>{timeFrame}</td>
                    {#each Array(6).fill(0) as _, i}
                        <!-- <td style:background-color={(index * 6) + i + 1 === selected ? "red" : ""}>{(index * 6) + i + 1}</td> -->
                        {#if findSlotSubjects((index * 6) + i + 1).length !== 0}
                            <td style:background-color={findSlotSubjects((index * 6) + i + 1).length === 1 ? "green" : "red"}>
                                {#each findSlotSubjects((index * 6) + i + 1) as foundMatch}
                                    <p>{subjects[foundMatch?.subject ?? 0].name}</p>
                                {/each}
                            </td>
                        {:else}
                            <td><p>-</p></td>
                        {/if}
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>

    <h2>Segundo cuatrimestre</h2>
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
            {#each timeFrames as timeFrame, index}
                <tr>
                    <td>{timeFrame}</td>
                    {#each Array(6).fill(0) as _, i}
                        <!-- <td style:background-color={(timeFrames.length * 6 + index * 6) + i + 1 === selected ? "red" : ""}>{(timeFrames.length * 6 + index * 6) + i + 1}</td> -->
                        {#if findSlotSubjects((timeFrames.length * 6 + index * 6) + i + 1).length !== 0}
                            <td style:background-color={findSlotSubjects((timeFrames.length * 6 + index * 6) + i + 1).length === 1 ? "green" : "red"}>
                                {#each findSlotSubjects((timeFrames.length * 6 + index * 6) + i + 1) as foundMatch}
                                    <p>{subjects[foundMatch?.subject ?? 0].name}</p>
                                {/each}
                            </td>
                        {:else}
                            <td>-</td>
                        {/if}
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>