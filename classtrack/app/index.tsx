import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo atau ilustrasi  */}
      <Image
        source={require("../assets/images/splash-icon.png")} // opsional, bisa diganti
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>ClassTrack</Text>

      <Text style={styles.subtitle}>
        Sistem Monitoring Jadwal Perkuliahan untuk Admin, Dosen, dan Mahasiswa.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Mulai</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© 2025 ClassTrack</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    fontSize: 13,
    color: "#aaa",
  },
});
