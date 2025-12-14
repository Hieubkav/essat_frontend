'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Check,
  Facebook,
  Heart,
  Link2,
  Linkedin,
   MessageCircle,
  Send,
  Twitter,
} from 'lucide-react';

interface PostShareActionsProps {
  title?: string;
  className?: string;
  size?: 'sm' | 'md';
}

type Comment = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  avatarColor: string;
};

const defaultComments: Comment[] = [
  {
    id: '1',
    author: 'Minh Anh',
    content: 'Bài viết rất chi tiết và dễ đọc, cảm ơn đội ngũ ESAT đã chia sẻ.',
    timestamp: '2 giờ trước',
    likes: 12,
    avatarColor: '#E2F3E9',
  },
  {
    id: '2',
    author: 'Hoàng Phúc',
    content: 'Gợi ý thực tế, mình sẽ thử áp dụng cho chiến dịch email tuần tới.',
    timestamp: '5 giờ trước',
    likes: 8,
    avatarColor: '#E6F0FF',
  },
  {
    id: '3',
    author: 'Lan Chi',
    content: 'Rất mong có thêm ví dụ minh họa về case B2B, nội dung hiện tại đã khá đầy đủ.',
    timestamp: 'Hôm qua',
    likes: 15,
    avatarColor: '#FFF4E5',
  },
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

export const PostShareActions: React.FC<PostShareActionsProps> = ({ title, className, size = 'md' }) => {
  const [copied, setCopied] = useState(false);

  const buttonSize = size === 'sm' ? 'icon-sm' : 'icon';
  const iconClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';

  const getUrl = () => (typeof window !== 'undefined' ? window.location.href : '');

  const openShareWindow = (url: string) => {
    if (typeof window === 'undefined') return;
    const width = 720;
    const height = 520;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    window.open(url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
  };

  const handleShare = (network: 'facebook' | 'twitter' | 'linkedin') => {
    const url = encodeURIComponent(getUrl());
    const text = encodeURIComponent(title ?? '');

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    } as const;

    openShareWindow(shareLinks[network]);
  };

  const handleCopy = async () => {
    if (typeof navigator === 'undefined') return;
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Chia sẻ</span>
      <Button
        type="button"
        variant="outline"
        size={buttonSize}
        className="rounded-full"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className={iconClass} />
      </Button>
      <Button
        type="button"
        variant="outline"
        size={buttonSize}
        className="rounded-full"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className={iconClass} />
      </Button>
      <Button
        type="button"
        variant="outline"
        size={buttonSize}
        className="rounded-full"
        onClick={() => handleShare('linkedin')}
      >
        <Linkedin className={iconClass} />
      </Button>
      <Button
        type="button"
        variant="outline"
        size={buttonSize}
        className={cn('rounded-full', copied && 'bg-emerald-50 text-emerald-600 border-emerald-200')}
        onClick={handleCopy}
      >
        {copied ? <Check className={iconClass} /> : <Link2 className={iconClass} />}
      </Button>
    </div>
  );
};

interface PostDetailClientProps {
  title: string;
}

export const PostDetailClient: React.FC<PostDetailClientProps> = ({ title }) => {
  const [comments, setComments] = useState<Comment[]>(defaultComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const created: Comment = {
      id: Date.now().toString(),
      author: 'Bạn đọc',
      content: newComment.trim(),
      timestamp: 'Vừa xong',
      likes: 0,
      avatarColor: '#E0F2FE',
    };

    setComments((prev) => [created, ...prev]);
    setNewComment('');
  };

  const handleLike = (id: string) => {
    setComments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item
      )
    );
  };

  return (
    <section className="mt-10">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 md:p-8 space-y-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">Thảo luận</p>
            <h3 className="text-lg md:text-xl font-bold text-slate-900">
              Chia sẻ cảm nhận về "{title}"
            </h3>
          </div>
          <div className="hidden md:block">
            <PostShareActions title={title} size="sm" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:border-primary/60 focus-within:bg-white transition-all">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="w-full resize-none bg-transparent p-4 text-sm text-slate-800 outline-none min-h-[110px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Bình luận sẽ được hiển thị công khai.</span>
            <Button type="submit" size="sm" className="px-4 gap-2">
              <Send className="h-4 w-4" />
              Đăng bình luận
            </Button>
          </div>
        </form>

        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-slate-100 rounded-2xl p-4 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center font-semibold text-slate-800"
                  style={{ backgroundColor: comment.avatarColor }}
                >
                  {getInitials(comment.author)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900">{comment.author}</p>
                      <p className="text-xs text-slate-500">{comment.timestamp}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-primary"
                      onClick={() => handleLike(comment.id)}
                    >
                      <Heart className="h-4 w-4" />
                      <span className="text-xs font-semibold">{comment.likes}</span>
                    </Button>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
