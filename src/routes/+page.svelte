<script lang="ts">
    const timeFrames: string[] = [
        "7:15 a 8:00", "8:00 a 8:45", "8:45 a 9:30", "9:45 a 10:30", "10:30 a 11:15",
        "11:20 a 12:05", "12:05 a 12:50", "12:50 a 13:35", "13:35 a 14:10", "14:15 a 15:00",
        "15:00 a 15:45", "16:05 a 16:50", "16:50 a 17:35", "17:40 a 18:25", "18:35 a 19:15",
        "19:15 a 20:00", "20:00 a 20:45", "21:05 a 21:50", "21:50 a 22:35", "22:40 a 23:25",
        "23:25 a 0:10"
    ];

    let selected: number = $state(3);
</script>


<div class="container">
    <h1>Planificador de horarios UTN Frro</h1>
    
    <input type="number" bind:value={selected} />

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
                        <td style:background-color={(index * 6) + i + 1 === selected ? "red" : ""}>{(index * 6) + i + 1}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>