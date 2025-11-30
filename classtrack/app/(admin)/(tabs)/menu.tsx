import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MenuScreen() {
  const router = useRouter();

  const MenuItem = ({ icon, title, route }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(route)}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={22} color="#2563eb" />
        <Text style={styles.itemText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Menu</Text>

      {/* Section: Data & Sistem */}
      <Text style={styles.sectionTitle}>Sistem</Text>

      <MenuItem
        icon="time-outline"
        title="Log Perubahan Jadwal"
        route="/menu/log"
      />

      <MenuItem
        icon="people-outline"
        title="User"
        route="/menu/users"
      />

      <MenuItem
        icon="settings-outline"
        title="Pengaturan"
        route="/menu/settings"
      />

      <MenuItem
        icon="information-circle-outline"
        title="Tentang Aplikasi"
        route="/menu/about"
      />

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#1e3a8a" },

  sectionTitle: {
    marginBottom: 12,
    marginTop: 14,
    fontSize: 14,
    color: "#475569",
    fontWeight: "bold",
  },

  item: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemText: { fontSize: 16, color: "#1e293b", fontWeight: "500" },

  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: { color: "white", fontSize: 16, fontWeight: "600" },
});
