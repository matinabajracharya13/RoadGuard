import { describe, it, expect } from '@jest/globals';
import {
  calculateMovementMagnitude,
  isPotholeDetected,
} from '../../utils/sensorUtils';

describe('sensorUtils', () => {
  it('calculates accelerometer movement magnitude', () => {
    expect(calculateMovementMagnitude(1, 2, 2)).toBe(3);
  });

  it('detects pothole when magnitude is above threshold', () => {
    expect(isPotholeDetected(2.1, 1.8)).toBe(true);
  });

  it('does not detect pothole when magnitude is below threshold', () => {
    expect(isPotholeDetected(1.2, 1.8)).toBe(false);
  });
});