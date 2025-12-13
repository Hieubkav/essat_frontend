'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight, Filter, ArrowLeft, ArrowRight, Package } from 'lucide-react';
import { Product, ProductCategory, PaginationMeta } from '@/lib/contentApi';
import { useHomeData } from '@/components/home/HomeDataProvider';
import { getImageUrl } from '@/lib/utils';

interface ProductsPageClientProps {
  initialProducts: Product[];
  categories: ProductCategory[];
  initialMeta?: PaginationMeta;
  currentCategory?: string;
}

export const ProductsPageClient: React.FC<ProductsPageClientProps> = ({
  initialProducts,
  categories,
  initialMeta,
  currentCategory,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useHomeData();
  const currentPage = initialMeta?.current_page || 1;
  const totalPages = initialMeta?.last_page || 1;

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`/san-pham?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/san-pham?${params.toString()}`);
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return num.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sản Phẩm</h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Link href="/" className="hover:text-white transition-colors">
                Trang chủ
              </Link>
              <ChevronRight size={16} />
              <span>Sản phẩm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={18} className="text-slate-500" />
              <span className="font-medium text-slate-700">Danh mục:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !currentCategory
                    ? 'bg-primary text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentCategory === cat.slug
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {initialProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {initialProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/san-pham/${product.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square relative overflow-hidden bg-slate-100">
                    {getImageUrl(product.thumbnail) ? (
                      <Image
                        src={getImageUrl(product.thumbnail)!}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : getImageUrl(settings?.placeholder) ? (
                      <Image
                        src={getImageUrl(settings?.placeholder)!}
                        alt="Placeholder"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={48} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem] md:min-h-[3rem]">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-slate-500 line-clamp-1 mt-1 hidden md:block">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-primary font-bold text-lg">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">Không có sản phẩm nào.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? 'bg-primary text-white'
                      : 'border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
