import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, Package } from 'lucide-react';
import { getProductBySlug, getFeaturedProducts } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { getImageUrl } from '@/lib/utils';
import { ProductDetailClient } from './ProductDetailClient';
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
  const [homeData, product, featuredProducts] = await Promise.all([
    getHomePageData(),
    getProductBySlug(slug),
    getFeaturedProducts(8),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = featuredProducts.filter((p) => p.id !== product.id).slice(0, 8);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num) || num === 0) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <HomeDataProvider initialData={homeData}>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-x-hidden">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 max-w-7xl pt-2 pb-2">
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
                <div className="flex flex-col lg:flex-row gap-4 lg:sticky lg:top-24">
                   {/* Ảnh chính */}
                   <div className="relative aspect-square flex-1 bg-[#F8FAFC] rounded-xl overflow-hidden flex items-center justify-center p-8 group transition-colors duration-500 order-1 lg:order-2">
                     {getImageUrl(product.thumbnail) ? (
                       <Image
                         src={getImageUrl(product.thumbnail)!}
                         alt={product.name}
                         fill
                         className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out p-6"
                         priority
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center">
                         <Package size={80} className="text-slate-300" />
                       </div>
                     )}
                   </div>

                   {/* Ảnh phụ */}
                   <div className="grid grid-cols-4 lg:grid-cols-1 gap-1.5 order-2 lg:order-1">
                     {[0, 1, 2, 3].map((idx) => (
                       <button
                         key={idx}
                         className={`h-20 w-20 rounded-lg bg-[#F8FAFC] p-2 transition-all duration-300 flex-shrink-0 ${idx === 0 ? 'ring-2 ring-slate-900 ring-offset-1' : 'hover:bg-slate-100'}`}
                       >
                         {getImageUrl(product.thumbnail) ? (
                           <Image
                             src={getImageUrl(product.thumbnail)!}
                             alt=""
                             width={80}
                             height={80}
                             className="w-full h-full object-contain mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity"
                           />
                         ) : (
                           <div className="w-full h-full bg-slate-200 rounded" />
                         )}
                       </button>
                     ))}
                   </div>
                </div>

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
                      href={`tel:${homeData?.settings?.phone || ''}`}
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
              <div className="bg-white rounded-2xl p-5 lg:p-8 shadow-sm border border-slate-100 mb-10">
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
      </div>
    </HomeDataProvider>
  );
}
