import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const API_URL = "http://192.168.164.243:3000/api";

export default function ModalRuangan({ close, mode, data, refresh }) {
  const [nama, setNama] = useState(data?.nama_ruangan || "");
  const [kapasitas, setKapasitas] = useState(String(data?.kapasitas || ""));

  const save = async () => {
    const body = {
      nama_ruangan: nama,
      kapasitas: Number(kapasitas),
    };

    if (mode === "edit") {
      await fetch(`${API_URL}/ruangan/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_URL}/ruangan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    refresh();
    close();
  };

  return (
    <Modal transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {mode === "edit" ? "Edit Ruangan" : "Tambah Ruangan"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nama Ruangan"
            value={nama}
            onChangeText={setNama}
          />
          <TextInput
            style={styles.input}
            placeholder="Kapasitas"
            keyboardType="numeric"
            value={kapasitas}
            onChangeText={setKapasitas}
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancel} onPress={close}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={save}>
              <Text style={styles.saveText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#0005",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 14 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancel: { marginRight: 10, backgroundColor: "#eb2525ff", padding: 10, borderRadius: 8 },
  cancelText: { color: "white", fontWeight: "600" },
  save: { backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  saveText: { color: "white", fontWeight: "600" },
});
