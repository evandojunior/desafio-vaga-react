import { useAppStore } from '../src/store';
import { storeRepository } from '../src/repositories/StoreRepository';
import { productRepository } from '../src/repositories/ProductRepository';
import { Product, Store } from '../src/types';

// Mock repositories 
jest.mock('../src/repositories/StoreRepository', () => ({
  storeRepository: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../src/repositories/ProductRepository', () => ({
  productRepository: {
    getByStore: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedStoreRepo = storeRepository as jest.Mocked<typeof storeRepository>;
const mockedProductRepo = productRepository as jest.Mocked<typeof productRepository>;

describe('useAppStore – Unit Tests (Store & Product Modules)', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useAppStore.setState({
      stores: [],
      storesLoading: false,
      storesError: null,
      products: {},
      productsLoading: false,
      productsError: null,
    });
    jest.clearAllMocks();
  });

  describe('Stores Management', () => {
    it('fetches stores successfully and populates state', async () => {
      const mockStores: Store[] = [
        { id: '100', name: 'Virtual Store 1', address: 'Web Address 1', productsCount: 5, createdAt: new Date().toISOString() },
        { id: '101', name: 'Virtual Store 2', address: 'Web Address 2', productsCount: 1, createdAt: new Date().toISOString() },
      ];
      mockedStoreRepo.getAll.mockResolvedValue(mockStores);

      const storeState = useAppStore.getState();
      await storeState.fetchStores();

      expect(mockedStoreRepo.getAll).toHaveBeenCalledTimes(1);
      expect(useAppStore.getState().stores).toHaveLength(2);
      expect(useAppStore.getState().stores).toEqual(mockStores);
      expect(useAppStore.getState().storesLoading).toBe(false);
      expect(useAppStore.getState().storesError).toBeNull();
    });

    it('sets error state when fetching stores fails', async () => {
      mockedStoreRepo.getAll.mockRejectedValue(new Error('Testing network failure'));

      await useAppStore.getState().fetchStores();

      expect(useAppStore.getState().storesError).toBe('Testing network failure');
      expect(useAppStore.getState().storesLoading).toBe(false);
      expect(useAppStore.getState().stores).toHaveLength(0);
    });

    it('creates a new store properly', async () => {
      const newStore = {
        id: '200', name: 'New Boutique', address: '123 Fashion St', productsCount: 0, createdAt: new Date().toISOString()
      };
      mockedStoreRepo.create.mockResolvedValue(newStore);

      await useAppStore.getState().createStore({ name: 'New Boutique', address: '123 Fashion St' });

      expect(mockedStoreRepo.create).toHaveBeenCalledWith({ name: 'New Boutique', address: '123 Fashion St' });
      expect(useAppStore.getState().stores).toContainEqual(newStore);
    });

    it('deletes a store and removes it from state', async () => {
      useAppStore.setState({
        stores: [
          { id: '99', name: 'To be deleted', address: 'Void', productsCount: 0, createdAt: '' },
          { id: '100', name: 'Safe Store', address: 'Safe', productsCount: 0, createdAt: '' }
        ]
      });
      mockedStoreRepo.delete.mockResolvedValue();

      await useAppStore.getState().deleteStore('99');

      expect(mockedStoreRepo.delete).toHaveBeenCalledWith('99');
      expect(useAppStore.getState().stores).toHaveLength(1);
      expect(useAppStore.getState().stores[0].id).toBe('100');
    });
  });

  describe('Products Management', () => {
    const storeId = 'abc-123';
    
    beforeEach(() => {
      useAppStore.setState({
        stores: [{ id: storeId, name: 'Target Store', address: 'Main St', productsCount: 0, createdAt: '' }],
        products: {}
      });
    });

    it('fetches products specifically for a single store', async () => {
      const mockProducts: Product[] = [
        { id: 'p1', storeId, name: 'Soap', category: 'Higiene', price: 5, createdAt: '' },
        { id: 'p2', storeId, name: 'Towel', category: 'Outros', price: 20, createdAt: '' }
      ];
      mockedProductRepo.getByStore.mockResolvedValue(mockProducts);

      await useAppStore.getState().fetchProducts(storeId);

      expect(mockedProductRepo.getByStore).toHaveBeenCalledWith(storeId);
      expect(useAppStore.getState().products[storeId]).toHaveLength(2);
      expect(useAppStore.getState().products[storeId]).toEqual(mockProducts);
    });

    it('creates a product and updates the stores productCount locally', async () => {
      const newProduct: Product = {
        id: 'newP', storeId, name: 'Shampoo', category: 'Higiene', price: 15, createdAt: ''
      };
      mockedProductRepo.create.mockResolvedValue(newProduct);

      expect(useAppStore.getState().stores[0].productsCount).toBe(0);

      await useAppStore.getState().createProduct(storeId, { name: 'Shampoo', category: 'Higiene', price: 15 });

      // Verification of Product state
      expect(useAppStore.getState().products[storeId]).toHaveLength(1);
      expect(useAppStore.getState().products[storeId][0]).toEqual(newProduct);
      
      // Verification of Store state cascading
      expect(useAppStore.getState().stores[0].productsCount).toBe(1);
    });

    it('handles product fetch errors properly isolating by store', async () => {
      mockedProductRepo.getByStore.mockRejectedValue(new Error('Store not found'));

      await useAppStore.getState().fetchProducts(storeId);

      expect(useAppStore.getState().productsError).toBe('Store not found');
      expect(useAppStore.getState().productsLoading).toBe(false);
    });
  });
});
