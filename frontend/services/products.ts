import { apiGet } from '@/utils/api';
import { dummyProducts, dummyCategories } from '@/data/dummyProducts';

export interface ProductList {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  customizable: boolean;
  image_url?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt?: string;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  category: string;
  stock: number;
  customizable: boolean;
  customization_schema?: Record<string, unknown>;
  is_active: boolean;
  images: ProductImage[];
  created_at: string;
}

/** Map dummy product to API Product shape */
function dummyToProduct(d: (typeof dummyProducts)[number]): Product {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    price: d.price,
    category: d.category,
    stock: 50,
    customizable: d.customizable,
    is_active: true,
    images: (d.images ?? []).map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      sort_order: img.sort_order,
    })),
    created_at: new Date().toISOString(),
  };
}

/** Map dummy product to ProductList shape */
function dummyToList(d: (typeof dummyProducts)[number]): ProductList {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    price: d.price,
    category: d.category,
    customizable: d.customizable,
    image_url: d.image_url,
  };
}

export async function getProducts(params?: {
  category?: string;
  min_price?: number;
  max_price?: number;
  customizable?: boolean;
  sort?: string;
  skip?: number;
  limit?: number;
}): Promise<ProductList[]> {
  try {
    const search = new URLSearchParams();
    if (params?.category) search.set('category', params.category);
    if (params?.min_price != null) search.set('min_price', String(params.min_price));
    if (params?.max_price != null) search.set('max_price', String(params.max_price));
    if (params?.customizable != null) search.set('customizable', String(params.customizable));
    if (params?.sort) search.set('sort', params.sort);
    if (params?.skip != null) search.set('skip', String(params.skip));
    if (params?.limit != null) search.set('limit', String(params.limit));
    const q = search.toString();
    return await apiGet<ProductList[]>(`/products${q ? `?${q}` : ''}`);
  } catch {
    let list = dummyProducts.map(dummyToList);
    if (params?.category) list = list.filter((p) => p.category === params.category);
    if (params?.min_price != null) list = list.filter((p) => p.price >= params.min_price!);
    if (params?.max_price != null) list = list.filter((p) => p.price <= params.max_price!);
    if (params?.customizable != null) list = list.filter((p) => p.customizable === params.customizable);
    const skip = params?.skip ?? 0;
    const limit = params?.limit ?? 24;
    return list.slice(skip, skip + limit);
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    return await apiGet<string[]>('/products/categories');
  } catch {
    return [...dummyCategories];
  }
}

export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    return await apiGet<Product>(`/products/by-slug/${slug}`);
  } catch {
    const d = dummyProducts.find((p) => p.slug === slug);
    if (!d) throw new Error('Product not found');
    return dummyToProduct(d);
  }
}

export async function getProduct(id: number): Promise<Product> {
  try {
    return await apiGet<Product>(`/products/${id}`);
  } catch {
    const d = dummyProducts.find((p) => p.id === id);
    if (!d) throw new Error('Product not found');
    return dummyToProduct(d);
  }
}
