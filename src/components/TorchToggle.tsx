import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function TorchToggle() {
  const { theme } = useTheme();

  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashingRef = useRef(false);

  const stopFlashing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    flashingRef.current = false;
    setIsFlashing(false);
    setTorchOn(false);
  };

  const handleToggleTorch = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result.granted) {
        Alert.alert(
          'Permission Required',
          'Camera permission is needed to use the torch.'
        );
        return;
      }
    }

    if (flashingRef.current) {
      stopFlashing();
      return;
    }

    flashingRef.current = true;
    setIsFlashing(true);
    setTorchOn(true);

    intervalRef.current = setInterval(() => {
      setTorchOn((prev) => !prev);
    }, 400);
  };

  useEffect(() => {
    return () => {
      stopFlashing();
    };
  }, []);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <CameraView
        style={styles.hiddenCamera}
        facing="back"
        enableTorch={torchOn}
      />

      <Ionicons
        name={isFlashing ? 'warning-outline' : 'flashlight-outline'}
        size={32}
        color={isFlashing ? '#f59e0b' : theme.primary}
      />

      <Text style={[styles.title, { color: theme.text }]}>
        Emergency Flash
      </Text>

      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Flash the torch repeatedly for night hazard visibility.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isFlashing ? '#dc2626' : theme.primary,
          },
        ]}
        onPress={handleToggleTorch}
      >
        <Text style={styles.buttonText}>
          {isFlashing ? 'Stop Flashing' : 'Start Flashing'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  hiddenCamera: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});