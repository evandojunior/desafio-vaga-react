/**
 * api.ts – thin re-export layer kept for backwards compatibility with tests.
 * The real logic now lives in the Repository + Adapter layers.
 *
 * src/repositories/StoreRepository.ts   ← Repository pattern
 * src/repositories/ProductRepository.ts ← Repository pattern
 * src/adapters/store.adapter.ts         ← Adapter pattern
 * src/adapters/product.adapter.ts       ← Adapter pattern
 */

import { Store, Product, CreateStoreInput, UpdateStoreInput, CreateProductInput, UpdateProductInput } from '../types';
import { storeRepository } from '../repositories/StoreRepository';
import { productRepository } from '../repositories/ProductRepository';

export const storeApi = {
  getAll: (): Promise<Store[]> => storeRepository.getAll(),
  getById: (id: string): Promise<Store> => storeRepository.getById(id),
  create: (data: CreateStoreInput): Promise<Store> => storeRepository.create(data),
  update: (id: string, data: UpdateStoreInput): Promise<Store> => storeRepository.update(id, data),
  delete: (id: string): Promise<void> => storeRepository.delete(id),
};

export const productApi = {
  getByStore: (storeId: string): Promise<Product[]> => productRepository.getByStore(storeId),
  create: (storeId: string, data: CreateProductInput): Promise<Product> =>
    productRepository.create(storeId, data),
  update: (id: string, data: UpdateProductInput): Promise<Product> =>
    productRepository.update(id, data),
  delete: (id: string): Promise<void> => productRepository.delete(id),
};
