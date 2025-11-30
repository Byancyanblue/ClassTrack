import { View, Text, StyleSheet, Switch } from "react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Pengaturan</Text>

      {/* Notifikasi */}
      <View style={styles.item}>
        <Text style={styles.label}>Notifikasi Perubahan</Text>
        <Switch
          value={notifEnabled}
          onValueChange={setNotifEnabled}
          trackColor={{ false: "#cbd5e1", true: "#2563eb" }}
        />
      </View>

      {/* Tema App */}
      <View style={styles.item}>
        <Text style={styles.label}>Tema Gelap</Text>
        <Switch trackColor={{ false: "#cbd5e1", true: "#2563eb" }} />
      </View>

      {/* Bahasa */}
      <View style={styles.item}>
        <Text style={styles.label}>Bahasa</Text>
        <Text style={styles.value}>Indonesia</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  item: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: { fontSize: 16, fontWeight: "500" },
  value: { fontSize: 16, color: "#475569" },
});
