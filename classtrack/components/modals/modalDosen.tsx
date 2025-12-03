import { useState } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet } from "react-native";

const API_URL = "http://192.168.60.243:3000/api/dosen";

interface ModalDosenProps {
  close: () => void;
  mode: "add" | "edit";
  data?: any;
  refresh: () => void;
}

export default function ModalDosen({ close, mode, data, refresh }: ModalDosenProps) {
  const [nama, setNama] = useState(data?.nama || "");
  const [email, setEmail] = useState(data?.email || "");
  const [NIP, setNIP] = useState(data?.NIP || "");
  const [kKeahlian, setKKeahlian] = useState(data?.k_keahlian || "");

  const submit = async () => {
    const body = { nama, email, NIP, k_keahlian: kKeahlian };

    await fetch(mode === "add" ? API_URL : `${API_URL}/${data.id}`, {
      method: mode === "add" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    refresh();
    close();
  };

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>
            {mode === "add" ? "Tambah Dosen" : "Edit Dosen"}
          </Text>

          <TextInput placeholder="Nama" value={nama} onChangeText={setNama} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="NIP" value={NIP} onChangeText={setNIP} style={styles.input} />
          <TextInput
            placeholder="Keahlian"
            value={kKeahlian}
            onChangeText={setKKeahlian}
            style={styles.input}
          />

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
  box: {
    width: "85%", backgroundColor: "white", padding: 20,
    borderRadius: 12,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1, borderColor: "#ddd", padding: 10,
    borderRadius: 8, marginBottom: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  btn: {
    padding: 10, borderRadius: 8, width: "48%", alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
});
