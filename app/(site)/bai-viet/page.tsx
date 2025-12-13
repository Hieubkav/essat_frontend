import { Metadata } from 'next';
import { getPosts, getCategories } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { PostsPageClient } from './PostsPageClient';

export const metadata: Metadata = {
  title: 'Bài viết - ESAT',
  description: 'Tin tức và bài viết mới nhất từ ESAT',
};

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function PostsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const homeData = await getHomePageData();
  const { categories } = await getCategories({ per_page: 100 });
  
  const categoryId = params.category
    ? categories.find((c) => c.slug === params.category)?.id
    : undefined;

  const { posts, meta } = await getPosts({
    per_page: 12,
    page: params.page ? parseInt(params.page) : 1,
    category_id: categoryId,
  });
  const pageKey = `${params.category ?? 'all'}-${params.page ?? '1'}`;

  return (
    <HomeDataProvider initialData={homeData}>
      <div key={pageKey} className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <PostsPageClient
            initialPosts={posts}
            categories={categories}
            initialMeta={meta}
            currentCategory={params.category}
          />
        </main>
        <Footer />
      </div>
    </HomeDataProvider>
  );
}
