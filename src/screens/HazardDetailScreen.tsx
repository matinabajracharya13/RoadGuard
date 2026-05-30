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
          report?.latitude,
          report?.longitude
        );
        setAddress(resolvedAddress);
      } catch {
        setAddress(`${report?.latitude.toFixed(4)}, ${report?.longitude.toFixed(4)}`);
      }
    };

    loadAddress();
  }, []);

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

  const handleReadAloud = () => {
    Speech.speak(report?.description, {
      language: 'en-AU',
      pitch: 1,
      rate: 0.9,
    });
  };

  const imageUri = report?.photoUri || report?.photoUrl;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color={theme.text} />
        </TouchableOpacity>

        <View
          style={[
            styles.statusPill,
            {
              backgroundColor:
                report?.source === 'online' ? '#dcfce7' : '#fef3c7',
            },
          ]}
        >
          <Ionicons
            name={
              report?.source === 'online'
                ? 'cloud-done-outline'
                : 'cloud-offline-outline'
            }
            size={15}
            color={report?.source === 'online' ? '#16a34a' : '#f59e0b'}
          />
          <Text
            style={[
              styles.statusPillText,
              { color: report?.source === 'online' ? '#16a34a' : '#f59e0b' },
            ]}
          >
            {report?.source === 'online' ? 'Uploaded' : 'Local'}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        {report?.hazardType}
      </Text>

      <View
        style={[
          styles.severityBadge,
          { backgroundColor: getSeverityColor(report?.severity) },
        ]}
      >
        <Ionicons name="warning-outline" size={14} color="#ffffff" />
        <Text style={styles.severityText}>{report?.severity.toUpperCase()}</Text>
      </View>

      {imageUri ? (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('ImagePreview', {
              imageUri,
            })
          }
        >
          <Image source={{ uri: imageUri }} style={styles.heroImage} />

          <View style={styles.imageOverlay}>
            <Ionicons name="expand-outline" size={18} color="#ffffff" />
            <Text style={styles.imageOverlayText}>Tap to view</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View
          style={[
            styles.noImageCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="image-outline" size={34} color={theme.subText} />
          <Text style={[styles.noImageText, { color: theme.subText }]}>
            No image attached
          </Text>
        </View>
      )}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.cardLabel, { color: theme.subText }]}>
              Description
            </Text>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Hazard details
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.smallRoundButton, { backgroundColor: theme.primary }]}
            onPress={handleReadAloud}
          >
            <Ionicons name="volume-high-outline" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.description, { color: theme.text }]}>
          {report?.description}
        </Text>
      </View>

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.locationHeader}>
          <View
            style={[
              styles.locationIconBox,
              { backgroundColor: `${theme.primary}22` },
            ]}
          >
            <Ionicons name="location-outline" size={23} color={theme.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.cardLabel, { color: theme.subText }]}>
              Location
            </Text>
            <Text style={[styles.locationText, { color: theme.text }]}>
              {address}
            </Text>
            <Text style={[styles.gpsText, { color: theme.subText }]}>
              GPS ({report?.latitude.toFixed(4)}, {report?.longitude.toFixed(4)})
            </Text>
          </View>
        </View>

        <View style={styles.mapWrapper}>
          <MapView
            style={styles.inlineMap}
            initialRegion={{
              latitude: report?.latitude,
              longitude: report?.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: report?.latitude,
                longitude: report?.longitude,
              }}
              title={report?.hazardType}
              description={report?.description}
            />
          </MapView>
        </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    gap: 5,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 18,
    gap: 6,
  },
  severityText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  heroImage: {
    width: '100%',
    height: 230,
    borderRadius: 18,
    marginBottom: 16,
  },
  imageOverlay: {
    position: 'absolute',
    right: 14,
    bottom: 30,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  imageOverlayText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noImageCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },
  noImageText: {
    marginTop: 8,
    fontWeight: '600',
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  smallRoundButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  locationIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gpsText: {
    fontSize: 13,
    marginTop: 4,
  },
  mapWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  inlineMap: {
    width: '100%',
    height: 190,
  },
});