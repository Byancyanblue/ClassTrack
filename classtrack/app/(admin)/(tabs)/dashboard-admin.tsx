import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView  } from "react-native";

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
      .then((data) => {
        setStats(data);
        setNotifikasi(data.notifikasi);
      });
  }, []);

  const getBadgeStyle = (aksi: string) => {
    const lower = aksi.toLowerCase();

    if (lower.includes("online"))
      return { bg: "#2ED573", text: "Online" };

    if (lower.includes("offline"))
      return { bg: "#FF4757", text: "Offline" };

    if (lower.includes("hapus") || lower.includes("delete"))
      return { bg: "#A4B0BE", text: "Deleted" };

    if (lower.includes("diundur"))
      return { bg: "#FFA502", text: "Diundur" };

    if (lower.includes("sesuai jadwal"))
      return { bg: "#8854D0", text: "Normal" };

    if (lower.includes("perbarui") || lower.includes("update"))
      return { bg: "#1E90FF", text: "Updated" };

    return { bg: "#57606F", text: "Info" };
  };


  return (
    <ScrollView style={styles.container}>
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
          notifikasi.map((item) => {
            const badge = getBadgeStyle(item.aksi);

            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: "white",
                  padding: 14,
                  borderRadius: 14,
                  marginBottom: 12,
                  elevation: 3,
                  borderLeftWidth: 6,
                  borderLeftColor: badge.bg,
                }}
              >
                {/* Badge */}
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: badge.bg,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>
                    {badge.text}
                  </Text>
                </View>

                {/* Aksi */}
                <Text style={{ fontSize: 14, fontWeight: "600" }}>{item.aksi}</Text>

                {/* Waktu */}
                <Text style={{ fontSize: 12, color: "gray", marginTop: 6 }}>
                  {item.waktu
                    ? new Date(item.waktu).toLocaleString()
                    : "-"}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
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
