import { jest } from '@jest/globals';

jest.mock('../../services/sqliteService', () => ({
  getPendingHazardReports: jest.fn(() => [
    {
      id: 1,
      hazardType: 'Pothole',
      severity: 'High',
      description: 'Offline pothole report',
      latitude: -34.9285,
      longitude: 138.6007,
      syncStatus: 'pending',
      createdAt: new Date().toISOString(),
    },
  ]),
}));

jest.mock('../../services/hazardService', () => ({
  getUserHazardReports: jest.fn(() =>
    Promise.resolve([
      {
        id: 'abc123',
        hazardType: 'Flooding',
        severity: 'Medium',
        description: 'Uploaded flooding report',
        latitude: -34.9,
        longitude: 138.6,
        createdAt: {
          toDate: () => new Date(),
        },
      },
    ])
  ),
}));

jest.mock('../../services/syncService', () => ({
  syncPendingReports: jest.fn(() => Promise.resolve(1)),
}));

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';

import HistoryScreen from '../../screens/HistoryScreen';
import { ThemeProvider } from '../../context/ThemeContext';

describe('HistoryScreen', () => {
  it('renders uploaded and local tabs', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <HistoryScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Uploaded')).toBeTruthy();
      expect(getByText('Local')).toBeTruthy();
    });
  });

  it('shows uploaded reports by default', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <HistoryScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Flooding')).toBeTruthy();
    });
  });

  it('shows local reports when Local tab is pressed', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <HistoryScreen />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Local'));

    await waitFor(() => {
      expect(getByText('Pothole')).toBeTruthy();
      // expect(getByText('Sync Pending Reports')).toBeTruthy();
    });
  });
});