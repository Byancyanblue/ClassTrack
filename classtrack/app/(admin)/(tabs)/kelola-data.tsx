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

const API_URL = "http://192.168.60.243:3000/api";

// Enable layout animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ModeType = "add" | "edit";

export default function KelolaDataScreen() {
  // Accordion states
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

  // Data states
  const [dosen, setDosen] = useState<any[]>([]);
  const [makul, setMakul] = useState<any[]>([]);
  const [ruangan, setRuangan] = useState<any[]>([]);
  const [sesi, setSesi] = useState<any[]>([]);
  const [jadwal, setJadwal] = useState<any[]>([]);

  // Modal handling states
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState<ModeType>("add");
  const [modalType, setModalType] = useState<"" | "dosen" | "makul" | "ruangan" | "sesi" | "jadwal">("");
  const [selectedData, setSelectedData] = useState<any>(null);

  const openModal = (type: typeof modalType, mode: ModeType, data: any = null) => {
    setModalType(type);
    setMode(mode);
    setSelectedData(data);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType("");
    setSelectedData(null);
  };

  // Fetch all data
  const fetchAll = async () => {
    const get = async (endpoint: string) => {
      const res = await fetch(`${API_URL}/${endpoint}`);
      return res.json();
    };

    setDosen(await get("dosen"));
    setMakul(await get("makul"));
    setRuangan(await get("ruangan"));
    setSesi(await get("sesi"));
    setJadwal(await get("jadwal"));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Delete function
  const deleteItem = async (type: string, id: number) => {
    await fetch(`${API_URL}/${type}/${id}`, { method: "DELETE" });
    fetchAll();
  };

  // Render accordion
  const renderSection = (
    title: string,
    key: keyof typeof sections,
    items: any[],
    type: typeof modalType,
    fields: string[]
  ) => (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(key)}>
        <Text style={styles.sectionTitle}>{title}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => openModal(type, "add")}
        >
          <Text style={styles.addButtonText}>+ Tambah</Text>
        </TouchableOpacity>
      </TouchableOpacity>

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
                    onPress={() => deleteItem(type!, item.id)}
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

      {/* Modal Handler */}
      {modalVisible && modalType === "dosen" && (
        <ModalDosen close={closeModal} mode={mode} data={selectedData} refresh={fetchAll} />
      )}
      {modalVisible && modalType === "makul" && (
        <ModalMakul close={closeModal} mode={mode} data={selectedData} refresh={fetchAll} />
      )}
      {modalVisible && modalType === "ruangan" && (
        <ModalRuangan close={closeModal} mode={mode} data={selectedData} refresh={fetchAll} />
      )}
      {modalVisible && modalType === "sesi" && (
        <ModalSesi close={closeModal} mode={mode} data={selectedData} refresh={fetchAll} />
      )}
      {modalVisible && modalType === "jadwal" && (
        <ModalJadwal close={closeModal} mode={mode} data={selectedData} refresh={fetchAll} />
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
