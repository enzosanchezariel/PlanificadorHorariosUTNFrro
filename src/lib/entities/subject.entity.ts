import type { HourByCommission } from "./hourByCommission.entity";

export class Subject {
    carreer: string;
    elective: boolean;
    name: string;
    level: number;
    period: string;
    hourByCommissions: HourByCommission[];

    constructor(carreer: string, elective: boolean, name: string, level: number, period: string, hourByCommissions: HourByCommission[]) {
        this.carreer = carreer;
        this.elective = elective;
        this.name = name;
        this.level = level;
        this.period = period;
        this.hourByCommissions = hourByCommissions;
    }
}