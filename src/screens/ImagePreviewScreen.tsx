import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

export default function ImagePreviewScreen({
  route,
  navigation,
}: any) {
  const { theme } = useTheme();

  const { imageUri } = route.params;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#000',
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: 'rgba(255,255,255,0.15)',
          },
        ]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-outline"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});