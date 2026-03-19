import 'react-native-get-random-values';
import '../global.css';

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Silencia o warning de pointerEvents deprecated que vem de libs de terceiros (gluestack/nativewind)
if (Platform.OS === 'web' && typeof console !== 'undefined') {
  const _warn = console.error.bind(console);
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('pointerEvents')) return;
    _warn(...args);
  };
}
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { makeServer } from '@/src/services/mock/server';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { useAuthStore } from '@/src/store/useAuthStore';
import { useAppStore } from '@/src/store';

export default function RootLayout() {
  const [mirageReady, setMirageReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasAuthHydrated = useAuthStore.persist.hasHydrated();
  const fetchCategories = useAppStore((state) => state.fetchCategories);

  useEffect(() => {
    async function init() {
      if (process.env.NODE_ENV !== 'test') {
        await makeServer();
      }
      setMirageReady(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (!mirageReady || !hasAuthHydrated) return;
    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login' as any);
    } else if (isAuthenticated && inAuthGroup) {
      fetchCategories();
      router.replace('/(tabs)' as any);
    } else if (isAuthenticated && !inAuthGroup) {
      fetchCategories();
    }
  }, [isAuthenticated, segments, mirageReady, hasAuthHydrated]);

  if (!mirageReady || !hasAuthHydrated) return null;

  return (
    <GluestackUIProvider mode="dark">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#111111' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold', color: '#FFFFFF' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#0F0F0F' },
        }}
      >
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="stores/new"
          options={{
            title: 'Nova Loja',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="stores/[id]/index"
          options={{ title: 'Detalhes da Loja' }}
        />
        <Stack.Screen
          name="stores/[id]/edit"
          options={{
            title: 'Editar Loja',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="stores/[id]/products/new"
          options={{
            title: 'Novo Produto',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen
          name="stores/[id]/products/[productId]/edit"
          options={{
            title: 'Editar Produto',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#111111' },
            headerTintColor: '#FFFFFF',
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
