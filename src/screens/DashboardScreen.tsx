import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { watchBattery, getBatteryLevel } from "../services/batteryService";
import { getUserHazardReports } from "../services/hazardService";
import { getAddressFromCoordinates } from "../services/locationService";

type HazardReport = {
  id: string;
  hazardType: string;
  severity: string;
  description: string;
  latitude: number;
  longitude: number;
  photoUrl?: string;
  source?: string;
  reportedBy?: string;
  userEmail?: string;
  createdAt: any;
};

export default function DashboardScreen({ navigation }: any) {
  const { theme } = useTheme();

  const [reports, setReports] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addresses, setAddresses] = useState<Record<string, string>>({});
  const [battery, setBattery] = useState<number>(1);
  const [isLow, setIsLow] = useState<boolean>(false);

  useEffect(() => {
    // 1. Get the level once when the screen first mounts
    getBatteryLevel().then((level) => {
      setBattery(level);
      setIsLow(level < 0.50);
    });

    // 2. Subscribe to live changes
    const unsubscribe = watchBattery(
      (level) => {
        setBattery(level);
        setIsLow(level < 0.50); // update isLow every time, both directions
      },
      (low) => {
        console.log("Battery low — pausing background sync", low);
      },
    );

    // 3. Clean up when the screen unmounts
    return unsubscribe;
  }, []);

  useEffect(() => {
    loadReports();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "#dc2626";
      case "medium":
        return "#f59e0b";
      default:
        return "#16a34a";
    }
  };

  const loadReports = async () => {
    try {
      const data = (await getUserHazardReports()) as HazardReport[];

      setReports(data);

      const addressMap: Record<string, string> = {};

      for (const report of data) {
        try {
          addressMap[report.id] = await getAddressFromCoordinates(
            report.latitude,
            report.longitude,
          );
        } catch {
          addressMap[report.id] = "Unknown Location";
        }
      }

      setAddresses(addressMap);
    } catch (error) {
      console.log("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: HazardReport }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
      ]}
      activeOpacity={0.85}
      onPress={() => navigation.navigate("HazardDetail", { report: item })}
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

        <View style={{ marginLeft: 6 }}>
          <Text style={[styles.metaText, { color: theme.text }]}>
            {addresses[item.id] || "Loading location..."} (
            {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)})
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="person-outline" size={16} color={theme.subText} />
        <Text style={[styles.metaText, { color: theme.subText }]}>
          Reported by: {item.reportedBy || item.userEmail || "Unknown user"}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={16} color={theme.subText} />
        <Text style={[styles.metaText, { color: theme.subText }]}>
          {item.createdAt?.toDate
            ? (() => {
                const date = item.createdAt.toDate();
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();

                let hours = date.getHours();
                const minutes = String(date.getMinutes()).padStart(2, "0");
                const ampm = hours >= 12 ? "PM" : "AM";

                hours = hours % 12;
                hours = hours ? hours : 12;

                return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
              })()
            : "Time unavailable"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.text }]}>
          Road Hazard Feed
        </Text>

        <View style={styles.batteryPill}>
          <Ionicons
            name={isLow ? "battery-dead" : "battery-half"}
            size={16}
            color={isLow ? "#dc2626" : theme.subText}
          />
          <Text
            style={[
              styles.batteryText,
              { color: isLow ? "#dc2626" : theme.subText },
            ]}
          >
            {Math.round(battery * 100)}%
          </Text>
        </View>
      </View>

      <Text style={[styles.subHeader, { color: theme.subText }]}>
        Community-reported hazards near road users
      </Text>

      {isLow && (
        <View style={styles.lowBatteryBanner}>
          <Ionicons name="warning-outline" size={16} color="#dc2626" />
          <Text style={styles.lowBatteryText}>
            Low battery — background sync paused
          </Text>
        </View>
      )}

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.subText }]}>
            No hazard reports found.
          </Text>
        }
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate("Report")}
      >
        <Ionicons name="add-outline" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 22,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginRight: 12,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 11,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  metaText: {
    marginLeft: 6,
    fontSize: 13,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  batteryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  batteryText: {
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  lowBatteryBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  lowBatteryText: {
    marginLeft: 6,
    color: "#dc2626",
    fontSize: 13,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 25,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
