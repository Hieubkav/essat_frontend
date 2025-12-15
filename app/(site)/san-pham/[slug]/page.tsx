import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { getProductBySlug } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { ProductDetailClient } from './ProductDetailClient';
import { ProductGallery } from './ProductGallery';
import { RelatedProductsCarousel } from './RelatedProductsCarousel';
import { DescriptionWithExpand } from './DescriptionWithExpand';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Không tìm thấy sản phẩm' };
  }

  return {
    title: `${product.name} - ESAT`,
    description: product.description || product.content?.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [homeData, product] = await Promise.all([
    getHomePageData(),
    getProductBySlug(slug),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = product.related_products || [];

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num) || num === 0) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <HomeDataProvider initialData={homeData}>
      <Header />
      <main className="bg-[#F8FAFC]">
        <div className="container mx-auto px-4 max-w-7xl py-4">
            {/* Breadcrumb */}
            <nav className="flex items-center text-xs text-slate-500 mb-2">
              <Link href="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <ChevronRight size={12} className="mx-1.5 text-slate-400" />
              <Link href="/san-pham" className="hover:text-primary transition-colors">
                Sản phẩm
              </Link>
              <ChevronRight size={12} className="mx-1.5 text-slate-400" />
              <span className="text-slate-700 font-medium truncate max-w-[180px] md:max-w-sm">{product.name}</span>
            </nav>

            {/* --- MAIN PRODUCT INFO SECTION --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 lg:p-8 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left: Gallery */}
                <ProductGallery
                  thumbnail={product.thumbnail}
                  images={product.images || []}
                  productName={product.name}
                />

                {/* Right: Info */}
                <div className="flex flex-col h-full py-2">
                  <div className="flex items-center justify-between mb-4">
                    {product.categories && product.categories.length > 0 && (
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                        {product.categories[0].name}
                      </span>
                    )}
                    <ProductDetailClient content={null} />
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-5 leading-tight tracking-tight">
                    {product.name}
                  </h1>

                  <div className="mb-6 pb-6 border-b border-slate-100">
                    <span className="text-3xl lg:text-4xl font-medium text-slate-900 tracking-tight">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {product.description && (
                    <div className="text-slate-600 mb-6 leading-relaxed text-sm">
                      <p>{product.description}</p>
                    </div>
                  )}

                  <div className="mt-auto">
                    <a
                      href="/lien-he-mua-hang"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-full bg-slate-900 text-white font-medium rounded-full py-4 px-6 shadow-lg hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Liên hệ tư vấn</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* --- DETAILED DESCRIPTION --- */}
            {product.content && (
              <div className="bg-white rounded-2xl p-5 lg:p-8 shadow-sm border border-slate-100 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Mô tả sản phẩm</h3>
                <DescriptionWithExpand content={product.content} />
              </div>
            )}

            {/* --- RELATED PRODUCTS --- */}
            {relatedProducts.length > 0 && (
              <RelatedProductsCarousel relatedProducts={relatedProducts} />
            )}
        </div>
      </main>
      <Footer />
    </HomeDataProvider>
  );
}
