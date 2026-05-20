import React, { useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function CameraScreen(): React.JSX.Element {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera access is required</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async (): Promise<void> => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setPhotoUri(photo.uri);
      }
    }
  };

  // Show the captured photo
  if (photoUri) {
    return (
      <View style={styles.center}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <TouchableOpacity style={styles.btn} onPress={() => setPhotoUri(null)}>
          <Text style={styles.btnText}>Retake</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView ref={cameraRef} style={{ flex: 1 }} enableTorch={torchOn} />
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setTorchOn((v) => !v)}
        >
          <Text style={styles.btnText}>Torch: {torchOn ? "ON" : "OFF"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={takePhoto}>
          <Text style={styles.btnText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  btn: {
    backgroundColor: "#1e6f5c",
    padding: 12,
    borderRadius: 8,
    margin: 6,
  },
  btnText: { color: "white", fontWeight: "600" },
  preview: { width: 300, height: 400, borderRadius: 8, marginBottom: 16 },
});