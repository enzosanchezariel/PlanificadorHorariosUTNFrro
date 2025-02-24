import type { Subject } from "./entities/subject.entity";

export const addedSubjects = $state<{subjects: Subject[]}>({subjects: []});