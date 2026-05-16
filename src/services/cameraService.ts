import * as ImagePicker from 'expo-image-picker';

export const captureHazardPhoto = async () => {
  const permissionResult =
    await ImagePicker.requestCameraPermissionsAsync();

  if (!permissionResult.granted) {
    throw new Error('Camera permission denied');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    allowsEditing: true,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
};