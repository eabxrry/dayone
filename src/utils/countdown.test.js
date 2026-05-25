import { describe, expect, it } from 'vitest';
import {
  getBacDateForYear,
  getCountdownStatus,
  getNextBacDate,
  getTimeLeft,
} from './countdown.js';

const config = {
  monthIndex: 6,
  day: 1,
  hour: 8,
  minute: 0,
  second: 0,
};

describe('countdown utils', () => {
  it('builds bac date for a given year', () => {
    const date = getBacDateForYear(2026, config);
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(1);
    expect(date.getHours()).toBe(8);
  });

  it('returns current year bac date when now is before bac', () => {
    const now = new Date(2026, 5, 20, 10, 0, 0);
    const target = getNextBacDate(now, config);
    expect(target.getFullYear()).toBe(2026);
  });

  it('returns next year bac date when now is after bac', () => {
    const now = new Date(2026, 6, 2, 10, 0, 0);
    const target = getNextBacDate(now, config);
    expect(target.getFullYear()).toBe(2027);
  });

  it('computes correct time left values', () => {
    const now = new Date(2026, 0, 1, 0, 0, 0).getTime();
    const target = new Date(2026, 0, 2, 3, 4, 5);
    const result = getTimeLeft(target, now);

    expect(result).toEqual({
      days: 1,
      hours: 3,
      minutes: 4,
      seconds: 5,
    });
  });

  it('returns zeros when target is in the past', () => {
    const now = new Date(2026, 0, 3, 0, 0, 0).getTime();
    const target = new Date(2026, 0, 2, 0, 0, 0);
    const result = getTimeLeft(target, now);

    expect(result).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('returns status avant before bac', () => {
    const now = new Date(2026, 5, 30, 7, 0, 0).getTime();
    const target = new Date(2026, 6, 1, 8, 0, 0);
    expect(getCountdownStatus(target, now)).toBe('avant');
  });

  it('returns status en_cours shortly after bac start', () => {
    const now = new Date(2026, 6, 1, 10, 0, 0).getTime();
    const target = new Date(2026, 6, 1, 8, 0, 0);
    expect(getCountdownStatus(target, now)).toBe('en_cours');
  });

  it('returns status termine after bac duration window', () => {
    const now = new Date(2026, 6, 1, 16, 30, 0).getTime();
    const target = new Date(2026, 6, 1, 8, 0, 0);
    expect(getCountdownStatus(target, now)).toBe('termine');
  });
});
