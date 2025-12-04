import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  SectionList, 
  RefreshControl,
  StatusBar
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../store/useAuth';

// Interface Data
interface JadwalPersonalItem {
  id: number;
  makul: string;
  kode_mk: string;
  sks: number;
  ruangan: string;
  sesi: string;
  jam_mulai: string;
  jam_selesai: string;
  hari: string;
  tahun_ajaran: string;
  semester: number;
}

interface SectionData {
  title: string;
  data: JadwalPersonalItem[];
}

const JadwalDosen = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // IP Address Laptop
  const API_URL = 'http://192.168.60.243:3000/api/dosen/jadwal-personal';

  const fetchData = async () => {
    if (!user?.username) return;
    try {
      const response = await axios.get(`${API_URL}/${user.username}`);
      if (response.data.success) {
        processData(response.data.data);
      }
    } catch (error) {
      console.error("Gagal load jadwal personal:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const processData = (data: JadwalPersonalItem[]) => {
    const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    
    const grouped = data.reduce((acc: any, item) => {
      const day = item.hari;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

    const sectionsArray = daysOrder
      .map(day => ({ title: day, data: grouped[day] || [] }))
      .filter(section => section.data.length > 0);

    setSections(sectionsArray);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatJam = (jam: string) => jam ? jam.substring(0, 5) : "--:--";

  const renderSectionHeader = ({ section: { title } }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderItem = ({ item, index, section }: { item: JadwalPersonalItem, index: number, section: SectionData }) => {
    const isLastItem = index === section.data.length - 1;

    return (
      <View style={styles.itemContainer}>
        {/* Kolom Kiri: WAKTU */}
        <View style={styles.timeColumn}>
          <Text style={styles.timeStart}>{formatJam(item.jam_mulai)}</Text>
          <Text style={styles.timeEnd}>{formatJam(item.jam_selesai)}</Text>
          {!isLastItem && <View style={styles.timelineLine} />}
        </View>

        {/* Kolom Kanan: KARTU DATA */}
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            
            <View style={styles.headerRow}>
              <Text style={styles.makulText} numberOfLines={1}>{item.makul}</Text>
              <View style={styles.sksBadge}>
                <Text style={styles.sksText}>{item.sks} SKS</Text>
              </View>
            </View>

            {/* Info Baris 1: Kode MK */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="pricetag" size={12} color="#6B7280" />
                <Text style={styles.detailText}>{item.kode_mk}</Text>
              </View>
            </View>

            {/* Info Baris 2: Ruangan & Sesi */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="location" size={12} color="#6B7280" />
                <Text style={styles.detailText}>{item.ruangan}</Text>
              </View>
              <View style={[styles.detailItem, { marginLeft: 12 }]}>
                 <Ionicons name="time" size={12} color="#6B7280" />
                 <Text style={styles.detailText}>{item.sesi}</Text>
              </View>
            </View>

          </View>
        </View>
      </View>
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Jadwal Mengajar</Text>
        <Text style={styles.pageSubtitle}>Daftar kelas yang Anda ampu semester ini</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Belum ada jadwal mengajar.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

// Styles yang SAMA PERSIS dengan JadwalAkademik
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  pageHeader: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
  },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  pageSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  listContent: { paddingBottom: 40 },
  
  sectionHeader: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12 },
  sectionBadge: { alignSelf: 'flex-start', backgroundColor: '#4F46E5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: 1 },

  itemContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 0 },
  timeColumn: { width: 60, alignItems: 'center', paddingTop: 4, marginRight: 12 },
  timeStart: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  timeEnd: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#E5E7EB', marginTop: 8, borderRadius: 1 },

  cardContainer: { flex: 1, paddingBottom: 16 },
  cardContent: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2,
    borderLeftWidth: 4, borderLeftColor: '#4F46E5', // Warna Induk
  },
  
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  makulText: { fontSize: 15, fontWeight: '700', color: '#1F2937', flex: 1, marginRight: 8 },
  sksBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  sksText: { fontSize: 10, fontWeight: '800', color: '#4F46E5' },
  
  detailRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: 12, color: '#4B5563', marginLeft: 4 },
  emptyText: { color: '#9CA3AF', fontSize: 16 }
});

export default JadwalDosen;