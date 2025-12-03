import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const API_URL = "http://192.168.60.243:3000/api";

interface ModalSesiProps {
  close: () => void;
  mode: "add" | "edit";
  data?: any;     // boleh diganti lebih spesifik
  refresh: () => void;
}

export default function ModalSesi({ close, mode, data, refresh } : ModalSesiProps) {
  const [nama, setNama] = useState(data?.nama_sesi || "");
  const [mulai, setMulai] = useState(data?.jam_mulai || "");
  const [selesai, setSelesai] = useState(data?.jam_selesai || "");

  const save = async () => {
    const body = {
      nama_sesi: nama,
      jam_mulai: mulai,
      jam_selesai: selesai,
    };

    if (mode === "edit") {
      await fetch(`${API_URL}/sesi/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
      await fetch(`${API_URL}/sesi`, {
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
            {mode === "edit" ? "Edit Sesi" : "Tambah Sesi"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nama Sesi"
            value={nama}
            onChangeText={setNama}
          />

          <TextInput
            style={styles.input}
            placeholder="Jam Mulai (07:30)"
            value={mulai}
            onChangeText={setMulai}
          />

          <TextInput
            style={styles.input}
            placeholder="Jam Selesai (09:30)"
            value={selesai}
            onChangeText={setSelesai}
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
  cancel: { marginRight: 10 },
  cancelText: { color: "red", fontWeight: "600" },
  save: { backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  saveText: { color: "white", fontWeight: "600" },
});
