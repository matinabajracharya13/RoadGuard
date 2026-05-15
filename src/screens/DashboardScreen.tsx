import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { logoutUser } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export default function DashboardScreen({ navigation }: any) {
  const { theme, darkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.replace('Login');
    } catch {
      Alert.alert('Logout Failed', 'Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>RoadGuard</Text>

      <Text style={[styles.subtitle, { color: theme.subText }]}>
        Smart road hazard detection and reporting system
      </Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Today’s Status</Text>
        <Text style={[styles.cardText, { color: theme.subText }]}>
          No active hazard reports yet.
        </Text>
      </View>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]}>
        <Text style={styles.buttonText}>Report Hazard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.outlineButton, { borderColor: theme.primary }]}>
        <Text style={[styles.outlineText, { color: theme.primary }]}>View Map</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleTheme}>
        <Text style={[styles.link, { color: theme.primary }]}>
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}>
        <Text style={[styles.logout, { color: theme.subText }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  outlineButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  outlineText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 24,
    fontWeight: '600',
  },
  logout: {
    textAlign: 'center',
    marginTop: 18,
  },
});