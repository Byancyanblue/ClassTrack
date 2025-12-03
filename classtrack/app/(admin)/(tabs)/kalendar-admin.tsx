import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";

const API_URL = "http://192.168.60.243:3000/api";

interface KalenderItem {
  id: number;
  tanggal: string;
  sesi: string;
  mataKuliah: string;
  ruang: string;
  semester: string;
}

export default function KalenderScreen() {
  const [selectedDate, setSelectedDate] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [jadwal, setJadwal] = useState<KalenderItem[]>([]);
  const [markedDates, setMarkedDates] = useState({});

  const sessionColors: any = {
    "Sesi 1": "#2563eb",
    "Sesi 2": "#059669",
    "Sesi 3": "#d97706",
    "Sesi 4": "#be185d",
  };

  useEffect(() => {
    fetch(`${API_URL}/admin/kalendar-admin/kalendar`)
      .then((res) => res.json())
      .then((data: KalenderItem[]) => {
        setJadwal(data);
        markCalendarDates(data);
      })
      .catch((err) => console.log("Error:", err));
  }, []);

  // === MARK TANGGAL DI KALENDER DENGAN MULTI DOT ===
  const markCalendarDates = (data: KalenderItem[]) => {
    const marks: any = {};

    data.forEach((item) => {
      if (!marks[item.tanggal]) {
        marks[item.tanggal] = { dots: [] };
      }

      marks[item.tanggal].dots.push({
        key: item.sesi,
        color: sessionColors[item.sesi] || "#2563eb",
      });
    });

    setMarkedDates(marks);
  };

  // === FILTER ===
  const filteredSchedules = jadwal.filter((item) => {
    if (selectedDate && item.tanggal !== selectedDate) return false;

    if (filter === "Semua") return true;

    if (filter.startsWith("Sesi") && item.sesi === filter) return true;

    if (filter === "Ganjil" && item.semester === "Ganjil") return true;
    if (filter === "Genap" && item.semester === "Genap") return true;

    return false;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>📅 Kalender Akademik</Text>
      <Text style={styles.subtitle}>Jadwal kuliah berdasarkan tanggal</Text>

      {/* Kalender */}
      <Calendar
        markingType={"multi-dot"}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            selected: true,
            selectedColor: "#1d4ed8",
            selectedTextColor: "#fff",
          },
        }}
        style={styles.calendar}
        theme={{
          todayTextColor: "#1d4ed8",
          arrowColor: "#1d4ed8",
          textDayFontWeight: "500",
          textMonthFontWeight: "700",
        }}
      />

      {/* FILTER */}
      <Text style={styles.filterTitle}>Filter Jadwal</Text>

      <View style={styles.filterContainer}>
        {["Semua", "Sesi 1", "Sesi 2", "Sesi 3", "Sesi 4", "Ganjil", "Genap"].map(
          (f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.activeFilter]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && { color: "#fff", fontWeight: "600" },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* LIST JADWAL */}
      <Text style={styles.sectionTitle}>📘 Jadwal Hari Ini</Text>

      {filteredSchedules.length > 0 ? (
        <FlatList
          data={filteredSchedules}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.mataKuliah}</Text>

              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: sessionColors[item.sesi] },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.sesi}</Text>
                </View>

                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        item.semester === "Ganjil" ? "#7c3aed" : "#0ea5e9",
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>{item.semester}</Text>
                </View>
              </View>

              <Text style={styles.cardInfo}>📍 Ruang: {item.ruang}</Text>
              <Text style={styles.cardDate}>🗓️ {item.tanggal}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>Tidak ada jadwal.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  subtitle: { fontSize: 15, color: "#475569", marginBottom: 16 },

  calendar: {
    borderRadius: 14,
    elevation: 2,
    backgroundColor: "#fff",
    paddingBottom: 10,
    marginBottom: 20,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1e293b",
  },

  filterContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#1d4ed8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: "#1d4ed8",
  },
  filterText: { color: "#1d4ed8", fontSize: 13 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1e293b",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },

  cardInfo: { fontSize: 14, color: "#475569", marginTop: 6 },
  cardDate: { fontSize: 14, marginTop: 4, color: "#334155" },

  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 12,
    fontStyle: "italic",
  },
});
