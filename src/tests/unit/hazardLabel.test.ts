import { describe, it, expect } from '@jest/globals';
import { getHazardDisplayLabel } from '../../utils/hazardLabel';

describe('getHazardDisplayLabel', () => {
  it('returns selected hazard label', () => {
    expect(getHazardDisplayLabel('Pothole')).toBe('Pothole');
  });

  it('trims extra spaces', () => {
    expect(getHazardDisplayLabel('  Flooding  ')).toBe('Flooding');
  });

  it('returns fallback for empty hazard type', () => {
    expect(getHazardDisplayLabel('')).toBe('Unknown Hazard');
  });
});