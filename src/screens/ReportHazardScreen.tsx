import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

import { useTheme } from '../context/ThemeContext';
import { getCurrentLocation } from '../services/locationService';
import { submitHazardReport } from '../services/hazardService';
import { savePendingHazardReport } from '../services/sqliteService';
import { captureHazardPhoto } from '../services/cameraService';

export default function ReportHazardScreen() {
  const { theme } = useTheme();

  const [hazardType, setHazardType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const hazardTypes = [
    { label: 'Pothole', icon: 'alert-circle-outline' },
    { label: 'Road Debris', icon: 'construct-outline' },
    { label: 'Flooding', icon: 'water-outline' },
    { label: 'Construction', icon: 'hammer-outline' },
    { label: 'Accident', icon: 'car-sport-outline' },
    { label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
  ];

  const severityLevels = ['Low', 'Medium', 'High'];

  const handleCapturePhoto = async () => {
    try {
      const uri = await captureHazardPhoto();

      if (uri) {
        setPhotoUri(uri);
        Alert.alert('Photo Captured', 'Hazard photo has been attached.');
      }
    } catch (error: any) {
      Alert.alert('Camera Error', error.message);
    }
  };

  const handleGetLocation = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      Alert.alert(
        'Location Captured',
        `GPS (${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)})`
      );
    } catch (error: any) {
      Alert.alert('Location Error', error.message);
    }
  };

  const resetForm = () => {
    setHazardType('');
    setSeverity('');
    setDescription('');
    setLocation(null);
    setPhotoUri(null);
  };

  const handleSubmit = async () => {
    if (!hazardType || !severity || !description.trim()) {
      Alert.alert('Missing Details', 'Please complete all required fields.');
      return;
    }

    if (!location) {
      Alert.alert('Location Required', 'Please capture GPS location first.');
      return;
    }

    const reportData = {
      hazardType,
      severity,
      description: description.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
    };

    try {
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected) {
        savePendingHazardReport(
          reportData.hazardType,
          reportData.severity,
          reportData.description,
          reportData.latitude,
          reportData.longitude
        );

        Alert.alert(
          'Saved Offline',
          'No internet connection. Your report has been saved locally.'
        );

        resetForm();
        return;
      }

      await submitHazardReport(reportData);

      Alert.alert('Report Submitted', 'Your hazard report has been saved online.');
      resetForm();
    } catch {
      savePendingHazardReport(
        reportData.hazardType,
        reportData.severity,
        reportData.description,
        reportData.latitude,
        reportData.longitude
      );

      Alert.alert(
        'Saved Offline',
        'Something went wrong online, so your report was saved locally.'
      );

      resetForm();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.header, { color: theme.text }]}>
        Report Road Hazard
      </Text>

      <Text style={[styles.subHeader, { color: theme.subText }]}>
        Capture hazard details, GPS location, and evidence.
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Hazard Type
      </Text>

      <View style={styles.hazardGrid}>
        {hazardTypes.map((item) => {
          const selected = hazardType === item.label;

          return (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.hazardButton,
                {
                  backgroundColor: selected ? theme.primary : theme.card,
                  borderColor: selected ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setHazardType(item.label)}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={selected ? '#ffffff' : theme.text}
              />
              <Text
                style={[
                  styles.hazardText,
                  { color: selected ? '#ffffff' : theme.text },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Severity
      </Text>

      <View style={styles.severityRow}>
        {severityLevels.map((level) => {
          const selected = severity === level;

          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.severityButton,
                {
                  backgroundColor: selected ? theme.primary : theme.card,
                  borderColor: selected ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setSeverity(level)}
            >
              <Text
                style={[
                  styles.severityText,
                  { color: selected ? '#ffffff' : theme.text },
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Evidence
      </Text>

      <View style={styles.featureGrid}>
        <TouchableOpacity
          style={[
            styles.featureCard,
            {
              backgroundColor: theme.card,
              borderColor: photoUri ? theme.primary : theme.border,
            },
          ]}
          onPress={handleCapturePhoto}
          activeOpacity={0.85}
        >
          {photoUri ? (
            <>
              <Image source={{ uri: photoUri }} style={styles.cardThumbnail} />

              <Text style={[styles.featureTitle, { color: theme.text }]}>
                Photo Added
              </Text>

              <TouchableOpacity onPress={() => setPhotoUri(null)}>
                <Text style={styles.removeInlineText}>Remove</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Ionicons name="camera-outline" size={28} color={theme.primary} />

              <Text style={[styles.featureTitle, { color: theme.text }]}>
                Capture Photo
              </Text>

              <Text style={[styles.featureSubtitle, { color: theme.subText }]}>
                Attach visual evidence
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.featureCard,
            {
              backgroundColor: theme.card,
              borderColor: location ? theme.primary : theme.border,
            },
          ]}
          onPress={handleGetLocation}
          activeOpacity={0.85}
        >
          {location ? (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={30}
                color={theme.primary}
              />

              <Text style={[styles.featureTitle, { color: theme.text }]}>
                GPS Added
              </Text>

              <Text style={[styles.featureSubtitle, { color: theme.subText }]}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>

              <TouchableOpacity onPress={() => setLocation(null)}>
                <Text style={styles.removeInlineText}>Remove</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Ionicons name="location-outline" size={28} color={theme.primary} />

              <Text style={[styles.featureTitle, { color: theme.text }]}>
                Capture GPS
              </Text>

              <Text style={[styles.featureSubtitle, { color: theme.subText }]}>
                Record coordinates
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Description
      </Text>

      <TextInput
        style={[
          styles.textArea,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="Describe the hazard..."
        placeholderTextColor={theme.subText}
        multiline
        numberOfLines={5}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <Ionicons name="cloud-upload-outline" size={20} color="#ffffff" />
        <Text style={styles.submitText}>Submit Hazard Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  hazardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  hazardButton: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  },
  hazardText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  severityRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  severityButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    alignItems: 'center',
  },
  severityText: {
    fontWeight: 'bold',
  },
  featureGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  featureCard: {
    flex: 1,
    minHeight: 150,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  featureSubtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
  cardThumbnail: {
    width: '100%',
    height: 85,
    borderRadius: 12,
  },
  removeInlineText: {
    color: '#dc2626',
    fontWeight: 'bold',
    marginTop: 8,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});