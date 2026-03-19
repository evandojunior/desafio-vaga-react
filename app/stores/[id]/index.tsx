import React, { useState, useEffect } from 'react';
import { FlatList, Pressable, RefreshControl, View, Text, StyleSheet } from 'react-native';
import { shadow } from '@/src/utils/shadow';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/src/hooks/useStores';
import { useProducts } from '@/src/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/ui/spinner';

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const store = useStore(id);
  const [search, setSearch] = useState('');

  const { products, isLoading, refetch, deleteProduct } = useProducts(id, search);

  useEffect(() => {
    if (store) {
      navigation.setOptions({
        title: store.name,
        headerLeft: () => (
          <Pressable
            onPress={() => router.replace('/')}
            style={{ paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
        ),
      });
    }
  }, [store?.name]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  // Loja não existe (sessão do Mirage reiniciou ou ID inválido)
  if (!store) {
    router.replace('/');
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#3B82F6" />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Store Info Card */}
            {store && (
              <View style={styles.storeCard}>
                <View style={styles.storeCardRow}>
                  <View style={styles.storeIconContainer}>
                    <Ionicons name="storefront" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.storeInfo}>
                    <Text style={styles.storeName} numberOfLines={1}>
                      {store.name}
                    </Text>
                    <View style={styles.addressRow}>
                      <Ionicons name="location-outline" size={12} color="#6B7280" />
                      <Text style={styles.addressText} numberOfLines={2}>
                        {store.address}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.storeBadge}>
                    <Text style={styles.storeBadgeText}>
                      {store.productsCount}
                    </Text>
                    <Text style={styles.storeBadgeLabel}>
                      {store.productsCount === 1 ? 'produto' : 'produtos'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Section header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Produtos</Text>
            </View>

            {/* Search */}
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar produto ou categoria..."
            />
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={item}
              storeId={id}
              onDelete={deleteProduct}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            title={search ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            description={
              search
                ? `Nenhum resultado para "${search}"`
                : 'Toque no + para cadastrar o primeiro produto desta loja'
            }
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push(`/stores/${id}/products/new`)}
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
  storeCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    padding: 14,
  },
  storeCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeInfo: {
    flex: 1,
    gap: 4,
  },
  storeName: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  addressText: {
    color: '#6B7280',
    fontSize: 12,
    flex: 1,
  },
  storeBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  storeBadgeText: {
    color: '#3B82F6',
    fontSize: 18,
    fontWeight: '700',
  },
  storeBadgeLabel: {
    color: '#3B82F6',
    fontSize: 10,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
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
