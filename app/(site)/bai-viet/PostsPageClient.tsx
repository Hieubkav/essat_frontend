'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ArrowRight, Search, Filter, ChevronLeft, ChevronRight, X, FileText } from 'lucide-react';
import { Post, Category, PaginationMeta } from '@/lib/contentApi';
import { useHomeData } from '@/components/home/HomeDataProvider';
import { getImageUrl } from '@/lib/utils';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { SortDropdown } from '@/components/home/SortDropdown';

interface PostsPageClientProps {
  initialPosts: Post[];
  categories: Category[];
  initialMeta?: PaginationMeta;
  currentCategory?: string;
}

export const PostsPageClient: React.FC<PostsPageClientProps> = ({
  initialPosts,
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Tiêu đề A - Z', value: 'a-z' },
    { label: 'Tiêu đề Z - A', value: 'z-a' },
  ];

  // Filter and sort posts client-side
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...initialPosts];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    const parseDate = (dateStr: string) => new Date(dateStr).getTime();

    switch (sortBy) {
      case 'newest':
        return filtered.sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at));
      case 'oldest':
        return filtered.sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at));
      case 'a-z':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'z-a':
        return filtered.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return filtered;
    }
  }, [initialPosts, searchQuery, sortBy]);

  const handleCategoryChange = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.delete('page');
    router.push(`/bai-viet?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', page.toString());
      router.push(`/bai-viet?${params.toString()}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    handleCategoryChange(null);
  };

  const isFiltered = searchQuery !== '' || currentCategory;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Filter Sidebar Component
  const FilterContent = () => (
    <>
      <div className="flex items-center gap-2 mb-6 text-slate-900 font-bold text-lg tracking-tight">
        <Filter size={18} /> Danh mục
      </div>
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => {
              handleCategoryChange(null);
              setIsMobileFilterOpen(false);
            }}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 border border-transparent
              ${!currentCategory
                ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'
              }`}
          >
            <div className="flex justify-between items-center">
              Tất cả
              {!currentCategory && <ArrowRight size={14} />}
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
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 border border-transparent
                ${currentCategory === cat.slug
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:border-slate-200'
                }`}
            >
              <div className="flex justify-between items-center">
                {cat.name}
                {currentCategory === cat.slug && <ArrowRight size={14} />}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-2 pb-2">
      <div className="container mx-auto px-4 max-w-7xl relative">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Bài viết' }]} />

        {/* Title Section */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">Tin Tức & Kiến Thức</h1>
          <p className="text-slate-500 text-base">Cập nhật công nghệ, giải pháp và xu hướng mới nhất.</p>
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
                  placeholder="Tìm kiếm bài viết..."
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

            {/* Results Count & Mobile Clear */}
            <div className="flex justify-between items-center mb-4 px-1">
              <span className="text-sm font-medium text-slate-500">
                Hiển thị <span className="text-slate-900 font-bold">{filteredAndSortedPosts.length}</span> kết quả
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

            {/* Grid */}
            {filteredAndSortedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAndSortedPosts.map((article) => (
                  <Link
                    key={article.id}
                    href={`/bai-viet/${article.slug}`}
                    className="group flex flex-col bg-white rounded-xl border border-transparent shadow-sm hover:shadow-lg hover:border-slate-100 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {getImageUrl(article.thumbnail) ? (
                        <Image
                          src={getImageUrl(article.thumbnail)!}
                          alt={article.title}
                          fill
                          className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : getImageUrl(settings?.placeholder) ? (
                        <Image
                          src={getImageUrl(settings?.placeholder)!}
                          alt="Placeholder"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <FileText size={36} className="text-slate-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {article.category && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-bold rounded-full shadow-sm">
                            {article.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 mb-2">
                        <Calendar size={11} /> {formatDate(article.created_at)}
                      </div>

                      <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>

                      <div className="mt-auto pt-3 flex items-center text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">
                        Đọc tiếp <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-slate-200">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-3">
                  <Search size={20} />
                </div>
                <div className="text-slate-900 font-bold">Không tìm thấy bài viết</div>
                <div className="text-slate-500 text-sm mb-3">Thử thay đổi từ khóa hoặc bộ lọc</div>
                <button onClick={clearAllFilters} className="px-5 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
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
    </div>
  );
};
