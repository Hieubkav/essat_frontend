'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, ChevronRight, Filter, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { Post, Category, PaginationMeta } from '@/lib/contentApi';
import { useHomeData } from '@/components/home/HomeDataProvider';
import { getImageUrl } from '@/lib/utils';

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
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/bai-viet?${params.toString()}`);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      {/* Hero Banner */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Bài Viết</h1>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Link href="/" className="hover:text-white transition-colors">
                Trang chủ
              </Link>
              <ChevronRight size={16} />
              <span>Bài viết</span>
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

          {/* Posts Grid */}
          {initialPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/bai-viet/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    {getImageUrl(post.thumbnail) ? (
                      <Image
                        src={getImageUrl(post.thumbnail)!}
                        alt={post.title}
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
                        <FileText size={48} className="text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-3">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-500">Không có bài viết nào.</p>
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
