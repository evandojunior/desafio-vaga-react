import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/src/store/useAuthStore';
import { View, Text } from 'react-native';

export default function TabsLayout() {
  const { user } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#111111',
          borderTopColor: '#222',
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#555',
        headerStyle: { backgroundColor: '#111111' },
        headerTintColor: '#F9FAFB',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => (
          <View style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 13, fontWeight: '500' }}>
              Olá, <Text style={{ color: '#F9FAFB', fontWeight: 'bold' }}>{user?.name || 'Visitante'}</Text>
            </Text>
            <Ionicons name="person-circle-outline" size={26} color="#3B82F6" />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lojas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
