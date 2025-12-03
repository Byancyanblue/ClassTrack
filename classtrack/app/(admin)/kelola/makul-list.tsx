import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ModalMakul from "../../../components/modals/modalMakul";

const API_URL = "http://192.168.60.243:3000/api";

export default function MakulList() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<any | null>(null);

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/makul`);
    setData(await res.json());
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API_URL}/makul/${id}`, { method: "DELETE" });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>

      {/* 🔵 ADD BUTTON */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setMode("add");
          setSelected(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addBtnText}>+ Tambah Mata Kuliah</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Mata Kuliah</Text>
            <Text style={styles.value}>{item.nama_mk}</Text>

            <Text style={styles.label}>Kode MK</Text>
            <Text style={styles.value}>{item.kode_mk}</Text>

            <Text style={styles.label}>SKS</Text>
            <Text style={styles.value}>{item.sks}</Text>

            {item.kelompok_ahli && (
              <>
                <Text style={styles.label}>Kelompok Keahlian</Text>
                <Text style={styles.value}>{item.kelompok_ahli}</Text>
              </>
            )}

            {/* ACTION BUTTONS */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
                onPress={() => {
                  setMode("edit");
                  setSelected(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={styles.actionText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL */}
      {modalVisible && (
        <ModalMakul
          close={() => setModalVisible(false)}
          mode={mode}
          data={selected}
          refresh={fetchData}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  addBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    marginBottom: 18,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  label: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
