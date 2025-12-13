import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowLeft, Tag, Package, Phone } from 'lucide-react';
import { getProductBySlug, getFeaturedProducts } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { getImageUrl } from '@/lib/utils';
import { ProductDetailClient } from './ProductDetailClient';

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
    getFeaturedProducts(5),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = featuredProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <HomeDataProvider initialData={homeData}>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Breadcrumb */}
          <section className="bg-primary py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 text-white/80 text-sm flex-wrap">
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
                <ChevronRight size={14} />
                <Link href="/san-pham" className="hover:text-white transition-colors">
                  Sản phẩm
                </Link>
                <ChevronRight size={14} />
                <span className="text-white line-clamp-1">{product.name}</span>
              </div>
            </div>
          </section>

          {/* Product Detail */}
          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
                  {/* Product Image */}
                  <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-100">
                    {getImageUrl(product.thumbnail) ? (
                      <Image
                        src={getImageUrl(product.thumbnail)!}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={120} className="text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col">
                    {/* Categories */}
                    {product.categories && product.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/san-pham?category=${cat.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                          >
                            <Tag size={14} />
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Name */}
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                      {product.name}
                    </h1>

                    {/* Description */}
                    {product.description && (
                      <p className="text-slate-600 mb-6">{product.description}</p>
                    )}

                    {/* Price */}
                    <div className="bg-slate-50 rounded-xl p-6 mb-6">
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-primary">
                          {parseFloat(product.price).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    {/* Contact Button */}
                    <div className="mt-auto space-y-4">
                      <a
                        href={`tel:${homeData?.settings?.phone || ''}`}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <Phone size={20} />
                        Liên hệ mua hàng
                      </a>
                      <p className="text-center text-sm text-slate-500">
                        Gọi ngay để được tư vấn và báo giá tốt nhất
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Content - Client Component for dangerouslySetInnerHTML */}
                <ProductDetailClient content={product.content} />
              </div>

              {/* Back Button */}
              <div className="mt-6">
                <Link
                  href="/san-pham"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowLeft size={18} />
                  Quay lại danh sách sản phẩm
                </Link>
              </div>
            </div>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="py-10 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">
                  Sản phẩm liên quan
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      href={`/san-pham/${relatedProduct.slug}`}
                      className="group bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="aspect-square relative overflow-hidden bg-slate-100">
                        {getImageUrl(relatedProduct.thumbnail) ? (
                          <Image
                            src={getImageUrl(relatedProduct.thumbnail)!}
                            alt={relatedProduct.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={48} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="mt-2">
                          <span className="text-primary font-bold">
                            {parseFloat(relatedProduct.price).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </HomeDataProvider>
  );
}
