import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { getPendingHazardReports } from '../services/sqliteService';
import { getUserHazardReports } from '../services/hazardService';
import { syncPendingReports } from '../services/syncService';

type HazardReport = {
  id: number | string;
  hazardType: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  syncStatus?: string;
  status?: string;
  source?: 'online' | 'offline';
  createdAt: any;
};

export default function HistoryScreen() {
  const { theme } = useTheme();

  const [reports, setReports] = useState<HazardReport[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'uploaded' | 'local'>('uploaded');

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

  const formatDate = (createdAt: any) => {
    if (!createdAt) return 'Time unavailable';

    const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  const loadReports = async () => {
    try {
      const offlineReports = getPendingHazardReports() as HazardReport[];

      const formattedOffline = offlineReports.map((report) => ({
        ...report,
        source: 'offline' as const,
      }));

      const onlineReports = (await getUserHazardReports()) as HazardReport[];

      const formattedOnline = onlineReports.map((report) => ({
        ...report,
        source: 'online' as const,
      }));

      setReports([...formattedOnline, ...formattedOffline]);
    } catch (error) {
      const offlineReports = getPendingHazardReports() as HazardReport[];

      const formattedOffline = offlineReports.map((report) => ({
        ...report,
        source: 'offline' as const,
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

  const handleSync = async () => {
    try {
      const syncedCount = await syncPendingReports();

      Alert.alert(
        'Sync Complete',
        `${syncedCount} pending reports synced successfully.`
      );

      await loadReports();
      setActiveTab('uploaded');
    } catch {
      Alert.alert('Sync Failed', 'Please try again.');
    }
  };

  const filteredReports = reports.filter((report) =>
    activeTab === 'uploaded'
      ? report.source === 'online'
      : report.source === 'offline'
  );

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
      <View style={styles.cardHeader}>
        <Text style={[styles.title, { color: theme.text }]}>
          {item.hazardType}
        </Text>

        <View
          style={[
            styles.severityBadge,
            { backgroundColor: getSeverityColor(item.severity) },
          ]}
        >
          <Text style={styles.badgeText}>{item.severity.toUpperCase()}</Text>
        </View>
      </View>

      <Text
        style={[styles.description, { color: theme.subText }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={16} color={theme.subText} />
        <Text style={[styles.metaText, { color: theme.subText }]}>
          GPS ({item.latitude.toFixed(4)}, {item.longitude.toFixed(4)})
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons
          name={
            item.source === 'online'
              ? 'cloud-done-outline'
              : 'cloud-offline-outline'
          }
          size={16}
          color={item.source === 'online' ? '#16a34a' : '#f59e0b'}
        />
        <Text style={[styles.metaText, { color: theme.subText }]}>
          {item.source === 'online' ? 'Uploaded to Firebase' : 'Saved locally'}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={16} color={theme.subText} />
        <Text style={[styles.metaText, { color: theme.subText }]}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Report History
      </Text>

      <Text style={[styles.subHeader, { color: theme.subText }]}>
        View uploaded reports and local pending reports.
      </Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              backgroundColor:
                activeTab === 'uploaded' ? theme.primary : theme.card,
              borderColor:
                activeTab === 'uploaded' ? theme.primary : theme.border,
            },
          ]}
          onPress={() => setActiveTab('uploaded')}
        >
          <Ionicons
            name="cloud-done-outline"
            size={17}
            color={activeTab === 'uploaded' ? '#ffffff' : theme.text}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'uploaded' ? '#ffffff' : theme.text },
            ]}
          >
            Uploaded
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            {
              backgroundColor:
                activeTab === 'local' ? theme.primary : theme.card,
              borderColor:
                activeTab === 'local' ? theme.primary : theme.border,
            },
          ]}
          onPress={() => setActiveTab('local')}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={17}
            color={activeTab === 'local' ? '#ffffff' : theme.text}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'local' ? '#ffffff' : theme.text },
            ]}
          >
            Local
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'local' && (
        <TouchableOpacity
          style={[styles.syncButton, { backgroundColor: theme.primary }]}
          onPress={handleSync}
        >
          <Ionicons name="sync-outline" size={18} color="#ffffff" />
          <Text style={styles.syncButtonText}>Sync Pending Reports</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredReports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.subText }]}>
            {activeTab === 'uploaded'
              ? 'No uploaded reports found.'
              : 'No local pending reports found.'}
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
    fontSize: 30,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  syncButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    gap: 8,
  },
  syncButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});