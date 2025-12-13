'use client';

import React, { useMemo } from 'react';

interface PostDetailClientProps {
  content: string | null;
}

export const PostDetailClient: React.FC<PostDetailClientProps> = ({ content }) => {
  // Tạo key duy nhất từ content để force React re-render khi content thay đổi
  // Điều này ngăn lỗi DOM mismatch khi navigate
  const contentKey = useMemo(() => {
    if (!content) return 'empty';
    return content.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '');
  }, [content]);

  if (!content) return null;

  return (
    <div
      key={contentKey}
      className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
};
