import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://192.168.164.243:3000/api";

export default function ModalJadwal({ close, mode, data, refresh }) {
  const [form, setForm] = useState({
    id_makul: data?.id_makul || "",
    id_dosen: data?.id_dosen || "",
    id_ruangan: data?.id_ruangan || "",
    id_sesi: data?.id_sesi || "",
    hari: data?.hari || "",
    semester: data?.semester || "",
    tahun_ajaran: data?.tahun_ajaran || "2024/2025",
  });

  const [makul, setMakul] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [sesi, setSesi] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/makul`).then((r) => r.json()).then(setMakul);
    fetch(`${API_URL}/dosen`).then((r) => r.json()).then(setDosen);
    fetch(`${API_URL}/ruangan`).then((r) => r.json()).then(setRuangan);
    fetch(`${API_URL}/sesi`).then((r) => r.json()).then(setSesi);
  }, []);

  const update = (key, value) => setForm({ ...form, [key]: value });

  const save = async () => {
    if (mode === "edit") {
      await fetch(`${API_URL}/jadwal/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`${API_URL}/jadwal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    refresh();
    close();
  };

  return (
    <Modal transparent animationType="slide">
      <ScrollView contentContainerStyle={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {mode === "edit" ? "Edit Jadwal" : "Tambah Jadwal"}
          </Text>

          {/* Dropdown Makul */}
          <Text style={styles.label}>Mata Kuliah</Text>
          <Picker
            selectedValue={form.id_makul}
            onValueChange={(v) => update("id_makul", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Mata Kuliah" value="" />
            {makul.map((m) => (
              <Picker.Item
                key={m.id}
                label={`${m.kode_mk} - ${m.nama_mk}`}
                value={m.id}
              />
            ))}
          </Picker>

          {/* Dosen */}
          <Text style={styles.label}>Dosen Pengampu</Text>
          <Picker
            selectedValue={form.id_dosen}
            onValueChange={(v) => update("id_dosen", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Dosen" value="" />
            {dosen.map((d) => (
              <Picker.Item key={d.id} label={d.nama} value={d.id} />
            ))}
          </Picker>

          {/* Ruangan */}
          <Text style={styles.label}>Ruangan</Text>
          <Picker
            selectedValue={form.id_ruangan}
            onValueChange={(v) => update("id_ruangan", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Ruangan" value="" />
            {ruangan.map((r) => (
              <Picker.Item key={r.id} label={r.nama_ruangan} value={r.id} />
            ))}
          </Picker>

          {/* Sesi */}
          <Text style={styles.label}>Sesi</Text>
          <Picker
            selectedValue={form.id_sesi}
            onValueChange={(v) => update("id_sesi", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Sesi" value="" />
            {sesi.map((s) => (
              <Picker.Item
                key={s.id}
                label={`${s.nama_sesi} (${s.jam_mulai} - ${s.jam_selesai})`}
                value={s.id}
              />
            ))}
          </Picker>

          {/* Hari */}
          <Text style={styles.label}>Hari</Text>
          <Picker
            selectedValue={form.hari}
            onValueChange={(v) => update("hari", v)}
            style={styles.picker}
          >
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>

          {/* Semester */}
          <Text style={styles.label}>Semester</Text>
          <Picker
            selectedValue={form.semester}
            onValueChange={(v) => update("semester", v)}
            style={styles.picker}
          >
            <Picker.Item label="Ganjil" value="Ganjil" />
            <Picker.Item label="Genap" value="Genap" />
          </Picker>

          {/* Tahun Ajaran */}
          <Text style={styles.label}>Tahun Ajaran</Text>
          <Picker
            selectedValue={form.tahun_ajaran}
            onValueChange={(v) => update("tahun_ajaran", v)}
            style={styles.picker}
          >
            {["2024/2025", "2025/2026", "2026/2027"].map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>

          {/* Tombol */}
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancel} onPress={close}>
              <Text style={styles.cancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.save} onPress={save}>
              <Text style={styles.saveText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flexGrow: 1,
    backgroundColor: "#0005",
    justifyContent: "center",
    paddingVertical: 40,
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    alignSelf: "center",
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },
  picker: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  cancel: { marginRight: 14, backgroundColor: "#eb2525ff", padding: 10, borderRadius: 8 },
  cancelText: { color: "white", fontWeight: "600" },
  save: { backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  saveText: { color: "white", fontWeight: "600" },
});
