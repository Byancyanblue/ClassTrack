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

const API_URL = "http://192.168.60.243:3000/api";

/** --- tipe data (boleh diperketat sesuai response API) --- */
type OptionItem = {
  id: number | string;
  [key: string]: any;
};

interface JadwalData {
  id?: number | string;
  id_makul?: number | string;
  id_dosen?: number | string;
  id_ruangan?: number | string;
  id_sesi?: number | string;
  hari?: string;
  semester?: string;
  tahun_ajaran?: string;
}

interface ModalJadwalProps {
  close: () => void;
  mode: "add" | "edit";
  data?: JadwalData | null;
  refresh: () => void;
}

export default function ModalJadwal({
  close,
  mode,
  data,
  refresh,
}: ModalJadwalProps) {
  const [form, setForm] = useState<JadwalData>({
    id_makul: data?.id_makul ?? "",
    id_dosen: data?.id_dosen ?? "",
    id_ruangan: data?.id_ruangan ?? "",
    id_sesi: data?.id_sesi ?? "",
    hari: data?.hari ?? "",
    semester: data?.semester ?? "",
    tahun_ajaran: data?.tahun_ajaran ?? "2024/2025",
  });

  const [makul, setMakul] = useState<OptionItem[]>([]);
  const [dosen, setDosen] = useState<OptionItem[]>([]);
  const [ruangan, setRuangan] = useState<OptionItem[]>([]);
  const [sesi, setSesi] = useState<OptionItem[]>([]);

  useEffect(() => {
    // fetch wrapper dengan catch sederhana
    const fetchAll = async () => {
      try {
        const [mRes, dRes, rRes, sRes] = await Promise.all([
          fetch(`${API_URL}/makul`),
          fetch(`${API_URL}/dosen`),
          fetch(`${API_URL}/ruangan`),
          fetch(`${API_URL}/sesi`),
        ]);

        if (mRes.ok) setMakul(await mRes.json());
        if (dRes.ok) setDosen(await dRes.json());
        if (rRes.ok) setRuangan(await rRes.json());
        if (sRes.ok) setSesi(await sRes.json());
      } catch (err) {
        console.warn("Fetch error:", err);
      }
    };

    fetchAll();
  }, []);

  // update dengan tipe eksplisit
  const update = (key: keyof JadwalData, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    try {
      if (mode === "edit" && data?.id) {
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
    } catch (err) {
      console.warn("Save error:", err);
    }
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
            selectedValue={String(form.id_makul ?? "")}
            onValueChange={(v: string | number) => update("id_makul", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Mata Kuliah" value="" />
            {makul.map((m) => (
              <Picker.Item
                key={String(m.id)}
                label={`${m.kode_mk ?? ""} - ${m.nama_mk ?? ""}`}
                value={String(m.id)}
              />
            ))}
          </Picker>

          {/* Dosen */}
          <Text style={styles.label}>Dosen Pengampu</Text>
          <Picker
            selectedValue={String(form.id_dosen ?? "")}
            onValueChange={(v: string | number) => update("id_dosen", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Dosen" value="" />
            {dosen.map((d) => (
              <Picker.Item key={String(d.id)} label={d.nama ?? ""} value={String(d.id)} />
            ))}
          </Picker>

          {/* Ruangan */}
          <Text style={styles.label}>Ruangan</Text>
          <Picker
            selectedValue={String(form.id_ruangan ?? "")}
            onValueChange={(v: string | number) => update("id_ruangan", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Ruangan" value="" />
            {ruangan.map((r) => (
              <Picker.Item
                key={String(r.id)}
                label={r.nama_ruangan ?? ""}
                value={String(r.id)}
              />
            ))}
          </Picker>

          {/* Sesi */}
          <Text style={styles.label}>Sesi</Text>
          <Picker
            selectedValue={String(form.id_sesi ?? "")}
            onValueChange={(v: string | number) => update("id_sesi", v)}
            style={styles.picker}
          >
            <Picker.Item label="Pilih Sesi" value="" />
            {sesi.map((s) => (
              <Picker.Item
                key={String(s.id)}
                label={`${s.nama_sesi ?? ""} (${s.jam_mulai ?? ""} - ${s.jam_selesai ?? ""})`}
                value={String(s.id)}
              />
            ))}
          </Picker>

          {/* Hari */}
          <Text style={styles.label}>Hari</Text>
          <Picker
            selectedValue={form.hari ?? ""}
            onValueChange={(v: string) => update("hari", v)}
            style={styles.picker}
          >
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>

          {/* Semester */}
          <Text style={styles.label}>Semester</Text>
          <Picker
            selectedValue={form.semester ?? ""}
            onValueChange={(v: string) => update("semester", v)}
            style={styles.picker}
          >
            <Picker.Item label="Ganjil" value="Ganjil" />
            <Picker.Item label="Genap" value="Genap" />
          </Picker>

          {/* Tahun Ajaran */}
          <Text style={styles.label}>Tahun Ajaran</Text>
          <Picker
            selectedValue={form.tahun_ajaran ?? "2024/2025"}
            onValueChange={(v: string) => update("tahun_ajaran", v)}
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
