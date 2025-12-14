'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, ChevronLeft, ChevronRight, Check, ArrowRight, X, Package } from 'lucide-react';
import { Product, ProductCategory, PaginationMeta } from '@/lib/contentApi';
import { useHomeData } from '@/components/home/HomeDataProvider';
import { getImageUrl } from '@/lib/utils';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { SortDropdown } from '@/components/home/SortDropdown';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Tên A - Z', value: 'a-z' },
    { label: 'Tên Z - A', value: 'z-a' },
  ];

  const priceOptions = [
    { id: 'all', label: 'Tất cả' },
    { id: 'under-5', label: 'Dưới 5 triệu' },
    { id: '5-20', label: '5 - 20 triệu' },
    { id: 'over-20', label: 'Trên 20 triệu' },
    { id: 'contact', label: 'Liên hệ' },
  ];

  // Filter and sort products client-side
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...initialProducts];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => {
      if (priceRange === 'all') return true;
      const price = parseFloat(p.price);
      if (priceRange === 'contact') return isNaN(price) || price === 0;
      if (isNaN(price)) return false;

      if (priceRange === 'under-5') return price < 5000000;
      if (priceRange === '5-20') return price >= 5000000 && price <= 20000000;
      if (priceRange === 'over-20') return price > 20000000;
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'oldest':
        return filtered.reverse();
      case 'a-z':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return filtered;
    }
  }, [initialProducts, searchQuery, sortBy, priceRange]);

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
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`/san-pham?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePriceChange = (id: string) => {
    setPriceRange(id);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setPriceRange('all');
    handleCategoryChange(null);
  };

  const isFiltered = searchQuery !== '' || currentCategory || priceRange !== 'all';

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num) || num === 0) return null;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  // Filter Content Component
  const FilterContent = () => (
    <>
      <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-base tracking-tight">
        <Filter size={16} /> Danh mục
      </div>

      <ul className="space-y-0.5">
        <li>
          <button
            onClick={() => {
              handleCategoryChange(null);
              setIsMobileFilterOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
              ${!currentCategory
                ? 'bg-primary text-white font-medium'
                : 'text-slate-600 hover:bg-slate-50'
              }`}
          >
            <div className="flex justify-between items-center">
              Tất cả
              {!currentCategory && <ArrowRight size={12} />}
            </div>
          </button>
        </li>
        {categories.map(cat => (
          <li key={cat.id}>
            <button
              onClick={() => {
                handleCategoryChange(cat.slug);
                setIsMobileFilterOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${currentCategory === cat.slug
                  ? 'bg-primary text-white font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <div className="flex justify-between items-center">
                {cat.name}
                {currentCategory === cat.slug && <ArrowRight size={12} />}
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <h3 className="font-bold text-slate-900 mb-3 text-base tracking-tight">Khoảng giá</h3>
        <div className="space-y-1">
          {priceOptions.map((option) => (
            <label key={option.id} className="flex items-center gap-2.5 text-sm text-slate-600 cursor-pointer group py-1.5 px-1 rounded-md hover:bg-slate-50 transition-colors">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0 ${priceRange === option.id ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white group-hover:border-primary'
                }`}>
                {priceRange === option.id && <Check size={10} strokeWidth={3} />}
              </div>
              <input
                type="radio"
                name="price_range"
                value={option.id}
                checked={priceRange === option.id}
                onChange={() => {
                  handlePriceChange(option.id);
                  setIsMobileFilterOpen(false);
                }}
                className="hidden"
              />
              <span className={`group-hover:text-slate-900 ${priceRange === option.id ? 'font-medium text-slate-900' : ''}`}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <main className="bg-[#F8FAFC] py-4">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm' }]} />

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">Sản Phẩm</h1>
          <p className="text-slate-500 text-base">Thiết bị chính hãng, giải pháp tối ưu cho doanh nghiệp.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileFilterOpen(false)}></div>
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold text-slate-900">Bộ lọc</h3>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={24} className="text-slate-500" />
                  </button>
                </div>
                <FilterContent />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl p-2 pl-3 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between mb-5">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Tìm tên sản phẩm..."
                  className="w-full pl-10 pr-10 py-2.5 bg-transparent border-none text-sm focus:outline-none focus:ring-0 placeholder:text-slate-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto p-1">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl text-sm flex items-center gap-2 hover:bg-slate-200 transition-colors"
                >
                  <Filter size={16} /> Lọc
                </button>

                <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>

                {isFiltered && (
                  <button
                    onClick={clearAllFilters}
                    className="hidden md:flex items-center gap-1 text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <X size={14} /> Xóa
                  </button>
                )}
                <SortDropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
              </div>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <span className="text-slate-900 font-bold">{filteredAndSortedProducts.length}</span> sản phẩm
              </span>
              {isFiltered && (
                <button
                  onClick={clearAllFilters}
                  className="md:hidden text-xs font-bold text-red-500 flex items-center gap-1"
                >
                  <X size={12} /> Xóa lọc
                </button>
              )}
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredAndSortedProducts.map(product => (
                  <div key={product.id} className="group bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full relative">
                    {/* Image Area */}
                    <div className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3 group-hover:bg-slate-100 transition-colors">
                      {getImageUrl(product.thumbnail) ? (
                        <Image
                          src={getImageUrl(product.thumbnail)!}
                          alt={product.name}
                          fill
                          className="object-contain mix-blend-multiply p-4 transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : getImageUrl(settings?.placeholder) ? (
                        <Image
                          src={getImageUrl(settings?.placeholder)!}
                          alt="Placeholder"
                          fill
                          className="object-contain mix-blend-multiply p-4"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={36} className="text-slate-300" />
                        </div>
                      )}

                      {/* Hover Action */}
                      <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Link href={`/san-pham/${product.slug}`} className="block w-full py-2 bg-white/90 backdrop-blur text-slate-900 rounded-lg text-xs font-bold shadow-lg text-center hover:bg-primary hover:text-white transition-colors">
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1">
                      {product.categories && product.categories.length > 0 && (
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {product.categories[0].name}
                        </div>
                      )}
                      <Link href={`/san-pham/${product.slug}`}>
                        <h3 className="text-slate-900 font-semibold text-sm leading-snug mb-2 hover:text-primary transition-colors min-h-[36px] line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
                        <div className="font-bold text-sm text-primary">
                          {formatPrice(product.price) || <span className="text-slate-500 text-xs font-semibold">Liên hệ</span>}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  <Package size={20} />
                </div>
                <div className="text-slate-900 font-bold">Không tìm thấy sản phẩm</div>
                <button onClick={clearAllFilters} className="mt-3 px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-all ${currentPage === page
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-full bg-white text-slate-600 border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
