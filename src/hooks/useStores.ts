import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useStores(searchQuery = '') {
  const { stores, storesLoading, storesError, fetchStores, createStore, updateStore, deleteStore } =
    useAppStore();

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter(
    (s) => {
      const nameMatch = (s?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const addrMatch = (s?.address || '').toLowerCase().includes(searchQuery.toLowerCase());
      return nameMatch || addrMatch;
    }
  );

  return {
    stores: filtered,
    allStores: stores,
    isLoading: storesLoading,
    error: storesError,
    refetch: fetchStores,
    createStore,
    updateStore,
    deleteStore,
  };
}

export function useStore(id: string) {
  const { stores, fetchStores } = useAppStore();
  const store = stores.find((s) => s.id === id);

  useEffect(() => {
    if (!store) fetchStores();
  }, [id]);

  return store;
}
