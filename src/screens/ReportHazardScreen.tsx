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
import { Image } from "react-native";
import { captureHazardPhoto } from "../services/cameraService";
import { uploadHazardImage } from '../services/storageService';

export default function ReportHazardScreen() {
  const { theme } = useTheme();

  const [hazardType, setHazardType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

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

  const handleCapturePhoto = async () => {
    try {
      const uri = await captureHazardPhoto();

      if (uri) {
        setPhotoUri(uri);
        Alert.alert("Photo Captured", "Hazard photo has been attached.");
      }
    } catch (error: any) {
      Alert.alert("Camera Error", error.message);
    }
  };

  const handleSubmit = async () => {
  if (!hazardType || !severity || !description) {
    Alert.alert('Missing Details', 'Please fill in all fields.');
    return;
  }

  if (!location) {
    Alert.alert('Location Required', 'Please capture your location.');
    return;
  }

  try {
    let photoUrl = '';

    if (photoUri) {
      photoUrl = await uploadHazardImage(photoUri);
    }

    await submitHazardReport({
      hazardType,
      severity,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      photoUrl,
    });

    Alert.alert('Success', 'Report submitted with photo.');

    setHazardType('');
    setSeverity('');
    setDescription('');
    setLocation(null);
    setPhotoUri(null);

  } catch (error: any) {
    // offline fallback (no upload)
    savePendingHazardReport(
      hazardType,
      severity,
      description,
      location.latitude,
      location.longitude
    );

    Alert.alert('Saved Offline', 'Report saved locally (no image upload).');

    setHazardType('');
    setSeverity('');
    setDescription('');
    setLocation(null);
    setPhotoUri(null);
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

      <Text style={[styles.label, { color: theme.text }]}>Hazard Type</Text>

      <View style={styles.hazardContainer}>
        {[
          "Pothole",
          "Road Debris",
          "Flooding",
          "Construction",
          "Accident",
          "Other",
        ].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.hazardButton,
              {
                backgroundColor:
                  hazardType === type ? theme.primary : theme.card,
                borderColor: hazardType === type ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setHazardType(type)}
          >
            <Text
              style={[
                styles.hazardText,
                {
                  color: hazardType === type ? "#ffffff" : theme.text,
                },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={[styles.label, { color: theme.text }]}>Severity</Text>

      <View style={styles.severityContainer}>
        {["Low", "Medium", "High"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.severityButton,
              {
                backgroundColor:
                  severity === level ? theme.primary : theme.card,
                borderColor: severity === level ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setSeverity(level)}
          >
            <Text
              style={[
                styles.severityText,
                {
                  color: severity === level ? "#ffffff" : theme.text,
                },
              ]}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
        onPress={handleCapturePhoto}
      >
        <Text style={[styles.secondaryText, { color: theme.primary }]}>
          Capture Hazard Photo
        </Text>
      </TouchableOpacity>

      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
      )}

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
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  severityContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  severityButton: {
    flex: 1,
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },

  severityText: {
    fontWeight: "bold",
  },
  hazardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },

  hazardButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },

  hazardText: {
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
});
