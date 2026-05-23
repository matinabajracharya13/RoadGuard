import { getSeverityColor } from '../../utils/severityCalculator';
import { describe, it, expect } from '@jest/globals';

describe('getSeverityColor', () => {
  it('returns red for high severity', () => {
    expect(getSeverityColor('High')).toBe('#dc2626');
  });

  it('returns orange for medium severity', () => {
    expect(getSeverityColor('Medium')).toBe('#f59e0b');
  });

  it('returns green for low severity', () => {
    expect(getSeverityColor('Low')).toBe('#16a34a');
  });
});