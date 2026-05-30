import { describe, it, expect } from '@jest/globals';
import { formatGps } from '../../utils/gpsFormatter';

describe('formatGps', () => {
  it('formats GPS coordinates to four decimals', () => {
    expect(formatGps(-34.928498, 138.600746)).toBe(
      'GPS (-34.9285, 138.6007)'
    );
  });

  it('handles positive coordinates', () => {
    expect(formatGps(12.345678, 98.765432)).toBe(
      'GPS (12.3457, 98.7654)'
    );
  });

  it('handles zero coordinates', () => {
    expect(formatGps(0, 0)).toBe('GPS (0.0000, 0.0000)');
  });
});