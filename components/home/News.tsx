'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHomeData } from './HomeDataProvider';

export const News: React.FC = () => {
  const { news: config, isLoading } = useHomeData();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const news = config?.posts || [];

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }
  }, [isLoading, checkScroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-3 sm:gap-6 overflow-hidden">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex-none w-[160px] sm:w-[300px] md:w-[350px]">
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="aspect-[16/10] bg-slate-200 animate-pulse" />
                  <div className="p-3 sm:p-6">
                    <div className="h-6 w-full bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!config || news.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{config.title}</h2>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="p-2 rounded-full border border-slate-200 bg-white hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="p-2 rounded-full border border-slate-200 bg-white hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <a href={config.view_all_link || '#'} className="flex items-center text-sm font-semibold text-primary hover:text-green-700 transition-colors group whitespace-nowrap">
            Xem tất cả <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-3 sm:gap-6 overflow-x-auto pb-8 -mx-4 px-4 hide-scrollbar ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory scroll-smooth'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {news.map((item, index) => (
            <article
              key={index}
              className="flex-none w-[160px] sm:w-[300px] md:w-[350px] snap-center select-none"
            >
              <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 300px, 350px"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    draggable={false}
                  />
                </div>

                <div className="flex flex-col flex-1 p-3 sm:p-6">

                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2 leading-snug line-clamp-3 group-hover:text-primary transition-colors duration-300">
                    <a href={item.link || '#'} onClick={(e) => isDragging && e.preventDefault()} className="focus:outline-none">
                      {item.title}
                    </a>
                  </h3>

                  <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-50 flex items-center justify-between">
                    <a href={item.link || '#'} onClick={(e) => isDragging && e.preventDefault()} className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-primary flex items-center gap-1.5 transition-colors">
                      Đọc tiếp
                      <ArrowUpRight size={14} className="sm:w-4 sm:h-4 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <ArrowRight size={14} className="sm:w-4 sm:h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300"/>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
