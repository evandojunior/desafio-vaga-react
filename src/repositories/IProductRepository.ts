import { Product, CreateProductInput, UpdateProductInput } from '../types';

export interface IProductRepository {
  getByStore(storeId: string): Promise<Product[]>;
  create(storeId: string, data: CreateProductInput): Promise<Product>;
  update(id: string, data: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}
