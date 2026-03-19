import { Product, CreateProductInput, UpdateProductInput } from '../types';
import { productAdapter } from '../adapters/product.adapter';
import { IProductRepository } from './IProductRepository';

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

export class ProductRepository implements IProductRepository {
  async getByStore(storeId: string): Promise<Product[]> {
    const raw = await http<unknown[]>(`/stores/${storeId}/products`);
    return raw.map((r) => productAdapter.fromResponse(r as Parameters<typeof productAdapter.fromResponse>[0]));
  }

  async create(storeId: string, data: CreateProductInput): Promise<Product> {
    const raw = await http<unknown>(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(productAdapter.toCreatePayload(data)),
    });
    return productAdapter.fromResponse(raw as Parameters<typeof productAdapter.fromResponse>[0]);
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    const raw = await http<unknown>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productAdapter.toUpdatePayload(data)),
    });
    return productAdapter.fromResponse(raw as Parameters<typeof productAdapter.fromResponse>[0]);
  }

  async delete(id: string): Promise<void> {
    await http<void>(`/products/${id}`, { method: 'DELETE' });
  }
}

export const productRepository = new ProductRepository();
