import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  ActivityIndicator, Image, Alert, ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// CONFIG
const API_URL = "http://192.168.60.243:3000/api";
const ID_MAHASISWA = 1; // ID Dummy

interface MahasiswaData {
  nama: string;
  NIM: string;
  email: string;
  prodi: string;
  semester: number;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [student, setStudent] = useState<MahasiswaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/mahasiswa/${ID_MAHASISWA}/profile`);
      if (!response.ok) throw new Error("Gagal mengambil data");
      const data = await response.json();
      setStudent(data);
    } catch (error) {
      Alert.alert("Error", "Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* HEADER & AVATAR */}
        <View style={styles.headerContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>
          <Text style={styles.nameText}>{student?.nama}</Text>
          <Text style={styles.nimText}>{student?.NIM}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Mahasiswa Aktif</Text>
          </View>
        </View>

        {/* INFO SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Akademik</Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={24} color="#7f8c8d" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Program Studi</Text>
              <Text style={styles.value}>{student?.prodi}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={24} color="#7f8c8d" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Semester</Text>
              <Text style={styles.value}>{student?.semester}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={24} color="#7f8c8d" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{student?.email}</Text>
            </View>
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { paddingBottom: 40 },
  
  headerContainer: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#3498db",
    justifyContent: "center", alignItems: "center",
    marginBottom: 15,
    borderWidth: 4, borderColor: "#e1e8ed"
  },
  nameText: { fontSize: 22, fontWeight: "bold", color: "#2c3e50" },
  nimText: { fontSize: 16, color: "#7f8c8d", marginTop: 4 },
  badge: {
    marginTop: 10, paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: "#2ecc71", borderRadius: 15
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20, marginBottom: 20,
    borderRadius: 12, padding: 15,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  sectionTitle: {
    fontSize: 16, fontWeight: "700", color: "#34495e", marginBottom: 15
  },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  infoTextContainer: { marginLeft: 15 },
  label: { fontSize: 12, color: "#95a5a6" },
  value: { fontSize: 16, color: "#2c3e50", fontWeight: "500" },
  separator: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 8 },

  actionBtn: { 
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  actionText: { fontSize: 16, color: "#333" },

  logoutBtn: {
    marginHorizontal: 20,
    backgroundColor: "#ffebee",
    padding: 15, borderRadius: 12,
    alignItems: "center",
    borderWidth: 1, borderColor: "#ffcdd2"
  },
  logoutText: { color: "#e74c3c", fontWeight: "bold", fontSize: 16 },
});