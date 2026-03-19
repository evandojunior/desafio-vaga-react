import { renderHook, act } from '@testing-library/react-native';
import { useStores } from '../src/hooks/useStores';
import { useAppStore } from '../src/store';
import { storeRepository } from '../src/repositories/StoreRepository';
import { Store } from '../src/types';

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

const mockStores: Store[] = [
  { id: '1', name: 'Loja Centro', address: 'Rua A, 1', productsCount: 3, createdAt: '' },
  { id: '2', name: 'Loja Norte', address: 'Av. B, 2', productsCount: 0, createdAt: '' },
  { id: '3', name: 'Loja Sul', address: 'Rua Centro, 99', productsCount: 1, createdAt: '' },
];

describe('useStores hook', () => {
  beforeEach(() => {
    useAppStore.setState({ stores: [], storesLoading: false, storesError: null });
    mockedStoreRepo.getAll.mockResolvedValue(mockStores);
  });

  it('loads stores on mount', async () => {
    const { result } = renderHook(() => useStores());
    await act(async () => { });
    expect(result.current.stores).toHaveLength(3);
  });

  it('filters stores by name', async () => {
    const { result } = renderHook(() => useStores('Centro'));
    await act(async () => { });
    expect(result.current.stores.length).toBeGreaterThan(0);
    result.current.stores.forEach((s) => {
      const matchesName = s.name.toLowerCase().includes('centro');
      const matchesAddress = s.address.toLowerCase().includes('centro');
      expect(matchesName || matchesAddress).toBe(true);
    });
  });

  it('returns empty array when no match', async () => {
    const { result } = renderHook(() => useStores('xyzabc'));
    await act(async () => { });
    expect(result.current.stores).toHaveLength(0);
  });
});
