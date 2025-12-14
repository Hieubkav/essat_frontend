'use client';

import type { CSSProperties } from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Calendar,
  FileText,
  Hash,
  Share2,
  Check,
  ChevronDown
} from 'lucide-react';
import { getPostBySlug } from '@/lib/contentApi';
import { HomeDataProvider } from '@/components/home/HomeDataProvider';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { getHomePageData } from '@/lib/homeApi';
import { getImageUrl } from '@/lib/utils';
import { Breadcrumb } from '@/components/home/Breadcrumb';
import { Badge } from '@/components/home/ui/Badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
  };
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Component chia sẻ - copy link
const ShareButton = ({ className }: { className?: string }) => {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCopy = async () => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn(
        'gap-2 rounded-full transition-all',
        copied ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'hover:bg-primary/5 hover:border-primary/30',
        className
      )}
      onClick={handleCopy}
      title={copied ? 'Đã sao chép liên kết' : 'Chia sẻ bài viết'}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span className="text-xs font-semibold">Đã sao chép</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span className="text-xs font-semibold">Chia sẻ</span>
        </>
      )}
    </Button>
  );
};

// Component nội dung bài viết với "Xem thêm"
const PostContent = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useState<HTMLDivElement | null>(null)[0];

  useEffect(() => {
    // Kiểm tra nếu content dài hơn ~800px thì hiện nút "Xem thêm"
    if (contentRef) {
      const contentHeight = contentRef.scrollHeight;
      setShouldShowButton(contentHeight > 800);
    }
  }, [contentRef, content]);

  return (
    <>
      <div className="relative">
        <div
          ref={(el) => {
            if (el && !contentRef) {
              const contentHeight = el.scrollHeight;
              setShouldShowButton(contentHeight > 800);
            }
          }}
          className={cn(
            'prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-slate-400 prose-strong:text-slate-900 prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[\'\'] prose-code:after:content-[\'\']',
            !isExpanded && shouldShowButton && 'max-h-[800px] overflow-hidden'
          )}
          style={{
            transition: 'max-height 0.5s ease-in-out',
          }}
        >
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} suppressHydrationWarning />
          ) : (
            <p className="text-slate-500 italic">Nội dung đang được cập nhật...</p>
          )}
        </div>

        {/* Gradient overlay khi chưa expand */}
        {!isExpanded && shouldShowButton && (
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Nút "Xem thêm" / "Thu gọn" - đặt bên ngoài để không bị gradient đè */}
      {shouldShowButton && (
        <div className="flex justify-center mt-8 relative z-10">
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={() => setIsExpanded(!isExpanded)}
            className="gap-2 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            {isExpanded ? (
              <>
                Thu gọn
                <ChevronDown className="h-5 w-5 rotate-180 transition-transform" />
              </>
            ) : (
              <>
                Xem thêm
                <ChevronDown className="h-5 w-5 transition-transform" />
              </>
            )}
          </Button>
        </div>
      )}
    </>
  );
};

// Component bài viết liên quan
const RelatedPosts = ({ posts, currentPostId }: { posts: Post[]; currentPostId: number }) => {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">Bài viết liên quan</h3>
          <p className="text-sm text-slate-600">Khám phá thêm nội dung tương tự</p>
        </div>
        <Link
          href="/bai-viet"
          className="text-sm font-semibold text-primary hover:underline underline-offset-4 transition-all"
        >
          Xem tất cả →
        </Link>
      </div>

      <div
        className="hide-scrollbar flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as CSSProperties}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/bai-viet/${post.slug}`}
            className="group snap-start flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[32%]"
          >
            <article className="bg-white rounded-2xl border border-slate-200 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                {getImageUrl(post.thumbnail) ? (
                  <Image
                    src={getImageUrl(post.thumbnail)!}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-10 w-10 text-slate-300" />
                  </div>
                )}
                {post.category && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/95 backdrop-blur text-slate-900 shadow-sm">
                      <Hash className="h-3 w-3 mr-1" />
                      {post.category.name}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(post.created_at)}
                </div>
                <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <div className="mt-auto pt-2 text-xs font-semibold text-primary">
                  Đọc tiếp →
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default function PostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [homeData, setHomeData] = useState<any>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeResult, postResult] = await Promise.all([
          getHomePageData(),
          getPostBySlug(slug),
        ]);

        setHomeData(homeResult);
        setPost(postResult?.post || null);
        setRelatedPosts(postResult?.related_posts || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-sm text-slate-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-slate-300 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy bài viết</h1>
          <Link href="/bai-viet" className="inline-block text-sm font-semibold text-primary hover:underline">
            ← Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    );
  }

  return (
    <HomeDataProvider initialData={homeData}>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/30 flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 max-w-7xl py-2 md:py-12">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb
                items={[
                  { label: 'Trang chủ', href: '/' },
                  { label: 'Bài viết', href: '/bai-viet' },
                  { label: post.title },
                ]}
              />
            </div>

            {/* Nội dung chính */}
            <article className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
              {/* Header */}
              <header className="p-6 md:p-10 space-y-6 border-b border-slate-100 bg-gradient-to-br from-white to-slate-50/50">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 space-y-5">
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-3">
                      {post.category && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-semibold">
                          <Hash className="mr-1 h-3.5 w-3.5" />
                          {post.category.name}
                        </Badge>
                      )}
                      <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.created_at)}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                      {post.title}
                    </h1>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <Link
                      href="/bai-viet"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors px-4 py-2 rounded-full hover:bg-slate-100"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Quay lại
                    </Link>
                    <ShareButton />
                  </div>
                </div>
              </header>

              {/* Thumbnail */}
              {getImageUrl(post.thumbnail) && (
                <div className="relative w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200/50">
                  <div className="relative w-full flex items-center justify-center py-4 md:py-6">
                    <Image
                      src={getImageUrl(post.thumbnail)!}
                      alt={post.title}
                      width={1200}
                      height={800}
                      className="w-auto h-auto max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6 md:p-10 lg:p-12">
                <PostContent content={post.content} />
              </div>
            </article>

            {/* Bài viết liên quan */}
            <RelatedPosts posts={relatedPosts} currentPostId={post.id} />
          </div>
        </main>

        <Footer />
      </div>
    </HomeDataProvider>
  );
}
