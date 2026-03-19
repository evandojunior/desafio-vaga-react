import { Store, CreateStoreInput, UpdateStoreInput } from '../types';

export interface IStoreRepository {
  getAll(): Promise<Store[]>;
  getById(id: string): Promise<Store>;
  create(data: CreateStoreInput): Promise<Store>;
  update(id: string, data: UpdateStoreInput): Promise<Store>;
  delete(id: string): Promise<void>;
}
