import { type Transcript, type StudentID } from './types.ts';

export interface ITranscript {
    addStudent(studentName: string): Promise<StudentID>;
    getTranscript(id: StudentID): Promise<Transcript>; // throws Error if id invalid
    deleteStudent(id: StudentID): Promise<void>; // throws Error if id invalid
    addGrade(id: StudentID, course: string, courseGrade: { course: string; grade: number }): Promise<void>;
    getGrade(id: StudentID, course: string): Promise<{ course: string; grade: number }>;
    nameToIDs(studentName: string): StudentID[];
}
