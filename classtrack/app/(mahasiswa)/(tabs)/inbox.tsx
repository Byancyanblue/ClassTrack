import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.100.177:3030/api";
const ID_MAHASISWA = 1;

// Tipe data sesuai dengan respon backend baru
interface InboxItem {
  id: number;
  mata_kuliah: string;
  pesan: string;
  detail_jadwal: string;
  waktu_log: string;
  icon: any; // Nama icon ionicons
  color: string;
}

export default function InboxScreen() {
  const [inboxData, setInboxData] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInbox = async () => {
    try {
      const response = await fetch(`${API_URL}/mahasiswa/${ID_MAHASISWA}/inbox`);
      const data = await response.json();
      if (response.ok) {
        setInboxData(data);
      }
    } catch (error) {
      console.error("Error fetching inbox:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchInbox();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: InboxItem }) => {
    return (
      <View style={styles.logContainer}>
        {/* Garis Waktu (Timeline Line) */}
        <View style={styles.timelineContainer}>
           <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
           <View style={styles.timelineLine} />
        </View>

        {/* Konten Card */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={[styles.iconBox, { backgroundColor: item.color + "20" }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View style={styles.headerText}>
                <Text style={styles.mkTitle}>{item.mata_kuliah}</Text>
                <Text style={styles.scheduleDetail}>{item.detail_jadwal}</Text>
            </View>
            <Text style={styles.timeLog}>{item.waktu_log}</Text>
          </View>
          
          <View style={styles.messageBox}>
             <Text style={styles.messageText}>{item.pesan}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perubahan Jadwal</Text>
      </View>
      
      <FlatList
        data={inboxData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Tidak ada perubahan jadwal terbaru.</Text>
            <Text style={styles.emptySubText}>Jadwal Anda berjalan sesuai rencana.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" }, // Background sedikit abu terang
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  header: {
    padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee",
    alignItems: "center", elevation: 2
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#2c3e50" },
  
  listContent: { padding: 20, paddingBottom: 40 },

  // Layout per Item (Timeline style)
  logContainer: { flexDirection: "row", marginBottom: 0 },
  
  timelineContainer: { alignItems: "center", marginRight: 15, width: 20 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 18, zIndex: 2 },
  timelineLine: { flex: 1, width: 2, backgroundColor: "#e0e0e0", marginTop: -5, marginBottom: -10, zIndex: 1 },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    // Shadow lembut
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    borderWidth: 1, borderColor: "#f0f0f0"
  },

  headerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  
  headerText: { flex: 1 },
  mkTitle: { fontSize: 15, fontWeight: "bold", color: "#2c3e50", marginBottom: 2 },
  scheduleDetail: { fontSize: 12, color: "#7f8c8d" },
  
  timeLog: { fontSize: 10, color: "#bdc3c7", fontWeight: "600" },

  messageBox: { 
    backgroundColor: "#fafafa", 
    padding: 10, 
    borderRadius: 8, 
    borderLeftWidth: 3, 
    borderLeftColor: "#eee" 
  },
  messageText: { fontSize: 13, color: "#555", lineHeight: 18 },

  // Empty State
  emptyState: { alignItems: "center", marginTop: 100 },
  emptyText: { color: "#34495e", fontSize: 16, fontWeight: "bold", marginTop: 15 },
  emptySubText: { color: "#95a5a6", fontSize: 14, marginTop: 5 },
});