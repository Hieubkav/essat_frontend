import api from './api';

// Types cho Settings API
export interface SettingsConfig {
  site_name: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  seo_title: string | null;
  seo_description: string | null;
  phone: string | null;
  address: string | null;
  email: string | null;
  logo: string | null;
  favicon: string | null;
  placeholder: string | null;
  updated_at: string | null;
}

export interface SettingsResponse {
  success: boolean;
  data: SettingsConfig;
}

export async function getSettingsData(): Promise<SettingsConfig | null> {
  try {
    const response = await api.get<SettingsResponse>('/settings');
    return response.data.data;
  } catch {
    return null;
  }
}

// Types cho Home Components từ API
export interface HeroSlide {
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
  link?: string;
  button_text?: string;
}

export interface HeroConfig {
  slides: HeroSlide[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsConfig {
  items: StatItem[];
}

export interface AboutFeature {
  title: string;
  description: string;
}

export interface AboutConfig {
  badge: string;
  title: string;
  subtitle?: string;
  description: string;
  quote: string;
  image?: string;
  features: AboutFeature[];
}

export interface CategoryItem {
  image: string;
  name: string;
  description?: string;
  link: string;
}

export interface ProductCategoriesConfig {
  title: string;
  categories: CategoryItem[];
}

export interface ProductItem {
  image: string;
  name: string;
  price: string;
  link: string;
}

export interface FeaturedProductsConfig {
  title: string;
  subtitle?: string;
  display_mode: string;
  limit: number;
  view_all_link: string;
  products: ProductItem[];
}

export interface PartnerItem {
  logo: string;
  name: string;
  link?: string;
}

export interface PartnersConfig {
  title: string;
  auto_scroll?: boolean;
  partners: PartnerItem[];
}

export interface NewsPost {
  image: string;
  title: string;
  link: string;
  excerpt?: string;
  date?: string;
}

export interface NewsConfig {
  title: string;
  subtitle?: string;
  display_mode: string;
  limit: number;
  view_all_link: string;
  posts?: NewsPost[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface PolicyLink {
  label: string;
  link: string;
}

export interface FooterConfig {
  company_name: string;
  address: string;
  phone: string;
  hotline?: string;
  email: string;
  copyright?: string;
  social_links?: SocialLink[];
  policies?: PolicyLink[];
  // Legacy fields for backward compatibility
  facebook_url?: string;
  messenger_url?: string;
  zalo_url?: string;
}

export interface HomeComponent<T = unknown> {
  id: number;
  type: string;
  order: number;
  active: boolean;
  config: T;
}

export interface HomeComponentsResponse {
  success: boolean;
  data: HomeComponent[];
}

export interface SingleHomeComponentResponse<T> {
  success: boolean;
  data: HomeComponent<T>;
}

// API functions
export async function getHomeComponents(): Promise<HomeComponent[]> {
  const response = await api.get<HomeComponentsResponse>('/home-components');
  return response.data.data;
}

export async function getHomeComponentByType<T>(type: string): Promise<HomeComponent<T> | null> {
  try {
    const response = await api.get<SingleHomeComponentResponse<T>>(`/home-components/${type}`);
    return response.data.data;
  } catch {
    return null;
  }
}

// Helper hooks sử dụng SWR hoặc React Query có thể thêm sau
// Hiện tại dùng simple fetch với useEffect

export async function getHeroData(): Promise<HeroConfig | null> {
  const component = await getHomeComponentByType<HeroConfig>('hero_carousel');
  return component?.config ?? null;
}

export async function getStatsData(): Promise<StatsConfig | null> {
  const component = await getHomeComponentByType<StatsConfig>('stats');
  return component?.config ?? null;
}

export async function getAboutData(): Promise<AboutConfig | null> {
  const component = await getHomeComponentByType<AboutConfig>('about');
  return component?.config ?? null;
}

export async function getProductCategoriesData(): Promise<ProductCategoriesConfig | null> {
  const component = await getHomeComponentByType<ProductCategoriesConfig>('product_categories');
  return component?.config ?? null;
}

export async function getFeaturedProductsData(): Promise<FeaturedProductsConfig | null> {
  const component = await getHomeComponentByType<FeaturedProductsConfig>('featured_products');
  return component?.config ?? null;
}

export async function getPartnersData(): Promise<PartnersConfig | null> {
  const component = await getHomeComponentByType<PartnersConfig>('partners');
  return component?.config ?? null;
}

export async function getNewsData(): Promise<NewsConfig | null> {
  const component = await getHomeComponentByType<NewsConfig>('news');
  return component?.config ?? null;
}

export async function getFooterData(): Promise<FooterConfig | null> {
  const component = await getHomeComponentByType<FooterConfig>('footer');
  return component?.config ?? null;
}

// Menu types
export interface MenuChild {
  label: string;
  href: string;
}

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuChild[];
}

export interface MenusResponse {
  success: boolean;
  data: MenuItem[];
}

export async function getMenusData(): Promise<MenuItem[]> {
  try {
    const response = await api.get<MenusResponse>('/menus');
    return response.data.data;
  } catch {
    return [];
  }
}
