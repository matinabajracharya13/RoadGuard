import { jest } from '@jest/globals';

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockMap = (props: any) => <View {...props} />;
  const MockMarker = (props: any) => <View {...props} />;

  return {
    __esModule: true,
    default: MockMap,
    Marker: MockMarker,
  };
});

jest.mock('../../services/locationService', () => ({
  getAddressFromCoordinates: jest.fn(() =>
    Promise.resolve('Main Street, Melbourne')
  ),
}));

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';

import HazardDetailScreen from '../../screens/HazardDetailScreen';
import { ThemeProvider } from '../../context/ThemeContext';

describe('HazardDetailScreen', () => {
  it('renders hazard detail information', async () => {
    const report = {
      hazardType: 'Flooding',
      severity: 'Medium',
      description: 'Water covering left lane',
      latitude: -34.9285,
      longitude: 138.6007,
      source: 'online',
      photoUri: '',
    };

    const { getByText } = render(
      <ThemeProvider>
        <HazardDetailScreen
          route={{ params: { report } }}
          navigation={{ goBack: () => {}, navigate: () => {} }}
        />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Flooding')).toBeTruthy();
      expect(getByText('Water covering left lane')).toBeTruthy();
      expect(getByText('Main Street, Melbourne')).toBeTruthy();
    });
  });
});