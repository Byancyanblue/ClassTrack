import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "http://192.168.60.243:3000/api";

/* ============================
   INTERFACES
============================ */
interface NotifikasiItem {
  id: number;
  aksi: string;
  waktu: string;
}

/* ============================
   DASHBOARD ADMIN
============================ */
export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    ruangTerpakai: 0,
    jadwalAktif: 0,
    dosenAktif: 0,
    mataKuliah: 0,
  });

  const [notifikasi, setNotifikasi] = useState<NotifikasiItem[]>([]);

  /* ============================
     BADGE COLORS
  ============================ */
  const getBadgeColor = (aksi = "") => {
    const lower = aksi.toLowerCase();

    if (lower.includes("online")) return "#2563eb";
    if (lower.includes("offline")) return "#ea580c";
    if (lower.includes("diundur")) return "#7c3aed";
    if (lower.includes("batal") || lower.includes("delete")) return "#dc2626";
    if (lower.includes("sesuai")) return "#16a34a";

    return "#475569"; // default slate
  };

  /* ============================
     BADGE LABEL
  ============================ */
  const getBadgeLabel = (aksi = "") => {
    const lower = aksi.toLowerCase();

    if (lower.includes("online")) return "Online";
    if (lower.includes("offline")) return "Offline";
    if (lower.includes("diundur")) return "Diundur";
    if (lower.includes("batal") || lower.includes("delete")) return "Dibatalkan";
    if (lower.includes("sesuai")) return "Normal";

    return "Info";
  };

  /* ============================
     NOTIFICATION ICON
  ============================ */
  const getIconName = (aksi = "") => {
    const lower = aksi.toLowerCase();

    if (lower.includes("online")) return "wifi";
    if (lower.includes("offline")) return "power";
    if (lower.includes("diundur")) return "time-outline";
    if (lower.includes("batal")) return "close-circle";
    if (lower.includes("delete")) return "trash-outline";

    return "information-circle";
  };

  /* ============================
     TITLE GENERATOR
  ============================ */
  const generateTitle = (aksi: string) => {
    const lower = aksi.toLowerCase();

    if (lower.includes("online")) return "Status Kuliah Menjadi Online";
    if (lower.includes("offline")) return "Status Kuliah Menjadi Offline";
    if (lower.includes("diundur")) return "Jadwal Diundur";
    if (lower.includes("batal")) return "Jadwal Dibatalkan";
    
    return "Perubahan Jadwal";
  };

  /* ============================
     FORMAT WAKTU
  ============================ */
  const formatTime = (dateString: string) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ============================
     FETCH DATA
  ============================ */
  useEffect(() => {
    fetch(`${API_URL}/admin/dashboard-admin/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setNotifikasi(data.notifikasi || []);
      })
      .catch((err) => console.log("Fetch Dashboard Error:", err));
  }, []);

  /* ============================
     RENDER UI
  ============================ */
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, Admin</Text>

      {/* Statistik */}
      <View style={styles.grid}>
        <StatCard color="#FF8C42" number={stats.ruangTerpakai} label="Ruang Terpakai" />
        <StatCard color="#2ED573" number={stats.jadwalAktif} label="Jadwal Aktif" />
        <StatCard color="#A55EEA" number={stats.dosenAktif} label="Dosen Aktif" />
        <StatCard color="#1E90FF" number={stats.mataKuliah} label="Mata Kuliah" />
      </View>

      {/* Notifikasi */}
      <View style={{ marginTop: 24 }}>
        <Text style={styles.sectionTitle}>Notifikasi Perubahan</Text>

        {notifikasi.length === 0 ? (
          <Text style={{ color: "gray", marginTop: 10 }}>
            Belum ada perubahan terbaru.
          </Text>
        ) : (
          notifikasi.map((item) => {
            const badgeColor = getBadgeColor(item.aksi);
            const badgeLabel = getBadgeLabel(item.aksi);
            const iconName = getIconName(item.aksi);

            return (
              <View key={item.id} style={[styles.notifCard, { borderLeftColor: badgeColor }]}>
                {/* Icon */}
                <Ionicons name={iconName as any} size={26} color={badgeColor} style={{ marginTop: 2 }} />

                {/* Text */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>{generateTitle(item.aksi)}</Text>

                  <Text style={styles.notifDetail}>{item.aksi}</Text>

                  <Text style={styles.notifTime}>{formatTime(item.waktu)}</Text>
                </View>

                {/* Badge */}
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                  <Text style={styles.badgeText}>{badgeLabel}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

/* ============================
   STAT CARD (REUSABLE)
============================ */
function StatCard({ color, number, label }: any) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

/* ============================
   STYLES
============================ */
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },

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

  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },

  notifCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 14,
    borderLeftWidth: 3,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },

  notifTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  notifDetail: { fontSize: 13, color: "#475569", marginTop: 4 },
  notifTime: { fontSize: 12, color: "#94a3b8", marginTop: 6 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
});
