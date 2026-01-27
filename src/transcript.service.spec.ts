import { beforeEach, describe, expect, it } from 'vitest';
import type { ITranscript } from './ITranscript.ts';
import { TranscriptDB } from './transcript.service.ts';

let db: TranscriptDB;
let testCounter = 0;
beforeEach(async () => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student\'s transcript', async () => {
    const id1 = db.addStudent('blair');
    expect(id1).toBeDefined();
    expect(db.nameToIDs('blair')).toContain(id1);
    const transcript = await db.getTranscript(id1);
    expect(transcript).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', async () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    await expect(db.getTranscript(1)).rejects.toThrowError();
  });
});
