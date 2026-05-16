import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { logoutUser } from '../services/authService';

export default function SettingsScreen({ navigation }: any) {
  const { theme, darkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.getParent()?.replace('Login');
    } catch {
      Alert.alert('Logout Failed', 'Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View>
          <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            Improve visibility in low-light conditions.
          </Text>
        </View>

        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View>
          <Text style={[styles.label, { color: theme.text }]}>Notifications</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            Hazard alerts will be added later.
          </Text>
        </View>

        <Switch value={false} disabled />
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: theme.primary }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 70,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    maxWidth: 220,
  },
  logoutButton: {
    marginTop: 24,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});