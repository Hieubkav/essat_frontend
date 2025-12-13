import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { getPostBySlug, getLatestPosts } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { getImageUrl } from '@/lib/utils';
import { PostDetailClient } from './PostDetailClient';

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
    getLatestPosts(4),
  ]);

  if (!post) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const relatedPosts = latestPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const pageKey = post?.slug ?? slug;

  return (
    <HomeDataProvider initialData={homeData}>
      <div key={pageKey} className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Breadcrumb */}
          <section className="bg-primary py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
                <ChevronRight size={14} />
                <Link href="/bai-viet" className="hover:text-white transition-colors">
                  Bài viết
                </Link>
                <ChevronRight size={14} />
                <span className="text-white line-clamp-1">{post.title}</span>
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Featured Image */}
                    {getImageUrl(post.thumbnail) && (
                      <div className="aspect-video relative">
                        <Image
                          src={getImageUrl(post.thumbnail)!}
                          alt={post.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                    )}

                    <div className="p-6 md:p-8">
                      {/* Category & Date */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {post.category && (
                          <Link
                            href={`/bai-viet?category=${post.category.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full hover:bg-primary/20 transition-colors"
                          >
                            <Tag size={14} />
                            {post.category.name}
                          </Link>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar size={14} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                        {post.title}
                      </h1>

                      {/* Content - Client Component */}
                      <PostDetailClient content={post.content} />
                    </div>
                  </article>

                  {/* Back Button */}
                  <div className="mt-6">
                    <Link
                      href="/bai-viet"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <ArrowLeft size={18} />
                      Quay lại danh sách bài viết
                    </Link>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                      Bài viết mới nhất
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <Link
                          key={relatedPost.id}
                          href={`/bai-viet/${relatedPost.slug}`}
                          className="group flex gap-3"
                        >
                          <div className="w-20 h-16 relative rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                            {getImageUrl(relatedPost.thumbnail) ? (
                              <Image
                                src={getImageUrl(relatedPost.thumbnail)!}
                                alt={relatedPost.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-200" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-slate-700 line-clamp-2 group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatDate(relatedPost.created_at)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </HomeDataProvider>
  );
}
