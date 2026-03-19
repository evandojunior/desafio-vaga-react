import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View, Text as RNText } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStores } from '@/src/hooks/useStores';
import { StoreCard } from '@/src/components/StoreCard';
import { SearchBar } from '@/src/components/SearchBar';
import { EmptyState } from '@/src/components/EmptyState';
import { Spinner } from '@/src/components/ui/spinner';
import { Text } from '@/src/components/ui/text';
import { Fab, FabLabel } from '@/src/components/ui/fab';

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
        keyExtractor={(item, index) => item?.id || String(index)}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.headerTop}>
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

      <Fab
        size="md"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => router.push('/stores/new')}
      >
        <Ionicons name="add" size={20} className="mr-1" />
        <FabLabel>Nova Loja</FabLabel>
      </Fab>
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
    paddingTop: 32,
    paddingBottom: 8,
    gap: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

});
