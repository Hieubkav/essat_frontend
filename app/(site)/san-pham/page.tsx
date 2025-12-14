import { Metadata } from 'next';
import { getProducts, getProductCategories } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { ProductsPageClient } from './ProductsPageClient';

export const metadata: Metadata = {
  title: 'Sản phẩm - ESAT',
  description: 'Khám phá các sản phẩm công nghệ chất lượng từ ESAT',
};

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const homeData = await getHomePageData();
  const { categories } = await getProductCategories({ per_page: 100 });

  const categoryId = params.category
    ? categories.find((c) => c.slug === params.category)?.id
    : undefined;

  const { products, meta } = await getProducts({
    per_page: 12,
    page: params.page ? parseInt(params.page) : 1,
    category_id: categoryId,
  });

  return (
    <HomeDataProvider initialData={homeData}>
      <Header />
      <ProductsPageClient
        initialProducts={products}
        categories={categories}
        initialMeta={meta}
        currentCategory={params.category}
      />
      <Footer />
    </HomeDataProvider>
  );
}
