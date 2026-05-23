import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function DetectHazardScreen({ navigation }: any) {
  const { theme } = useTheme();

  const [isDetecting, setIsDetecting] = useState(false);
  const [magnitude, setMagnitude] = useState(0);

  const subscriptionRef = useRef<any>(null);
  const detectingRef = useRef(false);

  const threshold = 1.8;

  const stopDetection = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    detectingRef.current = false;
    setIsDetecting(false);
  };

  const startDetection = () => {
    if (subscriptionRef.current) return;

    Accelerometer.setUpdateInterval(500);

    detectingRef.current = true;
    setIsDetecting(true);

    subscriptionRef.current = Accelerometer.addListener((data) => {
      if (!detectingRef.current) return;

      const totalForce = Math.sqrt(
        data.x * data.x + data.y * data.y + data.z * data.z
      );

      setMagnitude(totalForce);

      if (totalForce > threshold) {
        stopDetection();

        Alert.alert(
          'Possible Road Hazard Detected',
          'Strong movement was detected. Do you want to report this as a pothole?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Report',
              onPress: () =>
                navigation.navigate('Report', {
                  detectedHazardType: 'Pothole',
                }),
            },
          ]
        );
      }
    });
  };

  const handleToggleDetection = () => {
    if (detectingRef.current) {
      stopDetection();
    } else {
      startDetection();
    }
  };

  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Hazard Detection
      </Text>

      <Text style={[styles.subHeader, { color: theme.subText }]}>
        Uses accelerometer movement to detect possible bumps or potholes.
      </Text>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name={isDetecting ? 'pulse-outline' : 'speedometer-outline'}
          size={46}
          color={theme.primary}
        />

        <Text style={[styles.statusTitle, { color: theme.text }]}>
          {isDetecting ? 'Detection Running' : 'Detection Stopped'}
        </Text>

        <Text style={[styles.statusText, { color: theme.subText }]}>
          Current movement value: {magnitude.toFixed(2)}
        </Text>

        <Text style={[styles.statusText, { color: theme.subText }]}>
          Detection threshold: {threshold}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isDetecting ? '#dc2626' : theme.primary,
          },
        ]}
        onPress={handleToggleDetection}
      >
        <Ionicons
          name={isDetecting ? 'stop-circle-outline' : 'play-circle-outline'}
          size={21}
          color="#ffffff"
        />

        <Text style={styles.buttonText}>
          {isDetecting ? 'Stop Detection' : 'Start Detection'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.note, { color: theme.subText }]}>
        Note: This is a prototype detection feature. In real use, the threshold
        would need testing across different phones, vehicles, and road
        conditions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 22,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 14,
  },
  statusText: {
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  note: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 22,
  },
});