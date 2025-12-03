import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../store/useAuth";

const API_URL = "http://192.168.60.243:3030/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      return Alert.alert("Error", "Harap isi semua kolom!");
    }

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!data.success) {
        return Alert.alert("Login gagal", data.message);
      }

      // Simpan user ke Zustand
      login(data.user);

      // Routing sesuai role dari backend
      switch (data.user.role) {
        case "admin":
          router.replace("/(admin)/(tabs)/dashboard-admin");
          break;
        case "dosen":
          router.replace("/(dosen)/(tabs)/dashboardDosen");
          break;
        case "mahasiswa":
          router.replace("/(mahasiswa)/(tabs)/dashboardMahasiswa");
          break;
        default:
          Alert.alert("Error", "Role tidak dikenal!");
      }

    } catch (error) {
      Alert.alert("Error", "Gagal terhubung ke server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Sistem</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Masuk</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});
