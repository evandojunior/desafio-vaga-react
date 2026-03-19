import { Store, CreateStoreInput, UpdateStoreInput } from '../types';

// ─── Raw API response shape ────────────────────────────────────────────────────

interface RawStoreResponse {
  id: string;
  name: string;
  address: string;
  productsCount?: number;
  products_count?: number;
  createdAt?: string;
  created_at?: string;
}

// ─── Adapter ──────────────────────────────────────────────────────────────────

export const storeAdapter = {
  /** Converts raw API response → typed Store model */
  fromResponse(raw: RawStoreResponse): Store {
    return {
      id: raw.id,
      name: raw.name,
      address: raw.address,
      productsCount: raw.productsCount ?? raw.products_count ?? 0,
      createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    };
  },

  /** Converts Store model → API create/update payload */
  toCreatePayload(data: CreateStoreInput): Record<string, unknown> {
    return {
      name: data.name.trim(),
      address: data.address.trim(),
    };
  },

  toUpdatePayload(data: UpdateStoreInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.address !== undefined) payload.address = data.address.trim();
    return payload;
  },
};
