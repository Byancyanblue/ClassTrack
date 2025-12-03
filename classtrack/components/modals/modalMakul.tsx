import { useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from "react-native";

const API_URL = "http://192.168.60.243:3000/api/makul";

// ------- Tambah Type Props ------
interface ModalMakulProps {
  close: () => void;
  mode: "add" | "edit";
  data?: any;     // boleh diganti lebih spesifik
  refresh: () => void;
}

export default function ModalMakul({ close, mode, data, refresh }: ModalMakulProps) {
  const [kode, setKode] = useState(data?.kode_mk || "");
  const [nama, setNama] = useState(data?.nama_mk || "");
  const [sks, setSks] = useState(String(data?.sks || "3"));
  const [semester, setSemester] = useState(String(data?.semester || "1"));

  const submit = async () => {
    await fetch(mode === "add" ? API_URL : `${API_URL}/${data.id}`, {
      method: mode === "add" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kode_mk: kode,
        nama_mk: nama,
        sks: Number(sks),
        semester: Number(semester),
      }),
    });
    refresh();
    close();
  };

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>
            {mode === "add" ? "Tambah Mata Kuliah" : "Edit Mata Kuliah"}
          </Text>

          <TextInput placeholder="Kode MK" value={kode} onChangeText={setKode} style={styles.input} />
          <TextInput placeholder="Nama MK" value={nama} onChangeText={setNama} style={styles.input} />
          <TextInput placeholder="SKS" value={sks} onChangeText={setSks} style={styles.input} keyboardType="numeric" />
          <TextInput placeholder="Semester" value={semester} onChangeText={setSemester} style={styles.input} keyboardType="numeric" />

          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "#dc2626" }]} onPress={close}>
              <Text style={styles.btnText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, { backgroundColor: "#2563eb" }]} onPress={submit}>
              <Text style={styles.btnText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  box: { width: "85%", backgroundColor: "white", padding: 20, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: { padding: 10, borderRadius: 8, width: "48%", alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold" },
});
