import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const API_URL = "http://192.168.60.243:3000/api";

// =============================
// LOG TYPE
// =============================
interface LogItem {
  id: number;
  aksi: string;
  waktu: string;
}

export default function LogScreen() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    fetch(`${API_URL}/admin/menu/log`)
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.log("Error:", err));
  }, []);

  // =============================
  // BADGE COLOR HANDLER
  // =============================
  const getBadgeColor = (aksi: string) => {
    const lower = aksi.toLowerCase();
    if (lower.includes("online")) return "#2563eb";
    if (lower.includes("offline")) return "#ea580c";
    if (lower.includes("diundur")) return "#7c3aed";
    if (lower.includes("batal")) return "#dc2626";
    if (lower.includes("sesuai")) return "#16a34a";
    return "#475569";
  };

  // =============================
  // FILTER HANDLER
  // =============================
  const filterLogs = logs.filter((log: LogItem) => {
    const waktu = new Date(log.waktu);
    const now = new Date();

    if (filter === "Hari Ini") {
      return (
        waktu.getDate() === now.getDate() &&
        waktu.getMonth() === now.getMonth() &&
        waktu.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "7 Hari Terakhir") {
      const diff = (Number(now) - Number(waktu)) / (1000 * 3600 * 24);
      return diff <= 7;
    }

    if (filter === "Bulan Ini") {
      return (
        waktu.getMonth() === now.getMonth() &&
        waktu.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "Online") return log.aksi.toLowerCase().includes("online");
    if (filter === "Offline") return log.aksi.toLowerCase().includes("offline");
    if (filter === "Dibatalkan") return log.aksi.toLowerCase().includes("batal");
    if (filter === "Diundur") return log.aksi.toLowerCase().includes("diundur");

    return true;
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📝 Log Perubahan</Text>

      {/* FILTER BUTTONS */}
      <View style={styles.filterRow}>
        {[
          "Semua",
          "Hari Ini",
          "7 Hari Terakhir",
          "Bulan Ini",
          "Online",
          "Offline",
          "Diundur",
          "Dibatalkan",
        ].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.activeFilter]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && { color: "#fff", fontWeight: "bold" },
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LOG LIST */}
      {filterLogs.length === 0 ? (
        <Text style={styles.empty}>Tidak ada log untuk filter ini.</Text>
      ) : (
        filterLogs.map((item: LogItem) => (
          <View key={item.id} style={styles.logRow}>
            {/* BADGE */}
            <View
              style={[
                styles.badge,
                { backgroundColor: getBadgeColor(item.aksi) },
              ]}
            >
              <Text style={styles.badgeText}>
                {item.aksi.split(" ")[0].toUpperCase()}
              </Text>
            </View>

            {/* TEXT */}
            <View style={{ flex: 1 }}>
              <Text style={styles.logAction}>{item.aksi}</Text>
              <Text style={styles.logTime}>
                {new Date(item.waktu).toLocaleString()}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: "#2563eb",
  },
  filterText: { color: "#2563eb", fontSize: 12 },

  logRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 12,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  logAction: { fontSize: 15, fontWeight: "500", color: "#334155" },
  logTime: { fontSize: 12, color: "#64748b" },

  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#64748b",
  },
});
