import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error('Location permission denied');
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
) => {
  const addresses = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  if (addresses.length > 0) {
    const address = addresses[0];

    return `${address.street || 'Unknown Street'}, ${
      address.city || address.subregion || ''
    }`;
  }

  return 'Unknown Location';
};