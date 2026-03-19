import { useEffect } from 'react';
import { useAppStore } from '../store';

export function useProducts(storeId: string, searchQuery = '') {
  const {
    products: allProducts,
    productsLoading,
    productsError,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useAppStore();

  const products = allProducts[storeId] ?? [];

  useEffect(() => {
    fetchProducts(storeId);
  }, [storeId]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    products: filtered,
    allProducts: products,
    isLoading: productsLoading,
    error: productsError,
    refetch: () => fetchProducts(storeId),
    createProduct: (data: Parameters<typeof createProduct>[1]) => createProduct(storeId, data),
    updateProduct: (productId: string, data: Parameters<typeof updateProduct>[2]) =>
      updateProduct(storeId, productId, data),
    deleteProduct: (productId: string) => deleteProduct(storeId, productId),
  };
}
