import { describe, it, expect } from '@jest/globals';
import { isReportValid } from '../../utils/reportValidation';

describe('isReportValid', () => {
  it('returns true when all report fields are valid', () => {
    expect(
      isReportValid('Pothole', 'High', 'Large pothole on road', true)
    ).toBe(true);
  });

  it('returns false when description is missing', () => {
    expect(isReportValid('Pothole', 'High', '', true)).toBe(false);
  });

  it('returns false when location is missing', () => {
    expect(
      isReportValid('Pothole', 'High', 'Large pothole on road', false)
    ).toBe(false);
  });
});