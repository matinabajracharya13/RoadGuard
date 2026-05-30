import { describe, it, expect } from '@jest/globals';
import { formatReportDate } from '../../utils/dateFormatter';

describe('formatReportDate', () => {
  it('formats morning time correctly', () => {
    const date = new Date(2026, 4, 23, 9, 5);
    expect(formatReportDate(date)).toBe('23/05/2026 9:05 AM');
  });

  it('formats afternoon time correctly', () => {
    const date = new Date(2026, 4, 23, 15, 30);
    expect(formatReportDate(date)).toBe('23/05/2026 3:30 PM');
  });

  it('formats midnight correctly', () => {
    const date = new Date(2026, 4, 23, 0, 10);
    expect(formatReportDate(date)).toBe('23/05/2026 12:10 AM');
  });
});