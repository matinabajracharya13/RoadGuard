import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { submitHazardReport } from "../services/hazardService";
import { savePendingHazardReport } from "../services/sqliteService";
import { getCurrentLocation } from "../services/locationService";
import NetInfo from "@react-native-community/netinfo";

export default function ReportHazardScreen() {
  const { theme } = useTheme();

  const [hazardType, setHazardType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const handleGetLocation = async () => {
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      Alert.alert(
        "Location Captured",
        `Lat: ${currentLocation.latitude.toFixed(4)}
Lng: ${currentLocation.longitude.toFixed(4)}`,
      );
    } catch (error: any) {
      Alert.alert("Location Error", error.message);
    }
  };

  const handleSubmit = async () => {
  if (!hazardType.trim() || !severity.trim() || !description.trim()) {
    Alert.alert('Missing Details', 'Please fill in all fields.');
    return;
  }

  if (!location) {
    Alert.alert('Location Required', 'Please capture your current location first.');
    return;
  }

  const reportData = {
    hazardType: hazardType.trim(),
    severity: severity.trim(),
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

      setHazardType('');
      setSeverity('');
      setDescription('');
      setLocation(null);
      return;
    }

    await submitHazardReport(reportData);

    Alert.alert('Report Submitted', 'Your hazard report has been saved online.');

    setHazardType('');
    setSeverity('');
    setDescription('');
    setLocation(null);
  } catch (error: any) {
    Alert.alert('fjrhrh')
    console.log('fjrhrh')
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

    setHazardType('');
    setSeverity('');
    setDescription('');
    setLocation(null);
  }
};

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Report Road Hazard
      </Text>

      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Help improve road safety by reporting hazards.
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="Hazard Type (e.g. pothole, debris)"
        placeholderTextColor={theme.subText}
        value={hazardType}
        onChangeText={setHazardType}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="Severity (Low / Medium / High)"
        placeholderTextColor={theme.subText}
        value={severity}
        onChangeText={setSeverity}
      />

      <TextInput
        style={[
          styles.textArea,
          {
            backgroundColor: theme.card,
            color: theme.text,
            borderColor: theme.border,
          },
        ]}
        placeholder="Describe the hazard"
        placeholderTextColor={theme.subText}
        multiline
        numberOfLines={5}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={[styles.secondaryButton, { borderColor: theme.primary }]}
        onPress={handleGetLocation}
      >
        <Text style={[styles.secondaryText, { color: theme.primary }]}>
          Get Current Location
        </Text>

        {location && (
          <Text style={[styles.locationText, { color: theme.subText }]}>
            Current Location:
            {"\n"}
            Latitude: {location.latitude.toFixed(4)}
            {"\n"}
            Longitude: {location.longitude.toFixed(4)}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit Hazard Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 28,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
  },
  textArea: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 18,
    borderWidth: 1,
    textAlignVertical: "top",
    minHeight: 120,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    marginTop: 4,
  },
  secondaryText: {
    fontWeight: "bold",
    fontSize: 15,
  },
  locationText: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 14,
  },
});
