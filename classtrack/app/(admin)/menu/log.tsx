import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const API_URL = "http://192.168.60.243:3000/api";

// --- tipe data log (sesuaikan jika respons API berbeda) ---
interface LogItem {
  id?: number | string;
  aksi?: string | null;
  waktu?: string | number | null; // bisa ISO string atau timestamp
  [key: string]: any;
}

export default function LogScreen() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [filter, setFilter] = useState<
    | "Semua"
    | "Hari Ini"
    | "7 Hari Terakhir"
    | "Bulan Ini"
    | "Online"
    | "Offline"
    | "Diundur"
    | "Dibatalkan"
  >("Semua");

  useEffect(() => {
    fetch(`${API_URL}/admin/menu/log`)
      .then((res) => res.json())
      .then((data) => {
        // defensive: jika API mengembalikan object dengan field data: []
        if (Array.isArray(data)) setLogs(data);
        else if (Array.isArray(data.data)) setLogs(data.data);
        else setLogs([]);
      })
      .catch((err) => console.log("Error fetching logs:", err));
  }, []);

  // =============================
  // BADGE COLOR HANDLER
  // =============================
  const getBadgeColor = (aksi?: string | null) => {
    const lower = (aksi || "").toLowerCase();
    if (lower.includes("online")) return "#2563eb"; // biru
    if (lower.includes("offline")) return "#ea580c"; // oranye
    if (lower.includes("diundur")) return "#7c3aed"; // ungu
    if (lower.includes("batal")) return "#dc2626"; // merah
    if (lower.includes("sesuai")) return "#16a34a"; // hijau
    return "#475569"; // default abu
  };

  // =============================
  // FILTER HANDLER (defensive)
  // =============================
  const filterLogs = logs.filter((log) => {
    // jika tidak ada waktu, skip kecuali filter = Semua atau jenis aksi
    const rawWaktu = log.waktu;
    const waktu =
      rawWaktu === undefined || rawWaktu === null
        ? null
        : typeof rawWaktu === "number"
        ? new Date(rawWaktu)
        : new Date(String(rawWaktu));

    const now = new Date();

    if (filter === "Hari Ini") {
      if (!waktu) return false;
      return (
        waktu.getDate() === now.getDate() &&
        waktu.getMonth() === now.getMonth() &&
        waktu.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "7 Hari Terakhir") {
      if (!waktu) return false;
      const diffDays = (now.getTime() - waktu.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 7 && diffDays >= 0;
    }

    if (filter === "Bulan Ini") {
      if (!waktu) return false;
      return (
        waktu.getMonth() === now.getMonth() &&
        waktu.getFullYear() === now.getFullYear()
      );
    }

    const aksiLower = (log.aksi || "").toLowerCase();
    if (filter === "Online") return aksiLower.includes("online");
    if (filter === "Offline") return aksiLower.includes("offline");
    if (filter === "Dibatalkan") return aksiLower.includes("batal");
    if (filter === "Diundur") return aksiLower.includes("diundur");

    return true; // Semua
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
            onPress={() => setFilter(f as any)}
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
        filterLogs.map((item, idx) => {
          const aksiText = item.aksi ?? "—";
          const waktuText = item.waktu ? new Date(String(item.waktu)).toLocaleString() : "—";
          const key = item.id !== undefined && item.id !== null ? String(item.id) : `idx-${idx}`;

          // badge label: ambil kata pertama dari aksi, fallback '-'
          const badgeLabel = aksiText.split(" ")[0]?.toUpperCase() || "-";

          return (
            <View key={key} style={styles.logRow}>
              {/* BADGE */}
              <View style={[styles.badge, { backgroundColor: getBadgeColor(aksiText) }]}>
                <Text style={styles.badgeText}>{badgeLabel}</Text>
              </View>

              {/* TEXT */}
              <View style={{ flex: 1 }}>
                <Text style={styles.logAction}>{aksiText}</Text>
                <Text style={styles.logTime}>{waktuText}</Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },

  // FILTER BUTTONS
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    // gap is not widely supported in RN; use margin on items instead
    marginBottom: 16,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#2563eb",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  activeFilter: {
    backgroundColor: "#2563eb",
  },
  filterText: { color: "#2563eb", fontSize: 12 },

  // LOG ROW
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    gap: 12, // RN web may support gap; native may not — it's OK, kept for web
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
