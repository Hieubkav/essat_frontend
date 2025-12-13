'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NEWS } from './constants';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const News: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const displayNews = [...NEWS, ...NEWS];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
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
    scrollRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  return (
    <section className="py-12 md:py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
           <div className="flex items-center gap-4">
             <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Tin tức & Sự kiện</h2>
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

           <a href="#" className="flex items-center text-sm font-semibold text-primary hover:text-green-700 transition-colors group whitespace-nowrap">
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
          {displayNews.map((item, index) => (
            <article
              key={`${item.id}-${index}`}
              className="flex-none w-[160px] sm:w-[300px] md:w-[350px] snap-center select-none"
            >
              <div className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                    draggable={false}
                  />
                </div>

                <div className="flex flex-col flex-1 p-3 sm:p-6">

                  <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-2 leading-snug line-clamp-3 group-hover:text-primary transition-colors duration-300">
                    <a href="#" onClick={(e) => isDragging && e.preventDefault()} className="focus:outline-none">
                      {item.title}
                    </a>
                  </h3>

                  <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-50 flex items-center justify-between">
                    <a href="#" onClick={(e) => isDragging && e.preventDefault()} className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-primary flex items-center gap-1.5 transition-colors">
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
