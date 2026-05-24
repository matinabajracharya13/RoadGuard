import * as FileSystem from 'expo-file-system/legacy';

export const saveImageLocally = async (imageUri: string) => {
  const fileName = `hazard_${Date.now()}.jpg`;
  const newPath = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.copyAsync({
    from: imageUri,
    to: newPath,
  });

  return newPath;
};