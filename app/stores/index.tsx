import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View, Text as RNText } from 'react-native';
import { shadow } from '@/src/utils/shadow';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStores } from '@/src/hooks/useStores';
import { StoreCard } from '@/components/StoreCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';

export default function StoresScreen() {
  const [search, setSearch] = useState('');
  const { stores, isLoading, error, refetch, deleteStore } = useStores(search);

  if (isLoading && stores.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Counter */}
            <View style={styles.counterRow}>
              <RNText style={styles.counterText}>
                {stores.length} {stores.length === 1 ? 'loja' : 'lojas'}
              </RNText>
            </View>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar loja por nome ou endereço..."
            />
            {error && (
              <Text size="sm" className="text-error-500 text-center mt-2">
                {error}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <StoreCard store={item} onDelete={deleteStore} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="storefront-outline"
            title={search ? 'Nenhuma loja encontrada' : 'Nenhuma loja cadastrada'}
            description={
              search
                ? `Não encontramos lojas para "${search}"`
                : 'Toque no botão + para adicionar sua primeira loja'
            }
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/stores/new')}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2563EB',
    borderRadius: 28,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow('#3B82F6', 4, 12, 0.5, 8),
  },
  fabPressed: {
    backgroundColor: '#1D4ED8',
  },
});
