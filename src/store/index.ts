import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Store, Product, CreateStoreInput, UpdateStoreInput, CreateProductInput, UpdateProductInput } from '../types';
import { storeRepository } from '../repositories/StoreRepository';
import { productRepository } from '../repositories/ProductRepository';

interface StoreSlice {
  stores: Store[];
  storesLoading: boolean;
  storesError: string | null;

  fetchStores: () => Promise<void>;
  createStore: (data: CreateStoreInput) => Promise<Store>;
  updateStore: (id: string, data: UpdateStoreInput) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
}


interface ProductSlice {
  products: Record<string, Product[]>;
  productsLoading: boolean;
  productsError: string | null;

  fetchProducts: (storeId: string) => Promise<void>;
  createProduct: (storeId: string, data: CreateProductInput) => Promise<Product>;
  updateProduct: (storeId: string, productId: string, data: UpdateProductInput) => Promise<void>;
  deleteProduct: (storeId: string, productId: string) => Promise<void>;
}

type AppState = StoreSlice & ProductSlice;

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      stores: [],
      storesLoading: false,
      storesError: null,

      fetchStores: async () => {
        set({ storesLoading: true, storesError: null });
        try {
          const stores = await storeRepository.getAll();
          set({ stores, storesLoading: false });
        } catch (err) {
          set({ storesError: (err as Error).message, storesLoading: false });
        }
      },

      createStore: async (data) => {
        const store = await storeRepository.create(data);
        set((s) => ({ stores: [...s.stores, store] }));
        return store;
      },

      updateStore: async (id, data) => {
        const updated = await storeRepository.update(id, data);
        set((s) => ({
          stores: s.stores.map((store) => (store.id === id ? updated : store)),
        }));
      },

      deleteStore: async (id) => {
        await storeRepository.delete(id);
        set((s) => ({
          stores: s.stores.filter((store) => store.id !== id),
          products: Object.fromEntries(
            Object.entries(s.products).filter(([key]) => key !== id)
          ),
        }));
      },

      products: {},
      productsLoading: false,
      productsError: null,

      fetchProducts: async (storeId) => {
        set({ productsLoading: true, productsError: null });
        try {
          const products = await productRepository.getByStore(storeId);
          set((s) => ({
            products: { ...s.products, [storeId]: products },
            productsLoading: false,
          }));
        } catch (err) {
          set({ productsError: (err as Error).message, productsLoading: false });
        }
      },

      createProduct: async (storeId, data) => {
        const product = await productRepository.create(storeId, data);
        set((s) => ({
          products: {
            ...s.products,
            [storeId]: [...(s.products[storeId] ?? []), product],
          },
          stores: s.stores.map((store) =>
            store.id === storeId
              ? { ...store, productsCount: store.productsCount + 1 }
              : store
          ),
        }));
        return product;
      },

      updateProduct: async (storeId, productId, data) => {
        const updated = await productRepository.update(productId, data);
        set((s) => ({
          products: {
            ...s.products,
            [storeId]: (s.products[storeId] ?? []).map((p) =>
              p.id === productId ? updated : p
            ),
          },
        }));
      },

      deleteProduct: async (storeId, productId) => {
        await productRepository.delete(productId);
        set((s) => ({
          products: {
            ...s.products,
            [storeId]: (s.products[storeId] ?? []).filter((p) => p.id !== productId),
          },
          stores: s.stores.map((store) =>
            store.id === storeId
              ? { ...store, productsCount: Math.max(0, store.productsCount - 1) }
              : store
          ),
        }));
      },
    }),
    {
      name: 'app-storage',
      version: 2,
      migrate: () => ({ stores: [], products: {} }),
      storage: createJSONStorage(() => AsyncStorage),
      partialize: () => ({}),
    }
  )
);

export const selectStores = (state: AppState) => state.stores;
export const selectProducts = (storeId: string) => (state: AppState) =>
  state.products[storeId] ?? [];
