import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ============================================
// CONFIG
// ============================================
const API_URL = "http://192.168.100.177:3030/api"; 
const ID_MAHASISWA = 1; // ID Dummy

// ============================================
// TYPES
// ============================================
interface JadwalKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  nama_dosen: string;
  nama_ruangan: string;
  jam_kuliah: string;
  hari: string;
  status_terbaru: string;
}

interface LogPerubahan {
  id: number;
  aksi: string;
  waktu_formatted: string;
  nama_mk: string;
}

interface MahasiswaProfile {
  nama: string;
  semester: number;
  prodi: string;
}

// ============================================
// COMPONENT
// ============================================
export default function DashboardMahasiswa() {
  // State UI
  const [selectedDay, setSelectedDay] = useState<string>("Senin");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>(""); 

  // State Data
  const [notifications, setNotifications] = useState<LogPerubahan[]>([]);
  const [schedule, setSchedule] = useState<JadwalKuliah[]>([]);
  const [student, setStudent] = useState<MahasiswaProfile | null>(null);

  // 1. Fetch Data
  const fetchDashboardData = async () => {
    try {
      // Fetch paralel agar cepat
      const [resJadwal, resNotif, resProfil] = await Promise.all([
        fetch(`${API_URL}/mahasiswa/${ID_MAHASISWA}/jadwal`),
        fetch(`${API_URL}/mahasiswa/${ID_MAHASISWA}/notifikasi`),
        fetch(`${API_URL}/mahasiswa/${ID_MAHASISWA}/profile`)
      ]);
      
      if (!resJadwal.ok) throw new Error("Gagal memuat jadwal");
      const dataJadwal = await resJadwal.json();
      setSchedule(dataJadwal);

      if (resNotif.ok) {
        const dataNotif = await resNotif.json();
        setNotifications(dataNotif);
      }

      if (resProfil.ok) {
        const dataProfil = await resProfil.json();
        setStudent(dataProfil);
      }

    } catch (error: any) {
      console.error("❌ Error Fetching:", error);
      Alert.alert("Gagal Memuat Data", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  }, []);

  // 2. Logika Filtering
  const filteredSchedule = schedule.filter((item) => {
    // Jika searching, abaikan hari
    if (searchText.length > 0) {
      const query = searchText.toLowerCase();
      return (
        item.nama_mk.toLowerCase().includes(query) ||      
        item.nama_dosen.toLowerCase().includes(query) ||   
        item.nama_ruangan.toLowerCase().includes(query)    
      );
    }
    // Jika tidak searching, filter by Hari
    return item.hari === selectedDay;
  });

  // Filter Notifikasi (Sembunyikan yang "Sesuai Jadwal")
  const importantNotifications = notifications.filter((item) => {
    const text = item.aksi.toLowerCase();
    return !text.includes("sesuai") && !text.includes("kembali mengikuti jadwal");
  });

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("online")) return "#3498db"; 
    if (s.includes("pindah") || s.includes("rubah") || s.includes("undur")) return "#f39c12"; 
    if (s.includes("tunda") || s.includes("batal")) return "#e74c3c"; 
    return "#2ecc71"; 
  };

  // 3. Render Components
  const renderNotificationCard = (item: LogPerubahan) => (
    <View key={item.id} style={styles.notifCard}>
      <View style={styles.notifHeader}>
        <View style={styles.notifBadge}>
          <Ionicons name="alert-circle" size={14} color="#fff" />
          <Text style={styles.notifBadgeText}>Perubahan</Text>
        </View>
        <Text style={styles.notifTime}>{item.waktu_formatted}</Text>
      </View>
      <Text style={styles.notifMk}>{item.nama_mk}</Text>
      <Text style={styles.notifAction}>{item.aksi}</Text>
    </View>
  );

  const renderJadwal = ({ item }: { item: JadwalKuliah }) => {
    const status = item.status_terbaru || "Sesuai Jadwal";
    const statusColor = getStatusColor(status);

    return (
      <View style={styles.card}>
        <View style={[styles.statusStrip, { backgroundColor: statusColor }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.mkCode}>{item.kode_mk}</Text>
            {searchText.length > 0 && (
                <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>{item.hari}</Text>
                </View>
            )}
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
          </View>
          <Text style={styles.mkName}>{item.nama_mk}</Text>
          <Text style={styles.dosenName}>👨‍🏫 {item.nama_dosen}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{item.jam_kuliah}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{item.nama_ruangan}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Sedang memuat data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* GREETING SECTION (Pengganti Header Lama) */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Halo, {student ? student.nama.split(" ")[0] : "Mahasiswa"}
          </Text>
          <Text style={styles.subtitle}>
            {student 
              ? `Semester ${student.semester} - ${student.prodi}` 
              : "Memuat info..."}
          </Text>
        </View>

        {/* NOTIFIKASI SECTION (Scroll Horizontal) */}
        {importantNotifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔔 Perubahan Jadwal</Text>
            <ScrollView 
              horizontal={true} 
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true} 
              contentContainerStyle={styles.notifScrollContent} 
            >
              {importantNotifications.map((item) => renderNotificationCard(item))}
            </ScrollView>
          </View>
        )}

        {/* SEARCH BAR */}
        <View style={[styles.section, { marginBottom: 10 }]}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#95a5a6" style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari Dosen, Matkul, atau Ruangan..."
                    placeholderTextColor="#95a5a6"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText("")}>
                        <Ionicons name="close-circle" size={20} color="#bdc3c7" />
                    </TouchableOpacity>
                )}
            </View>
        </View>

        {/* JADWAL SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
             {searchText.length > 0 ? "🔍 Hasil Pencarian" : "📅 Jadwal Perkuliahan"}
          </Text>
          
          {/* Selector Hari (Hilang saat searching) */}
          {searchText.length === 0 && (
            <View style={styles.daySelector}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {days.map((day) => (
                    <TouchableOpacity
                    key={day}
                    style={[styles.dayBtn, selectedDay === day && styles.dayBtnActive]}
                    onPress={() => setSelectedDay(day)}
                    >
                    <Text style={[styles.dayText, selectedDay === day && styles.dayTextActive]}>
                        {day}
                    </Text>
                    </TouchableOpacity>
                ))}
                </ScrollView>
            </View>
          )}

          {/* List Jadwal */}
          {filteredSchedule.length > 0 ? (
            filteredSchedule.map((item) => (
              <View key={item.id}>{renderJadwal({ item })}</View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name={searchText.length > 0 ? "search-outline" : "calendar-outline"} size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {searchText.length > 0 
                    ? `Tidak ditemukan "${searchText}"` 
                    : `Tidak ada jadwal di hari ${selectedDay}`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 30 },
  
  // Greeting Baru
  greetingContainer: { paddingHorizontal: 20, marginTop: 20, marginBottom: 10 },
  greeting: { fontSize: 24, fontWeight: "bold", color: "#2c3e50" },
  subtitle: { fontSize: 15, color: "#7f8c8d", marginTop: 2 },

  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#34495e", marginBottom: 15 },
  
  // Search
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e0e0e0", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: "#2c3e50" },

  // Selector
  daySelector: { flexDirection: "row", marginBottom: 15 },
  dayBtn: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: "#fff", borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: "#e0e0e0" },
  dayBtnActive: { backgroundColor: "#3498db", borderColor: "#3498db" },
  dayText: { color: "#7f8c8d", fontWeight: "600" },
  dayTextActive: { color: "#fff" },
  
  // Card
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2, elevation: 2, overflow: "hidden" },
  statusStrip: { width: 6, height: "100%" },
  cardContent: { flex: 1, padding: 15 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  mkCode: { fontSize: 12, fontWeight: "bold", color: "#95a5a6" },
  
  dayBadge: { backgroundColor: "#ecf0f1", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: "auto", marginLeft: 8 },
  dayBadgeText: { fontSize: 10, fontWeight: "bold", color: "#7f8c8d" },

  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: "bold" },
  mkName: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 4 },
  dosenName: { fontSize: 14, color: "#7f8c8d", marginBottom: 10 },
  metaContainer: { flexDirection: "row" },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 15, backgroundColor: "#f1f2f6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  metaText: { fontSize: 12, color: "#555", marginLeft: 5 },
  
  // Notifikasi
  notifScrollContent: { paddingRight: 20, paddingBottom: 10 },
  notifCard: { width: 300, backgroundColor: "#fff", borderRadius: 12, padding: 15, marginRight: 15, borderLeftWidth: 5, borderLeftColor: "#e74c3c", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  notifHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  notifBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#e74c3c", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  notifBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold", marginLeft: 4 },
  notifTime: { fontSize: 11, color: "#95a5a6" },
  notifMk: { fontSize: 14, fontWeight: "bold", color: "#2c3e50", marginBottom: 4 },
  notifAction: { fontSize: 13, color: "#555", lineHeight: 18 },

  emptyState: { alignItems: "center", padding: 30, backgroundColor: "#fff", borderRadius: 12 },
  emptyText: { marginTop: 10, color: "#95a5a6" },
});