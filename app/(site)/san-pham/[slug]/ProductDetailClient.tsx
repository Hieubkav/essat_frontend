'use client';

import React from 'react';

interface ProductDetailClientProps {
  content: string | null;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="border-t border-slate-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        Thông tin chi tiết
      </h2>
      <div
        className="prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-primary prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};
