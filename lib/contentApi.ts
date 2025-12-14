import api from './api';

// ==================== TYPES ====================

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  order: number;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  content: string;
  active: boolean;
  thumbnail: string | null;
  order: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  order: number;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductSimple {
  id: number;
  name: string;
  slug: string;
  thumbnail: string | null;
  price: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  content: string;
  thumbnail: string | null;
  images: string[];
  price: string;
  active: boolean;
  order: number;
  categories?: ProductCategory[];
  related_products?: ProductSimple[];
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
  has_more_pages?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination?: PaginationMeta;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ==================== POSTS API ====================

export async function getPosts(params?: {
  per_page?: number;
  page?: number;
  category_id?: number;
}): Promise<{ posts: Post[]; meta?: PaginationMeta }> {
  try {
    const response = await api.get<PaginatedResponse<Post>>('/posts', { params });
    return {
      posts: response.data.data?.items || [],
      meta: response.data.data?.pagination,
    };
  } catch {
    return { posts: [] };
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await api.get<SingleResponse<Post>>(`/posts/${slug}`);
    return response.data.data;
  } catch {
    return null;
  }
}

export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  try {
    const response = await api.get<SingleResponse<Post[]>>('/posts/latest', {
      params: { limit },
    });
    return response.data.data || [];
  } catch {
    return [];
  }
}

// ==================== CATEGORIES (Post Categories) API ====================

export async function getCategories(params?: {
  per_page?: number;
  page?: number;
}): Promise<{ categories: Category[]; meta?: PaginationMeta }> {
  try {
    const response = await api.get<PaginatedResponse<Category>>('/categories', { params });
    return {
      categories: response.data.data?.items || [],
      meta: response.data.data?.pagination,
    };
  } catch {
    return { categories: [] };
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await api.get<SingleResponse<Category>>(`/categories/${slug}`);
    return response.data.data;
  } catch {
    return null;
  }
}

// ==================== PRODUCTS API ====================

export async function getProducts(params?: {
  per_page?: number;
  page?: number;
  category_id?: number;
}): Promise<{ products: Product[]; meta?: PaginationMeta }> {
  try {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return {
      products: response.data.data?.items || [],
      meta: response.data.data?.pagination,
    };
  } catch {
    return { products: [] };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await api.get<SingleResponse<Product>>(`/products/${slug}`);
    return response.data.data;
  } catch {
    return null;
  }
}



// ==================== PRODUCT CATEGORIES API ====================

export async function getProductCategories(params?: {
  per_page?: number;
  page?: number;
}): Promise<{ categories: ProductCategory[]; meta?: PaginationMeta }> {
  try {
    const response = await api.get<PaginatedResponse<ProductCategory>>('/product-categories', { params });
    return {
      categories: response.data.data?.items || [],
      meta: response.data.data?.pagination,
    };
  } catch {
    return { categories: [] };
  }
}

export async function getProductCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  try {
    const response = await api.get<SingleResponse<ProductCategory>>(`/product-categories/${slug}`);
    return response.data.data;
  } catch {
    return null;
  }
}

// ==================== SEARCH API ====================

export async function searchContent(query: string): Promise<{
  products: Product[];
  posts: Post[];
}> {
  if (!query.trim()) {
    return { products: [], posts: [] };
  }

  try {
    const [productsRes, postsRes] = await Promise.all([
      getProducts({ per_page: 5 }),
      getPosts({ per_page: 5 }),
    ]);

    const lowerQuery = query.toLowerCase();

    const filteredProducts = productsRes.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );

    const filteredPosts = postsRes.posts.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.content?.toLowerCase().includes(lowerQuery)
    );

    return {
      products: filteredProducts.slice(0, 5),
      posts: filteredPosts.slice(0, 5),
    };
  } catch {
    return { products: [], posts: [] };
  }
}
