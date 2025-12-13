'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFeaturedProductsData, FeaturedProductsConfig } from '@/lib/homeApi';

export const Products: React.FC = () => {
  const [config, setConfig] = useState<FeaturedProductsConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const products = config?.products || [];

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
    const fetchData = async () => {
      try {
        const data = await getFeaturedProductsData();
        if (data) {
          setConfig(data);
        }
      } catch (error) {
        console.error('Failed to fetch products data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }
  }, [isLoading, checkScroll]);

  useEffect(() => {
    if (isLoading || products.length === 0) return;

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
  }, [isDragging, isLoading, products.length, scroll]);

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
      <section className="py-12 md:py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-3 sm:gap-6 overflow-hidden">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex-none w-[160px] sm:w-[260px] md:w-[320px]">
                <div className="bg-white rounded-xl border border-slate-100 p-3 sm:p-4">
                  <div className="aspect-square bg-slate-200 rounded-lg animate-pulse mb-4" />
                  <div className="h-4 w-16 bg-slate-100 rounded animate-pulse mb-2" />
                  <div className="h-6 w-full bg-slate-200 rounded animate-pulse mb-4" />
                  <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!config || products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-20 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{config.title}</h2>
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
          {products.map((product, index) => (
            <div
              key={index}
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
                  <h3 className="font-semibold text-slate-800 text-sm sm:text-base mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-primary transition-colors">
                    <a href={product.link || '#'} onClick={(e) => isDragging && e.preventDefault()}>{product.name}</a>
                  </h3>

                  <div className="mt-auto pt-3 sm:pt-4 border-t border-slate-50 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div className="flex flex-col pb-0.5">
                      <span className={`text-base sm:text-lg font-bold leading-none ${product.price !== 'Liên hệ' ? 'text-red-600' : 'text-primary'}`}>
                        {product.price}
                      </span>
                    </div>

                    <a
                      href={product.link || '#'}
                      onClick={(e) => isDragging && e.preventDefault()}
                      className="group/btn relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-[10px] sm:text-sm font-semibold transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 focus:outline-none active:scale-95 w-full sm:w-auto"
                    >
                      <span>Xem ngay</span>
                      <ArrowRight size={14} className="sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </a>
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
