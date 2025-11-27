import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function AdminTabs() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("role");
    router.replace("/login");
  };

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#007bff",
        },
        headerTintColor: "#fff",

        // Tombol logout di kanan header
        headerRight: () => (
          <TouchableOpacity
            onPress={handleLogout}
            style={{ marginRight: 15, flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={{ color: "white", marginLeft: 5, fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="dashboard-admin"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="laporanAdmin"
        options={{
          title: "Laporan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profileAdmin"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
