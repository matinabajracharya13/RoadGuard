import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { getPendingHazardReports } from "../services/sqliteService";
import { getUserHazardReports } from "../services/hazardService";
import { syncPendingReports } from '../services/syncService';
import { TouchableOpacity, Alert } from 'react-native';

type HazardReport = {
  id: number | string;
  hazardType: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  syncStatus?: string;
  status?: string;
  source?: string;
  createdAt: any;
};

export default function HistoryScreen() {
  const { theme } = useTheme();

  const [reports, setReports] = useState<HazardReport[]>([]);
  const [refreshing, setRefreshing] = useState(false);


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

const handleSync = async () => {
  try {
    const syncedCount = await syncPendingReports();

    Alert.alert(
      'Sync Complete',
      `${syncedCount} pending reports synced successfully.`
    );

    await loadReports();
  } catch {
    Alert.alert('Sync Failed', 'Please try again.');
  }
};

  const loadReports = async () => {
    try {
      const offlineReports = getPendingHazardReports() as HazardReport[];

      const formattedOffline = offlineReports.map((report) => ({
        ...report,
        source: "offline",
      }));

      const onlineReports = await getUserHazardReports();

      setReports([...formattedOffline, ...onlineReports] as HazardReport[]);
    } catch (error) {
      const offlineReports = getPendingHazardReports() as HazardReport[];

      const formattedOffline = offlineReports.map((report) => ({
        ...report,
        source: "offline",
      }));

      setReports(formattedOffline);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: HazardReport }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        {item.hazardType}
      </Text>

      <View
  style={[
    styles.severityBadge,
    { backgroundColor: getSeverityColor(item.severity) },
  ]}
>
  <Text style={styles.badgeText}>
    {item.severity.toUpperCase()}
  </Text>
</View>

      <Text style={[styles.description, { color: theme.subText }]}>
        {item.description}
      </Text>

      <Text style={[styles.location, { color: theme.subText }]}>
        Lat: {item.latitude.toFixed(4)} | Lng: {item.longitude.toFixed(4)}
      </Text>

      <Text style={[styles.status, { color: theme.subText }]}>
        Status: {item.source === "online" ? "Online" : "Pending Offline"}
      </Text>

      <Text style={[styles.date, { color: theme.subText }]}>
        {item.createdAt?.toDate
          ? item.createdAt.toDate().toLocaleString()
          : new Date(item.createdAt).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Hazard Report History
      </Text>

      <TouchableOpacity
  style={[styles.syncButton, { backgroundColor: theme.primary }]}
  onPress={handleSync}
>
  <Text style={styles.syncButtonText}>Sync Pending Reports</Text>
</TouchableOpacity>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.subText }]}>
            No offline hazard reports found.
          </Text>
        }
      />
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  severity: {
    marginTop: 6,
    fontWeight: "600",
  },
  description: {
    marginTop: 8,
    fontSize: 14,
  },
  location: {
    marginTop: 8,
    fontSize: 13,
  },
  status: {
    marginTop: 8,
    fontSize: 13,
  },
  date: {
    marginTop: 6,
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  severityBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
  alignSelf: 'flex-start',
  marginTop: 8,
},
badgeText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 12,
},
statusBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 8,
  alignSelf: 'flex-start',
  marginTop: 8,
},
syncButton: {
  padding: 14,
  borderRadius: 10,
  alignItems: 'center',
  marginBottom: 18,
},

syncButtonText: {
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: 15,
},
});
