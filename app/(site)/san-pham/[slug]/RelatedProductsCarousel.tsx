'use client';

import React, { useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Package, Tag } from 'lucide-react';
import { ProductSimple } from '@/lib/contentApi';

interface RelatedProductsCarouselProps {
  relatedProducts: ProductSimple[];
}

export const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({
  relatedProducts,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num) || num === 0) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  const scrollBy = useCallback((direction: 'left' | 'right') => {
    const el = listRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = listRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.clientX;
    startScroll.current = el.scrollLeft;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const el = listRef.current;
    if (!el) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 5) {
      hasDragged.current = true;
    }
    el.scrollLeft = startScroll.current - delta;
  };

  const onPointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="border-t border-slate-200 pt-6 pb-2">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight m-0">Sản phẩm liên quan</h3>
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              aria-label="Xem trước"
              onClick={() => scrollBy('left')}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Xem tiếp"
              onClick={() => scrollBy('right')}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="sm:hidden flex items-center gap-2">
            <button
              type="button"
              aria-label="Xem trước"
              onClick={() => scrollBy('left')}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label="Xem tiếp"
              onClick={() => scrollBy('right')}
              className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Link href="/san-pham" className="text-sm font-bold text-primary hover:underline">
            Xem tất cả
          </Link>
        </div>
      </div>

      <div
        ref={listRef}
        className="flex flex-nowrap gap-2 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 sm:-mx-4 px-2 sm:px-4 scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', touchAction: 'pan-x' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {relatedProducts.map(rel => (
            <div
              key={rel.id}
              className="snap-start flex-shrink-0 min-w-[calc(50%-4px)] sm:min-w-[52%] md:min-w-[40%] lg:min-w-[30%] xl:min-w-[24%] max-w-[320px]"
            >
              <div className="group bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full relative">
                {/* Image Area */}
                <Link
                    href={`/san-pham/${rel.slug}`}
                    onClick={handleClick}
                    className="relative aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3 group-hover:bg-slate-100 transition-colors block"
                  >
                  {rel.thumbnail ? (
                    <Image
                      src={rel.thumbnail}
                      alt={rel.name}
                      fill
                      className="object-contain mix-blend-multiply p-4 transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={36} className="text-slate-300" />
                    </div>
                  )}

                  {/* Hover Action */}
                  <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span className="block w-full py-2 bg-white/90 backdrop-blur text-slate-900 rounded-lg text-xs font-bold shadow-lg text-center group-hover:bg-primary group-hover:text-white transition-colors">
                      Xem chi tiết
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col flex-1">
                  {rel.category && (
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                      <Tag size={10} />
                      <span className="truncate">{rel.category}</span>
                    </div>
                  )}
                  <Link href={`/san-pham/${rel.slug}`} onClick={handleClick}>
                    <h3 className="text-slate-900 font-semibold text-sm leading-snug mb-2 hover:text-primary transition-colors min-h-[36px] line-clamp-2">
                      {rel.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
                    <div className="font-bold text-sm text-primary">
                      {formatPrice(rel.price) || <span className="text-slate-500 text-xs font-semibold">Liên hệ</span>}
                    </div>
                    <Link
                      href={`/san-pham/${rel.slug}`}
                      onClick={handleClick}
                      className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
