'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ProductDetailClientProps {
  content: string | null;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If content is provided, render content section (legacy support)
  if (content) {
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
  }

  // Otherwise, render share button
  return (
    <button
      onClick={handleCopyLink}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border
        ${copied
          ? 'bg-green-50 text-green-600 border-green-200'
          : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900 hover:border-slate-300'
        }`}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? 'Đã sao chép' : 'Chia sẻ'}
    </button>
  );
};
