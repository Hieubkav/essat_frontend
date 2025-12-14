'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface DescriptionWithExpandProps {
  content: string;
  maxLines?: number;
}

export function DescriptionWithExpand({ content, maxLines = 3 }: DescriptionWithExpandProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Tinh toan so dong gan dung dua tren noi dung
  const lines = content.split('\n').length;
  const shouldShowButton = lines > maxLines || content.length > 500;

  const proseClasses =
    'prose prose-sm prose-slate max-w-none break-words prose-p:text-slate-600 prose-p:leading-7 prose-headings:font-bold prose-headings:text-slate-900 ' +
    '[&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-hidden [&_pre]:whitespace-pre-wrap [&_pre]:break-all [&_code]:whitespace-pre-wrap';

  if (!shouldShowButton) {
    return (
      <div
        className={`${proseClasses} overflow-hidden`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="overflow-hidden">
      <div
        className={`${proseClasses} transition-all duration-300 ${
          !isExpanded ? 'line-clamp-6 overflow-hidden' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-4 flex items-center gap-2 px-4 py-2 text-slate-900 font-semibold hover:text-slate-700 transition-colors group"
      >
        <span>{isExpanded ? 'An bot' : 'Xem them'}</span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
}
