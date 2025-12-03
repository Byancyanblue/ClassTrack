import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MahasiswaTabs() {
  const router = useRouter();

  // Fungsi Logout Global
  const handleLogout = async () => {
    Alert.alert("Konfirmasi", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      { 
        text: "Keluar", 
        style: "destructive", 
        onPress: async () => {
          await AsyncStorage.removeItem("role");
          router.replace("/");
        }
      }
    ]);
  };

  // Komponen Tombol Kanan Header
  const HeaderRightButtons = () => (
    <View style={{ flexDirection: 'row', marginRight: 15, alignItems: 'center' }}>
      {/* Tombol Profile (Navigasi ke Tab Profile) */}
      <TouchableOpacity 
        onPress={() => router.push("/(mahasiswa)/profile")}
        style={{ marginRight: 15 }}
      >
        <Ionicons name="person-circle-outline" size={30} color="#333" />
      </TouchableOpacity>

      {/* Tombol Logout */}
      <TouchableOpacity onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={26} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        // 🔥 1. AKTIFKAN HEADER
        headerShown: true, 
        
        // Style Header
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0, // Hilangkan bayangan di Android
          shadowOpacity: 0, // Hilangkan bayangan di iOS
          borderBottomWidth: 1,
          borderBottomColor: "#eee",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#2c3e50",
          fontSize: 18,
        },
        
        // 🔥 2. PASANG TOMBOL DI KANAN
        headerRight: () => <HeaderRightButtons />,

        // Style Tab Bar Bawah
        tabBarActiveTintColor: "#3498db",
        tabBarInactiveTintColor: "#95a5a6",
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboardMahasiswa"
        options={{
          title: "Beranda", // Judul di Header Kiri
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="kelas"
        options={{
          title: "Daftar Kelas",
          tabBarLabel: "Kelas",
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="inbox"
        options={{
          title: "Kotak Masuk",
          tabBarLabel: "Inbox",
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil Saya",
          tabBarLabel: "Akun",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}