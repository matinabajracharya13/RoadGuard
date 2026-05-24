import { jest } from '@jest/globals';

jest.mock('expo-sensors', () => ({
  Accelerometer: {
    setUpdateInterval: jest.fn(),
    addListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  },
}));

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { describe, it, expect } from '@jest/globals';

import DetectHazardScreen from '../../screens/DetectHazardScreen';
import { ThemeProvider } from '../../context/ThemeContext';

describe('DetectHazardScreen', () => {
  it('renders detection screen correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <DetectHazardScreen
          navigation={{
            navigate: () => {},
          }}
        />
      </ThemeProvider>
    );

    expect(getByText('Hazard Detection')).toBeTruthy();
    expect(getByText('Start Detection')).toBeTruthy();
  });

  it('changes button text when detection starts', () => {
    const { getByText } = render(
      <ThemeProvider>
        <DetectHazardScreen
          navigation={{
            navigate: () => {},
          }}
        />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Start Detection'));

    expect(getByText('Stop Detection')).toBeTruthy();
  });
});