'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { getProductCategoriesData, ProductCategoriesConfig, CategoryItem } from '@/lib/homeApi';

export const CategoryList: React.FC = () => {
  const [config, setConfig] = useState<ProductCategoriesConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [isDragging, setIsDragging] = useState(false);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMoved = useRef(false);

  const categories = config?.categories || [];
  const isCarousel = categories.length > 6;

  const checkScroll = useCallback(() => {
    if (scrollRef.current && isCarousel) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  }, [isCarousel]);

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
        const data = await getProductCategoriesData();
        if (data) {
          setConfig(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isCarousel && !isLoading) {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }
  }, [isCarousel, isLoading, checkScroll]);

  useEffect(() => {
    if (!isCarousel || isLoading) return;

    const interval = setInterval(() => {
      if (scrollRef.current && !isDown.current && !isDragging) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isCarousel, isDragging, isLoading, scroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current || !isCarousel) return;

    isDown.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    isDown.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current || !isCarousel) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;

    if (Math.abs(walk) > 5) {
      hasMoved.current = true;
      setIsDragging(true);
      scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
      checkScroll();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const renderCategoryItem = (cat: CategoryItem, index: number, isSlideItem: boolean = false) => (
    <a
      key={index}
      href={cat.link || '#'}
      onDragStart={(e) => e.preventDefault()}
      onClick={handleLinkClick}
      className={`
        group flex flex-col items-center select-none outline-none
        ${isSlideItem ? 'w-[80px] sm:w-[160px] flex-none snap-center' : 'w-full'}
      `}
    >
      <div className="relative w-[72px] h-[72px] sm:w-36 sm:h-36 mb-2 sm:mb-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm group-hover:border-primary group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 bg-white">
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
        <img
          src={cat.image}
          alt={cat.name}
          className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <span className="text-[10px] sm:text-sm font-semibold text-slate-700 text-center leading-tight group-hover:text-primary transition-colors px-1 line-clamp-2">
        {cat.name}
      </span>
    </a>
  );

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-24 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-3 sm:gap-6 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="flex-none w-[80px] sm:w-[160px]">
                <div className="w-[72px] h-[72px] sm:w-36 sm:h-36 bg-slate-200 rounded-xl animate-pulse mb-2" />
                <div className="h-4 w-16 mx-auto bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!config || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {config.title}
            </h2>

            {isCarousel && (
              <div className="hidden md:flex gap-2">
                <button
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className="p-2 rounded-lg border border-slate-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className="p-2 rounded-lg border border-slate-200 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          <a href="#" className="flex items-center text-sm font-semibold text-primary hover:text-green-700 transition-colors group whitespace-nowrap">
            Xem tất cả <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {isCarousel ? (
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`
              flex gap-3 sm:gap-6 overflow-x-auto pb-6 -mx-4 px-4 hide-scrollbar touch-pan-y
              ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory scroll-smooth'}
            `}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {categories.map((cat, index) => renderCategoryItem(cat, index, true))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
            {categories.map((cat, index) => renderCategoryItem(cat, index, false))}
          </div>
        )}
      </div>
    </section>
  );
};
