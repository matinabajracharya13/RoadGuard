import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import MapView, { Marker } from 'react-native-maps';

import { useTheme } from '../context/ThemeContext';
import { getAddressFromCoordinates } from '../services/locationService';

export default function HazardDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { report } = route.params;

  const [address, setAddress] = useState('Loading location...');

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const resolvedAddress = await getAddressFromCoordinates(
          report.latitude,
          report.longitude
        );

        setAddress(resolvedAddress);
      } catch {
        setAddress(
          `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`
        );
      }
    };

    loadAddress();
  }, []);

  const handleReadAloud = () => {
    Speech.speak(report.description, {
      language: 'en-AU',
      pitch: 1,
      rate: 0.9,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      default:
        return '#16a34a';
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name="arrow-back-outline"
          size={22}
          color={theme.text}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.text }]}>
        {report.hazardType}
      </Text>

      <View
        style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor(report.severity) },
        ]}
      >
        <Text style={styles.severityText}>
          {report.severity.toUpperCase()}
        </Text>
      </View>

      {report.photoUrl ? (
        <Image source={{ uri: report.photoUrl }} style={styles.image} />
      ) : null}

      <View
        style={[
          styles.descriptionCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.descriptionHeader}>
          <Text style={[styles.cardLabel, { color: theme.subText }]}>
            Description
          </Text>

          <TouchableOpacity
            style={[styles.speakerButton, { backgroundColor: theme.primary }]}
            onPress={handleReadAloud}
          >
            <Ionicons
              name="volume-high-outline"
              size={16}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.description, { color: theme.text }]}>
          {report.description}
        </Text>
      </View>

      <View
        style={[
          styles.locationCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.locationHeader}>
          <View style={styles.locationIconBox}>
            <Ionicons
              name="location-outline"
              size={22}
              color={theme.primary}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.cardLabel, { color: theme.subText }]}>
              GPS Location
            </Text>

            <Text style={[styles.locationText, { color: theme.text }]}>
              {address}
            </Text>
          </View>
        </View>

        <MapView
          style={styles.inlineMap}
          initialRegion={{
            latitude: report.latitude,
            longitude: report.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            title={report.hazardType}
            description={report.description}
          />
        </MapView>
      </View>

      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name={
            report.source === 'online'
              ? 'cloud-done-outline'
              : 'cloud-offline-outline'
          }
          size={20}
          color={report.source === 'online' ? '#16a34a' : '#f59e0b'}
        />

        <Text style={[styles.statusText, { color: theme.subText }]}>
          {report.source === 'online'
            ? 'Uploaded to Firebase'
            : 'Saved locally'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 22,
  },
  severityText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 18,
  },
  descriptionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  speakerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  locationCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inlineMap: {
    width: '100%',
    height: 180,
    borderRadius: 14,
  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});