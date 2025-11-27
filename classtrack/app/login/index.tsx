// app/login/index.tsx
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

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"admin" | "dosen" | "mahasiswa">("mahasiswa");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Harap isi semua kolom!");
      return;
    }

    // Simpan user ke store Zustand
    login({ username, role });

    // Routing sesuai peran
    if (role === "admin")
      router.replace("/(admin)/(tabs)/dashboard-admin");
    else if (role === "dosen")
      router.replace("/(dosen)/(tabs)/dashboardDosen");
    else
      router.replace("/(mahasiswa)/(tabs)/dashboardMahasiswa");
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

      <TextInput
        placeholder="Role (admin/dosen/mahasiswa)"
        value={role}
        onChangeText={(value) =>
          setRole(value as "admin" | "dosen" | "mahasiswa")
        }
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
