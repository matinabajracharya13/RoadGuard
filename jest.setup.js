jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: {
    High: 6,
  },
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
}));

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() =>
    Promise.resolve({
      isConnected: true,
    })
  ),
  addEventListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getAllSync: jest.fn(() => []),
  })),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Ionicons: ({ name }) =>
      React.createElement(Text, null, name),
  };
});

jest.mock('react-native-google-mobile-ads', () => ({
  BannerAd: () => null,
  BannerAdSize: {
    ANCHORED_ADAPTIVE_BANNER:
      'ANCHORED_ADAPTIVE_BANNER',
  },
  TestIds: {
    BANNER: 'test-banner',
  },
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}));

jest.mock('react-native-maps', () => {
  const React = require('react');
  const { View } = require('react-native');

  const MockMap = (props) =>
    React.createElement(View, props);

  const MockMarker = (props) =>
    React.createElement(View, props);

  return {
    __esModule: true,
    default: MockMap,
    Marker: MockMarker,
  };
});

jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));

jest.mock('expo-battery', () => ({
  getBatteryLevelAsync: jest.fn(() => Promise.resolve(0.8)),
  addBatteryLevelListener: jest.fn(() => ({
    remove: jest.fn(),
  })),
}));