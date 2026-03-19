// ─── Store ────────────────────────────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  address: string;
  productsCount: number;
  createdAt: string;
}

export type CreateStoreInput = Pick<Store, 'name' | 'address'>;
export type UpdateStoreInput = Partial<CreateStoreInput>;

// ─── Product ──────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'Roupas'
  | 'Calçados'
  | 'Acessórios'
  | 'Eletrônicos'
  | 'Alimentos'
  | 'Bebidas'
  | 'Higiene'
  | 'Papelaria'
  | 'Brinquedos'
  | 'Outros';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Roupas',
  'Calçados',
  'Acessórios',
  'Eletrônicos',
  'Alimentos',
  'Bebidas',
  'Higiene',
  'Papelaria',
  'Brinquedos',
  'Outros',
];

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: ProductCategory;
  price: number;
  createdAt: string;
}

export type CreateProductInput = Pick<Product, 'name' | 'category' | 'price'>;
export type UpdateProductInput = Partial<CreateProductInput>;

// ─── API response ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status: number;
}
