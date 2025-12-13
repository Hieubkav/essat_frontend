'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Box, FileText, ArrowRight, ChevronRight } from 'lucide-react';
import { PRODUCTS, NEWS } from './constants';
import { Product, NewsItem } from './types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([]);
      setFilteredNews([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const fProducts = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );

    const fNews = NEWS.filter(n =>
      n.title.toLowerCase().includes(lowerQuery) ||
      n.excerpt.toLowerCase().includes(lowerQuery)
    );

    setFilteredProducts(fProducts);
    setFilteredNews(fNews);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center border-b border-slate-100 px-4 py-4">
          <Search className="mr-3 h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-slate-400 text-slate-900"
            placeholder="Tìm kiếm sản phẩm, tin tức..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="ml-2 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            <X className="h-5 w-5 text-slate-500" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {!query && (
            <div className="py-10 text-center text-sm text-slate-500">
              <p>Nhập từ khóa để tìm kiếm sản phẩm hoặc bài viết.</p>
            </div>
          )}

          {query && filteredProducts.length === 0 && filteredNews.length === 0 && (
            <div className="py-10 text-center text-slate-500">
              <p>Không tìm thấy kết quả nào cho &quot;{query}&quot;.</p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="mb-6">
              <h3 className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                <Box className="mr-2 h-3 w-3" /> Sản phẩm
              </h3>
              <div className="space-y-2">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="group flex items-center gap-4 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-slate-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {product.price.toLocaleString('vi-VN')}d
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredNews.length > 0 && (
            <div>
              <div className="border-t border-slate-100 my-4"></div>
              <h3 className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                <FileText className="mr-2 h-3 w-3" /> Tin tức
              </h3>
              <div className="space-y-2">
                {filteredNews.map(news => (
                  <div
                    key={news.id}
                    className="group flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="mt-1">
                      <FileText className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-900 group-hover:text-primary transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{news.excerpt}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap bg-slate-100 px-2 py-0.5 rounded">
                      {news.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query && (filteredProducts.length > 0 || filteredNews.length > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <button className="text-sm text-primary font-medium hover:underline inline-flex items-center">
                Xem tất cả kết quả <ArrowRight className="ml-1 h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
