import type { CSSProperties } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Calendar, FileText, Hash } from 'lucide-react';
import { getPostBySlug, getLatestPosts } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { getImageUrl } from '@/lib/utils';
import { PostDetailClient, PostShareActions } from './PostDetailClient';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { Badge } from '@/components/home/ui/Badge';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Không tìm thấy bài viết' };
  }

  return {
    title: `${post.title} - ESAT`,
    description: post.content?.replace(/<[^>]*>/g, '').substring(0, 160),
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [homeData, post, latestPosts] = await Promise.all([
    getHomePageData(),
    getPostBySlug(slug),
    getLatestPosts(8),
  ]);

  if (!post) {
    notFound();
  }

  const authorName = homeData?.settings?.site_name || 'ESAT';
  const authorInitial = authorName.trim().charAt(0).toUpperCase();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const relatedArticles = latestPosts
    .filter((p) => p.category?.id === post.category?.id && p.id !== post.id)
    .slice(0, 8);

  const pageKey = post?.slug ?? slug;

  return (
    <HomeDataProvider initialData={homeData}>
      <div key={pageKey} className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-white to-white flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 max-w-5xl py-10 md:py-14">
            <Breadcrumb
              items={[
                { label: 'Trang chủ', href: '/' },
                { label: 'Bài viết', href: '/bai-viet' },
                { label: post.title },
              ]}
            />

            <article className="bg-white/90 backdrop-blur border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
              <div className="p-6 md:p-10 space-y-10">
                <header className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      {post.category && (
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
                          <Hash className="mr-1 h-3 w-3" /> {post.category.name}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight tracking-tight">
                      {post.title}
                    </h1>

                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-800 font-semibold flex items-center justify-center">
                        {authorInitial}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Tác giả</p>
                        <p className="text-base font-semibold text-slate-900">{authorName}</p>
                        <p className="text-sm text-slate-500">Cập nhật {formatDate(post.updated_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Link
                      href="/bai-viet"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Quay lại
                    </Link>
                    <PostShareActions title={post.title} />
                  </div>
                </header>

                {getImageUrl(post.thumbnail) && (
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                    <Image
                      src={getImageUrl(post.thumbnail)!}
                      alt={post.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary prose-a:font-semibold prose-img:rounded-xl prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-slate-400">
                  {post.content && (
                    <div dangerouslySetInnerHTML={{ __html: post.content }} suppressHydrationWarning />
                  )}
                </div>
              </div>
            </article>

            <PostDetailClient title={post.title} />

            {relatedArticles.length > 0 && (
              <section className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">Bài viết liên quan</h3>
                  <Link href="/bai-viet" className="text-sm font-semibold text-primary hover:underline">
                    Xem tất cả
                  </Link>
                </div>

                <div
                  className="hide-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as CSSProperties}
                >
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      className="snap-start flex-shrink-0 w-[80%] sm:w-[48%] lg:w-[32%]"
                    >
                      <Link href={`/bai-viet/${rel.slug}`} className="group block h-full">
                        <div className="bg-white rounded-2xl border border-slate-100 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
                          <div className="relative aspect-[4/3] rounded-t-2xl overflow-hidden">
                            {getImageUrl(rel.thumbnail) ? (
                              <Image
                                src={getImageUrl(rel.thumbnail)!}
                                alt={rel.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                <FileText className="h-6 w-6 text-slate-300" />
                              </div>
                            )}
                            {rel.category && (
                              <div className="absolute top-2 right-2">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-semibold uppercase tracking-wide rounded-full text-slate-900 shadow">
                                  {rel.category.name}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-4 space-y-2 flex-1 flex flex-col">
                            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                              <Calendar className="h-3 w-3" /> {formatDate(rel.created_at)}
                            </div>
                            <h4 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {rel.title}
                            </h4>
                            <div className="mt-auto pt-1 flex items-center text-xs font-bold text-primary">
                              Đọc tiếp <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </HomeDataProvider>
  );
}
