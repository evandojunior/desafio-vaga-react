import { Product, ProductCategory, CreateProductInput, UpdateProductInput } from '../types';

// ─── Raw API response shape ────────────────────────────────────────────────────

interface RawProductResponse {
  id: string;
  storeId?: string;
  store_id?: string;
  store?: { id?: string };
  name: string;
  category: string;
  price?: number | string | null;
  createdAt?: string;
  created_at?: string;
}

// ─── Adapter ──────────────────────────────────────────────────────────────────

export const productAdapter = {
  /** Converts raw API response → typed Product model */
  fromResponse(raw: RawProductResponse): Product {
    // MirageJS belongsTo pode aninhar o id em raw.store.id
    const storeId = raw.storeId ?? raw.store_id ?? raw.store?.id ?? '';

    // Normaliza price: string com vírgula, undefined ou NaN → 0
    let price = 0;
    if (raw.price !== undefined && raw.price !== null) {
      const normalized =
        typeof raw.price === 'string'
          ? parseFloat(raw.price.replace(',', '.'))
          : Number(raw.price);
      price = isNaN(normalized) ? 0 : normalized;
    }

    return {
      id: raw.id,
      storeId,
      name: raw.name,
      category: raw.category as ProductCategory,
      price,
      createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    };
  },

  /** Converts input → API create/update payload */
  toCreatePayload(data: CreateProductInput): Record<string, unknown> {
    return {
      name: data.name.trim(),
      category: data.category,
      price: Number(data.price),
    };
  },

  toUpdatePayload(data: UpdateProductInput): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.category !== undefined) payload.category = data.category;
    if (data.price !== undefined) payload.price = Number(data.price);
    return payload;
  },
};
