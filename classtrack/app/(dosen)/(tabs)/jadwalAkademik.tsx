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
import { Ionicons } from '@expo/vector-icons'; // Library Icon bawaan Expo

// Interface Data
interface JadwalItem {
  id: number;
  makul: string;
  kode_mk: string; // Asumsi ada kode_mk
  sks: number;     // Asumsi ada sks
  dosen: string;
  ruangan: string;
  sesi: string;
  jam_mulai: string | null;
  jam_selesai: string | null;
  hari: string;
  tahun_ajaran: string;
  semester: number;
}

// Interface untuk SectionList
interface SectionData {
  title: string;
  data: JadwalItem[];
}

const JadwalAkademik = () => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ IP SERVER (Sesuaikan jika berubah)
  const API_URL = 'http://192.168.1.22:3000/api'; 

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/dosen/jadwalAkademik`);
      
      if (response.data.success) {
        processData(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fungsi untuk mengelompokkan data berdasarkan Hari (Untuk SectionList)
  const processData = (data: JadwalItem[]) => {
    const daysOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    
    // Grouping logic
    const grouped = data.reduce((acc: any, item) => {
      const day = item.hari;
      if (!acc[day]) acc[day] = [];
      acc[day].push(item);
      return acc;
    }, {});

    // Convert ke format SectionList dan urutkan hari
    const sectionsArray = daysOrder
      .map(day => ({
        title: day,
        data: grouped[day] || []
      }))
      .filter(section => section.data.length > 0); // Hanya ambil hari yang ada jadwalnya

    setSections(sectionsArray);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatJam = (jam: string | null) => {
    if (!jam) return "--:--";
    return jam.substring(0, 5);
  };

  // Render Header per HARI (Senin, Selasa...)
  const renderSectionHeader = ({ section: { title } }: { section: SectionData }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
    </View>
  );

  // Render Item (Compact Style)
  const renderItem = ({ item, index, section }: { item: JadwalItem, index: number, section: SectionData }) => {
    // Cek apakah item ini yang terakhir di section tsb (untuk styling garis timeline)
    const isLastItem = index === section.data.length - 1;

    return (
      <View style={styles.itemContainer}>
        {/* Kolom Kiri: WAKTU */}
        <View style={styles.timeColumn}>
          <Text style={styles.timeStart}>{formatJam(item.jam_mulai)}</Text>
          <Text style={styles.timeEnd}>{formatJam(item.jam_selesai)}</Text>
          {/* Garis Vertikal Timeline */}
          {!isLastItem && <View style={styles.timelineLine} />}
        </View>

        {/* Kolom Kanan: KARTU DATA (Compact) */}
        <View style={styles.cardContainer}>
          <View style={styles.cardContent}>
            
            {/* Baris Judul & Semester */}
            <View style={styles.headerRow}>
              <Text style={styles.makulText} numberOfLines={1}>{item.makul}</Text>
              <View style={[styles.semBadge, { backgroundColor: item.semester % 2 === 0 ? '#E0F2FE' : '#FEF3C7' }]}>
                <Text style={[styles.semText, { color: item.semester % 2 === 0 ? '#0284C7' : '#D97706' }]}>
                  Sem {item.semester}
                </Text>
              </View>
            </View>

            {/* Baris Info Detail (Pakai Icon biar hemat tempat) */}
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="person" size={12} color="#6B7280" />
                <Text style={styles.detailText} numberOfLines={1}>{item.dosen}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="location" size={12} color="#6B7280" />
                <Text style={styles.detailText}>{item.ruangan}</Text>
              </View>
              <View style={[styles.detailItem, { marginLeft: 10 }]}>
                 <Ionicons name="time" size={12} color="#6B7280" />
                 <Text style={styles.detailText}>{item.sesi}</Text>
              </View>
            </View>

          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      
      {/* Header Halaman */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Jadwal Akademik</Text>
        <Text style={styles.pageSubtitle}>Daftar seluruh jadwal perkuliahan</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        stickySectionHeadersEnabled={false} // Set true jika ingin header hari nempel di atas saat scroll
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Tidak ada data jadwal.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Abu-abu terang modern
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 40,
  },
  
  // SECTION HEADER (HARI)
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4F46E5', // Indigo utama
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // ITEM CONTAINER
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 0, // Rapat vertikal
  },
  
  // KOLOM WAKTU (KIRI)
  timeColumn: {
    width: 60,
    alignItems: 'center',
    paddingTop: 4,
    marginRight: 12,
  },
  timeStart: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  timeEnd: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
    borderRadius: 1,
  },

  // KARTU DATA (KANAN)
  cardContainer: {
    flex: 1,
    paddingBottom: 16, // Jarak antar item
  },
  cardContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    // Shadow halus
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5', // Aksen warna di kiri kartu
  },
  
  // DALAM KARTU
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  makulText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  semBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  semText: {
    fontSize: 10,
    fontWeight: '800',
  },
  
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 4,
    flexShrink: 1,
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  }
});

export default JadwalAkademik;