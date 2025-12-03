import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const API_URL = "http://192.168.60.243:3000/api";

// 🔥 DEFINISIKAN TYPE USER
type User = {
  id: number;
  username: string;
  role: string;
};

export default function UserScreen() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    fetch(`${API_URL}/admin/menu/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.log("Error:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Manajemen User</Text>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addText}>+ Tambah User</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.role}>{item.role}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteBtn}>
                <Text style={styles.btnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  addButton: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  addText: { color: "white", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  role: { fontSize: 14, color: "#64748b" },

  editBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnText: { color: "white", fontWeight: "600" },
});
