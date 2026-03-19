import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { Spinner } from '@/components/ui/spinner';
import { Product } from '@/src/types';

const ALL_CATEGORIES = [
  'Roupas',
  'Calçados',
  'Acessórios',
  'Eletrônicos',
  'Alimentos',
  'Bebidas',
  'Higiene',
  'Papelaria',
  'Brinquedos',
  'Outros',
];

interface ProductWithStore extends Product {
  storeName: string;
}

export default function ProductsScreen() {
  const { stores, products, fetchStores, fetchProducts, productsLoading, deleteProduct } =
    useAppStore();

  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    await fetchStores();
    const currentStores = useAppStore.getState().stores;
    await Promise.all(currentStores.map((s) => fetchProducts(s.id)));
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  }

  const allProducts: ProductWithStore[] = useMemo(() => {
    return stores.flatMap((store) => {
      const storeProducts = products[store.id] ?? [];
      return storeProducts.map((p) => ({ ...p, storeName: store.name }));
    });
  }, [stores, products]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.storeName.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(p.category);

      return matchesSearch && matchesCategory;
    });
  }, [allProducts, search, selectedCategories]);

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  const isLoading = productsLoading && allProducts.length === 0;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace('/')}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Produtos</Text>
        <Pressable
          onPress={() => setFilterModalVisible(true)}
          style={({ pressed }) => [styles.filterBtn, pressed && styles.filterBtnPressed]}
        >
          <Ionicons name="funnel-outline" size={20} color={selectedCategories.length > 0 ? '#3B82F6' : '#9CA3AF'} />
          {selectedCategories.length > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{selectedCategories.length}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => `${item.id}-${item.storeName}`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#3B82F6" />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome, categoria ou loja..."
            />
            <Text style={styles.counterText}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={item}
              storeId={item.storeId}
              storeName={item.storeName}
              onDelete={(productId) => deleteProduct(item.storeId, productId)}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="cube-outline"
            title={search || selectedCategories.length > 0 ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            description={
              search || selectedCategories.length > 0
                ? 'Tente ajustar os filtros de busca'
                : 'Adicione produtos nas suas lojas para visualizá-los aqui'
            }
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
      />

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)} />
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Filtrar por Categoria</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {ALL_CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <Pressable
                  key={cat}
                  onPress={() => toggleCategory(cat)}
                  style={({ pressed }) => [
                    styles.categoryItem,
                    active && styles.categoryItemActive,
                    pressed && styles.categoryItemPressed,
                  ]}
                >
                  <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                  {active && <Ionicons name="checkmark" size={18} color="#3B82F6" />}
                </Pressable>
              );
            })}
          </ScrollView>
          <Pressable
            style={styles.clearBtn}
            onPress={() => {
              setSelectedCategories([]);
              setFilterModalVisible(false);
            }}
          >
            <Text style={styles.clearBtnText}>Limpar filtros</Text>
          </Pressable>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  backBtnPressed: {
    backgroundColor: '#2A2A2A',
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnPressed: {
    backgroundColor: '#2A2A2A',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
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
  // Modal / BottomSheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: '60%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: '#111',
  },
  categoryItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  categoryItemPressed: {
    backgroundColor: '#222',
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  clearBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
  },
  clearBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
});
