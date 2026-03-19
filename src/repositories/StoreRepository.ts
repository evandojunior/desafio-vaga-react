import { Store, CreateStoreInput, UpdateStoreInput } from '../types';
import { storeAdapter } from '../adapters/store.adapter';
import { IStoreRepository } from './IStoreRepository';

const BASE_URL = '/api';

import { useAuthStore } from '../store/useAuthStore';

async function http<T>(url: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${BASE_URL}${url}`, {
    headers: { 
      'Content-Type': 'application/json', 
      Accept: 'application/json', 
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers 
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message ?? `HTTP ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export class StoreRepository implements IStoreRepository {
  async getAll(): Promise<Store[]> {
    const raw = await http<unknown[]>('/stores');
    return raw.map((r) => storeAdapter.fromResponse(r as Parameters<typeof storeAdapter.fromResponse>[0]));
  }

  async getById(id: string): Promise<Store> {
    const raw = await http<unknown>(`/stores/${id}`);
    return storeAdapter.fromResponse(raw as Parameters<typeof storeAdapter.fromResponse>[0]);
  }

  async create(data: CreateStoreInput): Promise<Store> {
    const raw = await http<unknown>('/stores', {
      method: 'POST',
      body: JSON.stringify(storeAdapter.toCreatePayload(data)),
    });
    return storeAdapter.fromResponse(raw as Parameters<typeof storeAdapter.fromResponse>[0]);
  }

  async update(id: string, data: UpdateStoreInput): Promise<Store> {
    const raw = await http<unknown>(`/stores/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(storeAdapter.toUpdatePayload(data)),
    });
    return storeAdapter.fromResponse(raw as Parameters<typeof storeAdapter.fromResponse>[0]);
  }

  async delete(id: string): Promise<void> {
    await http<void>(`/stores/${id}`, { method: 'DELETE' });
  }
}

export const storeRepository = new StoreRepository();
