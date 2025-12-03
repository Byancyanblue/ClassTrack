import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ModalJadwal from "../../../components/modals/modalJadwal";

const API_URL = "http://192.168.60.243:3000/api";

export default function JadwalList() {
  const [data, setData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<any | null>(null);

  const fetchData = async () => {
    const res = await fetch(`${API_URL}/jadwal`);
    setData(await res.json());
  };

  const deleteItem = async (id: number) => {
    await fetch(`${API_URL}/jadwal/${id}`, { method: "DELETE" });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Tombol Tambah */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setMode("add");
          setSelected(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addBtnText}>+ Tambah Jadwal</Text>
      </TouchableOpacity>

      {/* GRID LIST */}
      <View style={styles.grid}>
        {data.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.label}>Hari</Text>
            <Text style={styles.value}>{item.hari}</Text>

            <Text style={styles.label}>Sesi</Text>
            <Text style={styles.value}>{item.sesi}</Text>

            <Text style={styles.label}>Mata Kuliah</Text>
            <Text style={styles.value}>{item.mataKuliah}</Text>

            <Text style={styles.label}>Kode MK</Text>
            <Text style={styles.value}>{item.kode_mk}</Text>

            <Text style={styles.label}>Dosen Pengampu</Text>
            <Text style={styles.value}>{item.dosen}</Text>

            <Text style={styles.label}>Ruangan</Text>
            <Text style={styles.value}>{item.ruang}</Text>

            {/* Tombol Edit & Hapus */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[styles.btn, styles.btnEdit]}
                onPress={() => {
                  setMode("edit");
                  setSelected(item);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.btnDelete]}
                onPress={() => deleteItem(item.id)}
              >
                <Text style={styles.btnText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* MODAL */}
      {modalVisible && (
        <ModalJadwal
          close={() => setModalVisible(false)}
          mode={mode}
          data={selected}
          refresh={fetchData}
        />
      )}
    </ScrollView>
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
    borderRadius: 10,
    marginBottom: 18,
  },
  addBtnText: {
    color: "white",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 16,
  },

  // GRID
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  // CARD
  card: {
    width: "100%",
    backgroundColor: "#f8fafc",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 4,
  },

  value: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "700",
    marginBottom: 6,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 8,
  },

  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnEdit: {
    backgroundColor: "#2563eb",
  },
  btnDelete: {
    backgroundColor: "#dc2626",
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
    fontSize: 13,
  },
});
