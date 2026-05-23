import { jest } from '@jest/globals';

jest.mock('../../services/hazardService', () => ({
  submitHazardReport: jest.fn(),
}));

jest.mock('../../services/locationService', () => ({
  getCurrentLocation: jest.fn(),
}));

jest.mock('../../services/sqliteService', () => ({
  savePendingHazardReport: jest.fn(),
}));

jest.mock('../../services/cameraService', () => ({
  captureHazardPhoto: jest.fn(),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';

import ReportHazardScreen from '../../screens/ReportHazardScreen';
import { ThemeProvider } from '../../context/ThemeContext';

describe('ReportHazardScreen', () => {
  it('renders report screen correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <ThemeProvider>
        <ReportHazardScreen
          navigation={{ back: () => {} }}
          route={{ params: {} }}
        />
      </ThemeProvider>
    );

    expect(getByText('Report Road Hazard')).toBeTruthy();
    expect(getByText('Hazard Type')).toBeTruthy();
    expect(getByText('Severity')).toBeTruthy();
    expect(getByText('Evidence')).toBeTruthy();

    expect(
      getByPlaceholderText('Describe the hazard...')
    ).toBeTruthy();

    expect(getByText('Submit Hazard Report')).toBeTruthy();
  });
});