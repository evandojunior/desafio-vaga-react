import { useAppStore } from '../src/store';
import { storeRepository } from '../src/repositories/StoreRepository';
import { productRepository } from '../src/repositories/ProductRepository';

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

describe('useAppStore – stores', () => {
  beforeEach(() => {
    useAppStore.setState({
      stores: [],
      storesLoading: false,
      storesError: null,
    });
  });

  it('fetches stores and updates state', async () => {
    const mockStores = [
      { id: '1', name: 'Loja A', address: 'Rua A', productsCount: 2, createdAt: new Date().toISOString() },
    ];
    mockedStoreRepo.getAll.mockResolvedValue(mockStores);

    await useAppStore.getState().fetchStores();

    expect(useAppStore.getState().stores).toEqual(mockStores);
    expect(useAppStore.getState().storesLoading).toBe(false);
  });

  it('handles fetch error gracefully', async () => {
    mockedStoreRepo.getAll.mockRejectedValue(new Error('Network error'));

    await useAppStore.getState().fetchStores();

    expect(useAppStore.getState().storesError).toBe('Network error');
    expect(useAppStore.getState().storesLoading).toBe(false);
  });

  it('creates a store and appends to list', async () => {
    const newStore = {
      id: '2',
      name: 'Loja Nova',
      address: 'Rua Nova, 99',
      productsCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockedStoreRepo.create.mockResolvedValue(newStore);

    await useAppStore.getState().createStore({ name: 'Loja Nova', address: 'Rua Nova, 99' });

    expect(useAppStore.getState().stores).toContainEqual(newStore);
  });

  it('deletes a store and removes from list', async () => {
    useAppStore.setState({
      stores: [
        { id: '1', name: 'Loja A', address: 'Rua A', productsCount: 0, createdAt: '' },
      ],
    });
    mockedStoreRepo.delete.mockResolvedValue(undefined);

    await useAppStore.getState().deleteStore('1');

    expect(useAppStore.getState().stores).toHaveLength(0);
  });
});

describe('useAppStore – products', () => {
  beforeEach(() => {
    useAppStore.setState({
      products: {},
      productsLoading: false,
      productsError: null,
      stores: [
        { id: 'store1', name: 'Loja A', address: 'Rua A', productsCount: 0, createdAt: '' },
      ],
    });
  });

  it('fetches products for a store', async () => {
    const mockProducts = [
      {
        id: 'p1',
        storeId: 'store1',
        name: 'Produto A',
        category: 'Roupas' as const,
        price: 50,
        createdAt: '',
      },
    ];
    mockedProductRepo.getByStore.mockResolvedValue(mockProducts);

    await useAppStore.getState().fetchProducts('store1');

    expect(useAppStore.getState().products['store1']).toEqual(mockProducts);
  });

  it('creates a product and updates store count', async () => {
    const newProduct = {
      id: 'p2',
      storeId: 'store1',
      name: 'Produto B',
      category: 'Eletrônicos' as const,
      price: 299,
      createdAt: '',
    };
    mockedProductRepo.create.mockResolvedValue(newProduct);

    await useAppStore
      .getState()
      .createProduct('store1', { name: 'Produto B', category: 'Eletrônicos', price: 299 });

    expect(useAppStore.getState().products['store1']).toContainEqual(newProduct);
    expect(useAppStore.getState().stores[0].productsCount).toBe(1);
  });
});
