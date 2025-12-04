import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, Modal, ScrollView, Alert, StyleSheet, RefreshControl
} from "react-native";
import { useAuth } from "../../../store/useAuth";
import { Ionicons } from '@expo/vector-icons';

const API_URL = "http://192.168.60.243:3000/api";

export default function DashboardDosen() {
  const user = useAuth((s) => s.user);
  const [idDosen, setIdDosen] = useState<number | null>(null);
  const [namaDosen, setNamaDosen] = useState("");
  const [jadwalHariIni, setJadwalHariIni] = useState<any[]>([]);
  const [pengumuman, setPengumuman] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const statusList = [
    "Sesuai Jadwal", "Diubah menjadi Online", "Dipindahkan ke ruangan lain", "Ditunda", "Dibatalkan"
  ];

  const fetchData = () => {
    if (!user?.username) return;
    
    // 1. Fetch Dosen
    fetch(`${API_URL}/dosen/by-username/${user.username}`)
      .then((res) => res.json())
      .then((data) => {
        setIdDosen(data.id_dosen);
        setNamaDosen(data.nama);
        
        // 2. Fetch Jadwal & Pengumuman
        if(data.id_dosen) {
            fetch(`${API_URL}/dosen/${data.id_dosen}/jadwal-hari-ini`)
            .then((res) => res.json())
            .then((jdwl) => setJadwalHariIni(jdwl));

            fetch(`${API_URL}/dosen/${data.id_dosen}/pengumuman`)
            .then((res) => res.json())
            .then((pgm) => setPengumuman(pgm));
        }
      })
      .catch((err) => console.log("Error:", err))
      .finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const updateStatus = (status: string) => {
    if (!selectedJadwal) return;
    fetch(`${API_URL}/dosen/jadwal/${selectedJadwal.id}/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then((res) => res.json())
      .then(() => {
        Alert.alert("Sukses", "Status berhasil diperbarui!");
        setModalVisible(false);
        onRefresh(); // Refresh data
      });
  };

  const openEditStatus = (item: any) => {
    setSelectedJadwal(item);
    setModalVisible(true);
  };

  const hariTanggal = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const formatJam = (jam: string) => jam ? jam.substring(0, 5) : "--:--";

  // Helper Warna Status
  const getStatusColor = (status: string) => {
    if(status === 'Dibatalkan') return '#EF4444'; // Merah
    if(status === 'Sesuai Jadwal') return '#10B981'; // Hijau
    return '#F59E0B'; // Kuning (Online/Pindah)
  };

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* HEADER DASHBOARD */}
      <View style={styles.headerDashboard}>
        <View>
            <Text style={styles.welcomeText}>Halo, {namaDosen || "Dosen"}</Text>
            <Text style={styles.dateText}>{hariTanggal}</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
             <Ionicons name="person" size={24} color="#4F46E5" />
        </View>
      </View>

      {/* SECTION: JADWAL HARI INI (Timeline Style) */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Jadwal Hari Ini</Text>
        
        {jadwalHariIni.length === 0 ? (
            <View style={styles.emptyCard}>
                <Ionicons name="calendar-outline" size={40} color="#CBD5E1" />
                <Text style={styles.emptyText}>Tidak ada jadwal mengajar hari ini.</Text>
            </View>
        ) : (
            jadwalHariIni.map((item, index) => {
                const isLastItem = index === jadwalHariIni.length - 1;
                const statusColor = getStatusColor(item.status);

                return (
                    <View key={item.id} style={styles.itemContainer}>
                        {/* Waktu (Kiri) */}
                        <View style={styles.timeColumn}>
                             <Text style={styles.timeStart}>{formatJam(item.jam_mulai)}</Text>
                             <Text style={styles.timeEnd}>{formatJam(item.jam_selesai)}</Text>
                             {!isLastItem && <View style={styles.timelineLine} />}
                        </View>

                        {/* Kartu (Kanan) */}
                        <View style={styles.cardContainer}>
                            <View style={[styles.cardContent, { borderLeftColor: statusColor }]}>
                                <View style={styles.headerRow}>
                                    <Text style={styles.makulText}>{item.makul}</Text>
                                    <TouchableOpacity onPress={() => openEditStatus(item)}>
                                        <Ionicons name="create-outline" size={20} color="#6366F1" />
                                    </TouchableOpacity>
                                </View>

                                {/* Lokasi & Status */}
                                <View style={styles.detailRow}>
                                    <Ionicons name="location" size={14} color="#6B7280" />
                                    <Text style={styles.detailText}>{item.ruangan}</Text>
                                </View>

                                <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                                    <Text style={[styles.statusText, { color: statusColor }]}>
                                        {item.status || "Sesuai Jadwal"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                );
            })
        )}
      </View>

      {/* SECTION: PENGUMUMAN */}
      <View style={styles.sectionContainer}>
         <Text style={styles.sectionTitle}>Aktivitas Terakhir</Text>
         {pengumuman.length === 0 ? (
             <Text style={{color:'#999', fontStyle:'italic'}}>Belum ada perubahan status jadwal.</Text>
         ) : (
             pengumuman.map((item) => (
                 <View key={item.id} style={styles.notifCard}>
                     <View style={styles.notifIcon}>
                        <Ionicons name="notifications" size={18} color="#fff" />
                     </View>
                     <View style={{flex:1}}>
                        <Text style={styles.notifTitle}>{item.makul}</Text>
                        <Text style={styles.notifDesc}>Status diubah menjadi: {item.aksi}</Text>
                        <Text style={styles.notifTime}>{new Date(item.waktu).toLocaleTimeString()}</Text>
                     </View>
                 </View>
             ))
         )}
      </View>

      {/* MODAL EDIT STATUS */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Status Kelas</Text>
            <Text style={styles.modalSubtitle}>{selectedJadwal?.makul}</Text>

            {statusList.map((s) => (
              <TouchableOpacity key={s} onPress={() => updateStatus(s)} style={styles.modalOption}>
                <Text style={styles.modalOptionText}>{s}</Text>
                {selectedJadwal?.status === s && <Ionicons name="checkmark" size={18} color="green" />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
              <Text style={{color:'white', fontWeight:'bold'}}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  // Header Dashboard
  headerDashboard: { 
      flexDirection:'row', justifyContent:'space-between', alignItems:'center', 
      padding: 20, backgroundColor:'#fff', borderBottomWidth:1, borderColor:'#E5E7EB' 
  },
  welcomeText: { fontSize: 20, fontWeight:'800', color:'#1F2937' },
  dateText: { fontSize: 13, color:'#6B7280', marginTop:4 },
  avatarPlaceholder: { width:40, height:40, borderRadius:20, backgroundColor:'#EEF2FF', justifyContent:'center', alignItems:'center' },

  // Sections
  sectionContainer: { padding: 20, paddingBottom: 0 },
  sectionTitle: { fontSize: 18, fontWeight:'700', color:'#374151', marginBottom: 16 },

  // TIMELINE STYLES (Copied & Adapted)
  itemContainer: { flexDirection: 'row', marginBottom: 0 },
  timeColumn: { width: 50, alignItems: 'center', paddingTop: 4, marginRight: 10 },
  timeStart: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  timeEnd: { fontSize: 11, color: '#9CA3AF' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginTop: 6, borderRadius: 1 },
  
  cardContainer: { flex: 1, paddingBottom: 16 },
  cardContent: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    borderLeftWidth: 4, // Warna dinamis via inline style
  },
  headerRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' },
  makulText: { fontSize: 15, fontWeight:'700', color:'#1F2937', flex:1, marginRight:10 },
  
  detailRow: { flexDirection:'row', alignItems:'center', marginTop: 6, marginBottom: 8 },
  detailText: { fontSize: 13, color:'#4B5563', marginLeft: 6 },
  
  statusBadge: { alignSelf:'flex-start', paddingHorizontal:8, paddingVertical:4, borderRadius:6 },
  statusText: { fontSize:11, fontWeight:'700' },

  // Empty State
  emptyCard: { backgroundColor:'#fff', padding:20, borderRadius:12, alignItems:'center', justifyContent:'center', borderStyle:'dashed', borderWidth:1, borderColor:'#CBD5E1' },
  emptyText: { color:'#94A3B8', marginTop:8 },

  // Notif Card
  notifCard: { flexDirection:'row', backgroundColor:'#fff', padding:12, borderRadius:12, marginBottom:10, alignItems:'center' },
  notifIcon: { width:36, height:36, borderRadius:18, backgroundColor:'#F59E0B', justifyContent:'center', alignItems:'center', marginRight:12 },
  notifTitle: { fontWeight:'bold', color:'#333', fontSize:13 },
  notifDesc: { color:'#666', fontSize:12 },
  notifTime: { color:'#999', fontSize:10, marginTop:2 },

  // Modal
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center' },
  modalContent: { width:'85%', backgroundColor:'white', borderRadius:16, padding:20 },
  modalTitle: { fontSize:18, fontWeight:'bold', textAlign:'center', marginBottom:5 },
  modalSubtitle: { textAlign:'center', color:'#666', marginBottom:20 },
  modalOption: { flexDirection:'row', justifyContent:'space-between', padding:15, borderBottomWidth:1, borderColor:'#eee' },
  modalOptionText: { fontSize:14, color:'#333' },
  modalCloseBtn: { marginTop:20, backgroundColor:'#EF4444', padding:12, borderRadius:8, alignItems:'center' }
});