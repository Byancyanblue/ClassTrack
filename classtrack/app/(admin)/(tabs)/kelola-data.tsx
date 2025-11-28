import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

import ModalDosen from "../../../components/modals/modalDosen";
import ModalMakul from "../../../components/modals/modalMakul";
import ModalRuangan from "../../../components/modals/modalRuangan";
import ModalSesi from "../../../components/modals/modalSesi";
import ModalJadwal from "../../../components/modals/modalJadwal";

const API_URL = "http://192.168.164.243:3000/api";


// Enable Animation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function KelolaDataScreen() {
  const [sections, setSections] = useState({
    dosen: false,
    makul: false,
    ruangan: false,
    sesi: false,
    jadwal: false,
  });

  const toggleSection = (key: keyof typeof sections) => {
    LayoutAnimation.easeInEaseOut();
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Data States
  const [dosen, setDosen] = useState([]);
  const [makul, setMakul] = useState([]);
  const [ruangan, setRuangan] = useState([]);
  const [sesi, setSesi] = useState([]);
  const [jadwal, setJadwal] = useState([]);

  // Modal State
  const [modal, setModal] = useState({ show: false, type: "", mode: "add", data: null });

  const openModal = (type, mode, data = null) =>
    setModal({ show: true, type, mode, data });

  const closeModal = () => setModal({ show: false, type: "", mode: "add", data: null });

  // Fetching ALL
  const fetchAll = async () => {
    const fetcher = async (url) => {
      const res = await fetch(url);
      return res.json();
    };

    setDosen(await fetcher(`${API_URL}/dosen`));
    setMakul(await fetcher(`${API_URL}/makul`));
    setRuangan(await fetcher(`${API_URL}/ruangan`));
    setSesi(await fetcher(`${API_URL}/sesi`));
    setJadwal(await fetcher(`${API_URL}/jadwal`));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const deleteItem = async (type, id) => {
    await fetch(`${API_URL}/${type}/${id}`, { method: "DELETE" });
    fetchAll();
  };

  // Accordion Section Renderer
  const renderSection = (label, key, items, type, fields) => (
    <View style={styles.section}>
      {/* Header */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => toggleSection(key)}
      >
        <Text style={styles.sectionTitle}>{label}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal(type, "add")}
        >
          <Text style={styles.addButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Accordion Body */}
      {sections[key] && (
        <View style={styles.sectionBody}>
          {items.length === 0 ? (
            <Text style={styles.emptyText}>Belum ada data.</Text>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  {fields.map((f) => (
                    <Text key={f} style={styles.itemText}>
                      • {item[f]}
                    </Text>
                  ))}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#2563eb" }]}
                    onPress={() => openModal(type, "edit", item)}
                  >
                    <Text style={styles.actionLabel}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#dc2626" }]}
                    onPress={() => deleteItem(type, item.id)}
                  >
                    <Text style={styles.actionLabel}>Hapus</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderSection("Data Dosen", "dosen", dosen, "dosen", ["nama", "email", "k_keahlian"])}
      {renderSection("Data Mata Kuliah", "makul", makul, "makul", ["kode_mk", "nama_mk", "semester"])}
      {renderSection("Data Ruangan", "ruangan", ruangan, "ruangan", ["nama_ruangan", "kapasitas"])}
      {renderSection("Data Sesi", "sesi", sesi, "sesi", ["nama_sesi", "jam_mulai", "jam_selesai"])}
      {renderSection("Data Jadwal", "jadwal", jadwal, "jadwal", [
        "mataKuliah",
        "dosen",
        "ruang",
        "sesi",
        "hari",
      ])}

      {/* 💠 Modal Handler */}
      {modal.show && modal.type === "dosen" && (
        <ModalDosen close={closeModal} mode={modal.mode} data={modal.data} refresh={fetchAll} />
      )}
      {modal.show && modal.type === "makul" && (
        <ModalMakul close={closeModal} mode={modal.mode} data={modal.data} refresh={fetchAll} />
      )}
      {modal.show && modal.type === "ruangan" && (
        <ModalRuangan close={closeModal} mode={modal.mode} data={modal.data} refresh={fetchAll} />
      )}
      {modal.show && modal.type === "sesi" && (
        <ModalSesi close={closeModal} mode={modal.mode} data={modal.data} refresh={fetchAll} />
      )}
      {modal.show && modal.type === "jadwal" && (
        <ModalJadwal close={closeModal} mode={modal.mode} data={modal.data} refresh={fetchAll} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8fafc" },

  section: { marginBottom: 24 },

  sectionHeader: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },

  addButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: { color: "white", fontWeight: "600" },

  sectionBody: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    marginTop: 8,
  },

  itemRow: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  itemText: { color: "#0f172a", fontSize: 14 },

  actions: {
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionLabel: { color: "white", fontWeight: "700" },

  emptyText: { color: "#64748b", textAlign: "center", padding: 10 },
});
