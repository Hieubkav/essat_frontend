'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getHomePageData,
  HomePageData,
  SettingsConfig,
  MenuItem,
  HeroConfig,
  StatsConfig,
  AboutConfig,
  ProductCategoriesConfig,
  FeaturedProductsConfig,
  PartnersConfig,
  NewsConfig,
  FooterConfig
} from '@/lib/homeApi';

interface HomeDataContextType {
  isLoading: boolean;
  settings: SettingsConfig | null;
  menus: MenuItem[];
  hero: HeroConfig | null;
  stats: StatsConfig | null;
  about: AboutConfig | null;
  categories: ProductCategoriesConfig | null;
  products: FeaturedProductsConfig | null;
  partners: PartnersConfig | null;
  news: NewsConfig | null;
  footer: FooterConfig | null;
}

const HomeDataContext = createContext<HomeDataContextType>({
  isLoading: true,
  settings: null,
  menus: [],
  hero: null,
  stats: null,
  about: null,
  categories: null,
  products: null,
  partners: null,
  news: null,
  footer: null,
});

export const useHomeData = () => useContext(HomeDataContext);

interface HomeDataProviderProps {
  children: ReactNode;
  initialData?: HomePageData | null;
}

export const HomeDataProvider: React.FC<HomeDataProviderProps> = ({ children, initialData }) => {
  // Nếu có initialData từ server, dùng luôn và không refetch
  // initialData đã fresh từ server-side render
  const { data, isLoading } = useQuery({
    queryKey: ['home-page-data'],
    queryFn: getHomePageData,
    initialData: initialData ?? undefined,
    // Khi có initialData, coi như data luôn fresh (không refetch ngay)
    // Server đã fetch data mới nhất rồi
    staleTime: initialData ? Infinity : 0,
    gcTime: 10 * 60 * 1000,
    // Không refetch khi có initialData vì server đã fetch mới nhất
    refetchOnMount: !initialData,
    refetchOnWindowFocus: !initialData,
  });

  const value: HomeDataContextType = {
    isLoading: initialData ? false : isLoading,
    settings: data?.settings ?? null,
    menus: data?.menus ?? [],
    hero: data?.components?.hero_carousel ?? null,
    stats: data?.components?.stats ?? null,
    about: data?.components?.about ?? null,
    categories: data?.components?.product_categories ?? null,
    products: data?.components?.featured_products ?? null,
    partners: data?.components?.partners ?? null,
    news: data?.components?.news ?? null,
    footer: data?.components?.footer ?? null,
  };

  return (
    <HomeDataContext.Provider value={value}>
      {children}
    </HomeDataContext.Provider>
  );
};
