import { View, Text, StyleSheet, Image } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ℹ️ Tentang Aplikasi</Text>

      <Image
        source={{ uri: "https://i.imgur.com/6EajBRy.png" }}
        style={styles.logo}
      />

      <Text style={styles.appName}>ClassTrack</Text>
      <Text style={styles.version}>Versi 1.0.0</Text>

      <Text style={styles.desc}>
        Aplikasi manajemen jadwal perkuliahan yang dirancang untuk memudahkan
        admin, dosen, dan mahasiswa dalam mengelola informasi akademik.
      </Text>

      <Text style={styles.footer}>Dibuat oleh: Tuna Mayo ❤️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold", alignSelf: "flex-start" },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  appName: { fontSize: 20, fontWeight: "bold" },
  version: { color: "#64748b", marginBottom: 20 },
  desc: {
    fontSize: 15,
    textAlign: "center",
    color: "#475569",
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  footer: { fontSize: 14, color: "#64748b" },
});
