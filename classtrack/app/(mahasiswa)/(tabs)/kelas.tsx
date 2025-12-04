import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// CONFIG
const API_URL = "http://192.168.60.243:3000/api";
const ID_MAHASISWA = 1;

// TYPES
interface KelasItem {
  id: number;
  kode_mk: string;
  nama_mk: string;
  nama_dosen: string;
  nama_ruangan: string;
  jam_kuliah: string;
  hari: string;
  status_terbaru: string;
}

export default function KelasScreen() {
  const [masterData, setMasterData] = useState<KelasItem[]>([]); // Data mentah dari API
  const [filteredData, setFilteredData] = useState<KelasItem[]>([]); // Data yang ditampilkan
  const [loading, setLoading] = useState(true);
  
  // State Filter & Search
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Semua");

  const days = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  // 1. Fetch Data Semua Kelas
  const fetchKelas = async () => {
    try {
      const response = await fetch(`${API_URL}/mahasiswa/${ID_MAHASISWA}/jadwal`);
      const data = await response.json();
      if (response.ok) {
        setMasterData(data);
        setFilteredData(data); // Awalnya tampilkan semua
      }
    } catch (error) {
      console.error("Error fetching kelas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelas();
  }, []);

  // 2. Logika Filter & Search Utama
  useEffect(() => {
    let result = masterData;

    // A. Filter Berdasarkan Hari
    if (selectedFilter !== "Semua") {
      result = result.filter((item) => item.hari === selectedFilter);
    }

    // B. Filter Berdasarkan Search Text (Nama MK, Dosen, atau Ruangan)
    if (searchText) {
      const query = searchText.toLowerCase();
      result = result.filter((item) => 
        item.nama_mk.toLowerCase().includes(query) ||
        item.nama_dosen.toLowerCase().includes(query) ||
        item.nama_ruangan.toLowerCase().includes(query) ||
        item.kode_mk.toLowerCase().includes(query)
      );
    }

    setFilteredData(result);
  }, [searchText, selectedFilter, masterData]);

  // Render Item Card Kelas
  const renderItem = ({ item }: { item: KelasItem }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.initialBox}>
            <Text style={styles.initialText}>{item.nama_mk.charAt(0)}</Text>
        </View>
      </View>
      
      <View style={styles.cardRight}>
        <View style={styles.headerRow}>
            <Text style={styles.kodeText}>{item.kode_mk}</Text>
            <View style={styles.dayBadge}>
                <Text style={styles.dayText}>{item.hari}</Text>
            </View>
        </View>
        
        <Text style={styles.mkText}>{item.nama_mk}</Text>
        <Text style={styles.dosenText}>👨‍🏫 {item.nama_dosen}</Text>
        
        <View style={styles.metaRow}>
            <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.jam_kuliah}</Text>
            </View>
            <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.nama_ruangan}</Text>
            </View>
        </View>
      </View>
    </View>
  );

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
      
      {/* Header Fixed */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Daftar Kelas</Text>
        
        {/* Search Bar */}
        <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#95a5a6" />
            <TextInput 
                style={styles.searchInput}
                placeholder="Cari Matkul, Dosen, Ruang..."
                value={searchText}
                onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                    <Ionicons name="close-circle" size={20} color="#ccc" />
                </TouchableOpacity>
            )}
        </View>

        {/* Filter Chips (Horizontal Scroll) */}
        <FlatList
            data={days}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.filterContainer}
            renderItem={({ item }) => (
                <TouchableOpacity 
                    style={[
                        styles.filterChip, 
                        selectedFilter === item && styles.filterChipActive
                    ]}
                    onPress={() => setSelectedFilter(item)}
                >
                    <Text style={[
                        styles.filterText, 
                        selectedFilter === item && styles.filterTextActive
                    ]}>
                        {item}
                    </Text>
                </TouchableOpacity>
            )}
        />
      </View>

      {/* List Kelas */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
            <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Kelas tidak ditemukan</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  // Header Styles
  headerContainer: { backgroundColor: "#fff", paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#eee", elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: "bold", padding: 20, color: "#2c3e50" },
  
  searchBox: { 
    flexDirection: "row", alignItems: "center", backgroundColor: "#f1f2f6", 
    marginHorizontal: 20, paddingHorizontal: 15, height: 45, borderRadius: 10 
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: "#333" },

  filterContainer: { paddingHorizontal: 20, marginTop: 15 },
  filterChip: { 
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, 
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#dfe6e9", marginRight: 10 
  },
  filterChipActive: { backgroundColor: "#3498db", borderColor: "#3498db" },
  filterText: { fontSize: 13, color: "#7f8c8d", fontWeight: "600" },
  filterTextActive: { color: "#fff" },

  // List Styles
  listContent: { padding: 20 },
  card: { 
    flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, padding: 15,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, elevation: 2
  },
  
  // Card Left (Icon/Initial)
  cardLeft: { justifyContent: "center", marginRight: 15 },
  initialBox: { 
    width: 50, height: 50, borderRadius: 12, backgroundColor: "#e8f4fd", 
    justifyContent: "center", alignItems: "center" 
  },
  initialText: { fontSize: 20, fontWeight: "bold", color: "#3498db" },

  // Card Right (Info)
  cardRight: { flex: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  kodeText: { fontSize: 12, fontWeight: "bold", color: "#95a5a6" },
  dayBadge: { backgroundColor: "#f1f2f6", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  dayText: { fontSize: 10, fontWeight: "bold", color: "#7f8c8d" },
  
  mkText: { fontSize: 16, fontWeight: "bold", color: "#2c3e50", marginBottom: 4 },
  dosenText: { fontSize: 13, color: "#7f8c8d", marginBottom: 10 },
  
  metaRow: { flexDirection: "row", alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  metaText: { fontSize: 12, color: "#555", marginLeft: 5 },

  emptyState: { alignItems: "center", marginTop: 80 },
  emptyText: { color: "#95a5a6", marginTop: 10 },
});