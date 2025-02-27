interface SubjectCommission {
subject: number;
commission: number;
}

import type { Subject } from "./entities/subject.entity";

export function findValidCommissionCombinations( selectedSubjectIndices: number[], jsonData: Subject[] ): SubjectCommission[][] {
    if (!selectedSubjectIndices.length || !jsonData.length) {
        return [];
    }

    const validIndices = selectedSubjectIndices.filter(idx => 
        idx >= 0 && idx < jsonData.length
    );

    if (!validIndices.length) {
        return [];
    }

    const allPossibleCombinations = generateAllCombinations(validIndices, jsonData);

    const validCombinations = allPossibleCombinations.filter(combo => 
        !hasHourConflict(combo, jsonData)
    );

    return validCombinations;
}

function generateAllCombinations( subjectIndices: number[], jsonData: Subject[] ): SubjectCommission[][] {
    let combinations: SubjectCommission[][] = [[]];

    for (const subjectIdx of subjectIndices) {
        const subject = jsonData[subjectIdx];
        const newCombinations: SubjectCommission[][] = [];

        const commissions = subject.hourByCommissions.map(c => c.commission);

        for (const combo of combinations) {
            for (const commission of commissions) {
                newCombinations.push([
                    ...combo,
                    { subject: subjectIdx, commission }
                ]);
            }
        }

        combinations = newCombinations;
    }

    return combinations;
}

function hasHourConflict( combination: SubjectCommission[], jsonData: Subject[] ): boolean {
    const allHours: Set<number> = new Set();
    let totalHoursCount = 0;

    for (const { subject: subjectIdx, commission } of combination) {
        const subject = jsonData[subjectIdx];
        const commissionData = subject.hourByCommissions.find(
        c => c.commission === commission
        );

        if (commissionData) {
            commissionData.hours.forEach(hour => {
            allHours.add(hour);
            totalHoursCount++;
            });
        }
    }

    return totalHoursCount !== allHours.size;
}