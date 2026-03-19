import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { makeServer } from '@/src/services/mock/server';

export default function RootLayout() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'test') {
      makeServer();
    }
  }, []);

  return (
    <>
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="stores/index"
          options={{ title: 'Minhas Lojas' }}
        />
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
    </>
  );
}
