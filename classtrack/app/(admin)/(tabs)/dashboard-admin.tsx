import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

  const API_URL = "http://192.168.164.243:3000/api";

interface NotifikasiItem {
  id: number;
  aksi: string;
  waktu: string;
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    ruangTerpakai: 0,
    jadwalAktif: 0,
    dosenAktif: 0,
    mataKuliah: 0,
  });

  const [notifikasi, setNotifikasi] = useState<NotifikasiItem[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/admin/dashboard-admin/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log("Error:", err));

    fetch(`${API_URL}/dashboard-admin/notifikasi`)
      .then((res) => res.json())
      .then((data) => setNotifikasi(data.data)) // backend kamu return { data: [...] }
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Admin</Text>

      {/* Statistik */}
      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: "#FF8C42" }]}>
          <Text style={styles.number}>{stats.ruangTerpakai}</Text>
          <Text style={styles.label}>Ruang Terpakai</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#2ED573" }]}>
          <Text style={styles.number}>{stats.jadwalAktif}</Text>
          <Text style={styles.label}>Jadwal Aktif</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#A55EEA" }]}>
          <Text style={styles.number}>{stats.dosenAktif}</Text>
          <Text style={styles.label}>Dosen Aktif</Text>
        </View>

        <View style={[styles.card, { backgroundColor: "#1E90FF" }]}>
          <Text style={styles.number}>{stats.mataKuliah}</Text>
          <Text style={styles.label}>Mata Kuliah</Text>
        </View>
      </View>

      {/* Notifikasi */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Notifikasi Perubahan
        </Text>

        {notifikasi.length === 0 ? (
          <Text style={{ color: "gray" }}>Belum ada perubahan terbaru.</Text>
        ) : (
          notifikasi.map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: "white",
                padding: 12,
                borderRadius: 10,
                marginBottom: 10,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 14 }}>{item.aksi}</Text>
              <Text style={{ fontSize: 12, color: "gray", marginTop: 4 }}>
                {new Date(item.waktu).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  number: { fontSize: 28, fontWeight: "bold", color: "white" },
  label: { fontSize: 14, color: "white" },
});
