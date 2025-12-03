import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import ModalSesi from "../../../components/modals/modalSesi";

const API_URL = "http://192.168.60.243:3000/api";

export default function SesiList() {
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<any | null>(null);

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/sesi`);
    setData(await res.json());
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API_URL}/sesi/${id}`, { method: "DELETE" });
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
        <Text style={styles.addBtnText}>+ Tambah Sesi</Text>
      </TouchableOpacity>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Nama Sesi</Text>
            <Text style={styles.value}>{item.nama_sesi}</Text>

            <Text style={styles.label}>Jam Mulai</Text>
            <Text style={styles.value}>{item.jam_mulai}</Text>

            <Text style={styles.label}>Jam Selesai</Text>
            <Text style={styles.value}>{item.jam_selesai}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#2563eb" }]}
                onPress={() => {
                  setMode("edit");
                  setSelected(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: "#dc2626" }]}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={styles.btnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL */}
      {modalVisible && (
        <ModalSesi
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
    marginTop: 12,
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
