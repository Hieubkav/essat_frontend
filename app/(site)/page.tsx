import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { About } from '@/components/home/About';
import { CategoryList } from '@/components/home/CategoryList';
import { Products } from '@/components/home/Products';
import { Partners } from '@/components/home/Partners';
import { News } from '@/components/home/News';
import { Footer } from '@/components/home/Footer';
import { DynamicComponents } from '@/components/home/DynamicComponents';
import { getHomePageData } from '@/lib/homeApi';

export const metadata = {
    title: 'ESAT - Giải pháp công nghệ toàn diện',
    description: 'ESAT - Đối tác công nghệ chiến lược và toàn diện. Phân phối thiết bị, cung cấp giải pháp công nghệ giúp doanh nghiệp tối ưu vận hành.',
};

// Force dynamic rendering trong development để luôn fetch data mới
// Production sẽ dùng ISR với on-demand revalidation
export const dynamic = 'force-dynamic';

// Map type từ API sang component
const COMPONENT_MAP: Record<string, React.ComponentType> = {
    hero_carousel: Hero,
    stats: Stats,
    about: About,
    product_categories: CategoryList,
    featured_products: Products,
    partners: Partners,
    news: News,
};

export default async function Home() {
    const data = await getHomePageData();
    const firstHeroImage = data?.components?.data?.hero_carousel?.slides?.[0]?.image;
    const componentOrder = data?.components?.order ?? [];

    return (
        <>
            {firstHeroImage && (
                <link rel="preload" as="image" href={firstHeroImage} />
            )}
            <HomeDataProvider initialData={data}>
                <Header />
                <main className="bg-white">
                    <DynamicComponents order={componentOrder} componentMap={COMPONENT_MAP} />
                </main>
                <Footer />
            </HomeDataProvider>
        </>
    );
}
