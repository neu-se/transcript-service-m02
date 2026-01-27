import Keyv from 'keyv';
import {
  type StudentID,
  type Student,
  type Course,
  type CourseGrade,
  type Transcript,
} from './types.ts';
import type { ITranscript } from './ITranscript.ts';



export class TranscriptDB implements ITranscript {
  /** keyv store for transcripts keyed by studentID (in-memory) */
  private _store: Keyv<Transcript>;

  /** the last assigned student ID
   * @note Assumes studentID is Number
   */
  private _lastID: number;

  /** map to track studentName -> studentIDs for efficient lookup */
  private _nameIndex: Map<string, StudentID[]>;

  constructor() {
    this._store = new Keyv();
    this._lastID = 1;
    this._nameIndex = new Map();
  }

  /** Adds a new student to the database
   * @param {string} newName - the name of the student
   * @returns {StudentID} - the newly-assigned ID for the new student
   */
  async addStudent(newName: string): Promise<StudentID> {
    const newID = this._lastID++;
    const newStudent: Student = { studentID: newID, studentName: newName };
    const transcript: Transcript = { student: newStudent, grades: [] };
    await this._store.set(String(newID), transcript);

    // Update name index
    if (!this._nameIndex.has(newName)) {
      this._nameIndex.set(newName, []);
    }
    this._nameIndex.get(newName)!.push(newID);

    return newID;
  }

  /**
   * @param studentName
   * @returns list of studentIDs associated with that name
   */
  nameToIDs(studentName: string): StudentID[] {
    return this._nameIndex.get(studentName) || [];
  }

  /**
   *
   * @param id - the id to look up
   * @returns the transcript for this ID
   */
  async getTranscript(id: StudentID): Promise<Transcript> {
    const transcript = await this._store.get(String(id));
    if (transcript === undefined) {
      throw new Error(`unknown ID: ${id}`);
    }
    return transcript;
  }

  async deleteStudent(id: StudentID): Promise<void> {
    const transcript = await this._store.get(String(id));
    if (transcript === undefined) {
      throw new Error('unknown ID');
    }
    const studentName = transcript.student.studentName;
    await this._store.delete(String(id));

    // Update name index
    const ids = this._nameIndex.get(studentName);
    if (ids) {
      const idx = ids.indexOf(id);
      if (idx > -1) {
        ids.splice(idx, 1);
      }
      if (ids.length === 0) {
        this._nameIndex.delete(studentName);
      }
    }
  }

  async addGrade(id: StudentID, course: Course, courseGrade: CourseGrade): Promise<void> {
    const transcript = await this._store.get(String(id));
    if (transcript === undefined) {
      throw new Error('unknown ID');
    }
    transcript.grades.push(courseGrade);
    await this._store.set(String(id), transcript);
  }

  async getGrade(id: StudentID, course: Course): Promise<CourseGrade> {
    const transcript = await this._store.get(String(id));
    if (transcript === undefined) {
      throw new Error('unknown ID');
    }
    const grade = transcript.grades.find(g => g.course === course);
    if (grade === undefined) {
      throw new Error(`no grade for course ${course}`);
    }
    return grade;
  }

  async getAllStudentIDs(): Promise<StudentID[]> {
    return Array.from(this._nameIndex.values()).flat();
  }
}
