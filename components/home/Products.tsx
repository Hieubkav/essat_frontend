'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PRODUCTS } from './constants';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const Products: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const displayProducts = [...PRODUCTS, ...PRODUCTS];

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isDragging]);

  return (
    <section className="py-12 md:py-20 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
             <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Sản phẩm nổi bật</h2>
             <div className="hidden md:flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="p-2 rounded-full border border-slate-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="p-2 rounded-full border border-slate-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors"
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
          {displayProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="flex-none w-[160px] sm:w-[260px] md:w-[320px] snap-center select-none"
            >
              <div className="group h-full bg-white rounded-xl border border-slate-100 p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex flex-col">

                <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-lg mb-3 sm:mb-4 p-2 sm:p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    draggable={false}
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase mb-1 tracking-wider">
                    {product.category}
                  </span>

                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-primary transition-colors">
                    <a href="#" onClick={(e) => isDragging && e.preventDefault()}>{product.name}</a>
                  </h3>

                  <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-50 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div className="flex flex-col pb-0.5">
                      <span className={`text-base sm:text-lg font-bold leading-none ${product.price > 0 ? 'text-red-600' : 'text-primary'}`}>
                        {product.price > 0
                          ? `${product.price.toLocaleString('vi-VN')}đ`
                          : 'Liên hệ'}
                      </span>
                    </div>

                    <button className="group/btn relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-[10px] sm:text-sm font-semibold transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 focus:outline-none active:scale-95 w-full sm:w-auto">
                        <span>Xem ngay</span>
                        <ArrowRight size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
