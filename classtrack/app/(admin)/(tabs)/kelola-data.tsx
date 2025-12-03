import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import ModalDosen from "../../../components/modals/modalDosen";
import ModalMakul from "../../../components/modals/modalMakul";
import ModalRuangan from "../../../components/modals/modalRuangan";
import ModalSesi from "../../../components/modals/modalSesi";
import ModalJadwal from "../../../components/modals/modalJadwal";

const API_URL = "http://192.168.60.243:3000/api";

type ModeType = "add" | "edit";
type ModalType = "" | "dosen" | "makul" | "ruangan" | "sesi" | "jadwal";

export default function KelolaDataScreen() {
  const router = useRouter();

  // DATA
  const [dosen, setDosen] = useState<any[]>([]);
  const [makul, setMakul] = useState<any[]>([]);
  const [ruangan, setRuangan] = useState<any[]>([]);
  const [sesi, setSesi] = useState<any[]>([]);
  const [jadwal, setJadwal] = useState<any[]>([]);

  // MODAL
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("");
  const [mode, setMode] = useState<ModeType>("add");
  const [selectedData, setSelectedData] = useState<any>(null);

  const openModal = (type: ModalType, mode: ModeType, data: any = null) => {
    setModalType(type);
    setMode(mode);
    setSelectedData(data);
    setModalVisible(true);
  };


  const closeModal = () => setMode({ show: false, type: "", mode: "add", data: null });


  // FETCH SEMUA DATA

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

  // RENDER GRID CARD
  const renderGridCard = (item: any, fields: any[]) => (
    <View key={item.id} style={styles.gridCard}>
      {fields.map((field: any, idx: number) => (
        <View key={idx} style={{ marginBottom: 6 }}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          <Text style={styles.fieldValue}>{item[field.key]}</Text>
        </View>
      ))}
    </View>
  );

  // RENDER PREVIEW SECTION
  const renderPreview = (
    title: string,
    data: any[],
    navigate: string,
    type: ModalType,
    fields: any[]
  ) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>{title}</Text>


        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => openModal(type, "add")}
        >
          <Text style={styles.addBtnText}>+ Tambah</Text>
        </TouchableOpacity>
      </View>

      {data.length === 0 ? (
        <Text style={styles.empty}>Belum ada data.</Text>
      ) : (
        <View style={styles.grid}>
          {data.slice(0, 4).map((item) => renderGridCard(item, fields))}
        </View>
      )}

      <TouchableOpacity
        onPress={() => router.push(navigate)}
        style={styles.seeMore}
      >
        <Text style={styles.seeMoreText}>Lihat selengkapnya</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderPreview("Data Dosen", dosen, "/kelola/dosen-list", "dosen", [
        { label: "Nama", key: "nama" },
        { label: "Email", key: "email" },
        { label: "Keahlian", key: "k_keahlian" },
      ])}

      {renderPreview(
        "Data Mata Kuliah",
        makul,
        "/kelola/makul-list",
        "makul",
        [
          { label: "Kode MK", key: "kode_mk" },
          { label: "Nama MK", key: "nama_mk" },
          { label: "SKS", key: "sks" },
        ]
      )}

      {renderPreview(
        "Data Ruangan",
        ruangan,
        "/kelola/ruangan-list",
        "ruangan",
        [
          { label: "Ruangan", key: "nama_ruangan" },
          { label: "Kapasitas", key: "kapasitas" },
        ]
      )}

      {renderPreview("Data Sesi", sesi, "/kelola/sesi-list", "sesi", [
        { label: "Nama Sesi", key: "nama_sesi" },
        { label: "Jam Mulai", key: "jam_mulai" },
      ])}

      {renderPreview(
        "Data Jadwal",
        jadwal,
        "/kelola/jadwal-list",
        "jadwal",
        [
          { label: "Mata Kuliah", key: "mataKuliah" },
          { label: "Dosen", key: "dosen" },
          { label: "Hari", key: "hari" },
        ]
      )}

      {/* =======================
          MODALS
      ======================== */}
      {modalVisible && modalType === "dosen" && (
        <ModalDosen
          close={closeModal}
          mode={mode}
          data={selectedData}
          refresh={fetchAll}
          visible={modalVisible}
        />
      )}

      {modalVisible && modalType === "makul" && (
        <ModalMakul
          close={closeModal}
          mode={mode}
          data={selectedData}
          refresh={fetchAll}
        />
      )}

      {modalVisible && modalType === "ruangan" && (
        <ModalRuangan
          close={closeModal}
          mode={mode}
          data={selectedData}
          refresh={fetchAll}
        />
      )}

      {modalVisible && modalType === "sesi" && (
        <ModalSesi
          close={closeModal}
          mode={mode}
          data={selectedData}
          refresh={fetchAll}
        />
      )}

      {modalVisible && modalType === "jadwal" && (
        <ModalJadwal
          close={closeModal}
          mode={mode}
          data={selectedData}
          refresh={fetchAll}
        />
      )}
    </ScrollView>
  );
}

// =========================================
//  STYLES – UI BARU
// =========================================

const styles = StyleSheet.create({
  container: { padding: 16 },

  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    marginBottom: 28,
    elevation: 4,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#0f172a" },

  addBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },

  addBtnText: { color: "white", fontWeight: "600" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridCard: {
    width: "100%",
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  fieldLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },

  fieldValue: {
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "700",
    marginBottom: 4,
  },

  seeMore: { marginTop: 8 },
  seeMoreText: { color: "#2563eb", fontWeight: "600" },

  empty: { color: "#64748b", fontStyle: "italic" },
});
