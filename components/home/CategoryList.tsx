'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CATEGORIES } from './constants';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const CategoryList: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [isDragging, setIsDragging] = useState(false);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  const isCarousel = CATEGORIES.length > 6;

  const checkScroll = () => {
    if (scrollRef.current && isCarousel) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  };

  useEffect(() => {
    if (isCarousel) {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }
  }, [isCarousel]);

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

  useEffect(() => {
    if (!isCarousel) return;

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
  }, [isCarousel, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current || !isCarousel) return;

    isDown.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
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
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
        checkScroll();
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const renderCategoryItem = (cat: typeof CATEGORIES[0], isSlide: boolean = false) => (
    <a
      key={cat.id}
      href="#"
      onDragStart={(e) => e.preventDefault()}
      onClick={handleLinkClick}
      className={`
        group flex flex-col items-center select-none outline-none
        ${isSlide ? 'w-[80px] sm:w-[160px] flex-none snap-center' : 'w-full'}
      `}
    >
      <div className="relative w-[72px] h-[72px] sm:w-36 sm:h-36 mb-2 sm:mb-4 rounded-xl overflow-hidden border border-slate-200 shadow-sm group-hover:border-primary group-hover:shadow-md transition-all duration-300 group-hover:-translate-y-1 bg-white">
        <div className="absolute inset-0 bg-slate-100 animate-pulse" />
        <img
          src={cat.image}
          alt={cat.label}
          className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <span className="text-[10px] sm:text-sm font-semibold text-slate-700 text-center leading-tight group-hover:text-primary transition-colors px-1 line-clamp-2">
        {cat.label}
      </span>
    </a>
  );

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
           <div className="flex items-center gap-4">
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                 Danh mục sản phẩm
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
            {CATEGORIES.map((cat) => renderCategoryItem(cat, true))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
             {CATEGORIES.map((cat) => renderCategoryItem(cat, false))}
          </div>
        )}

      </div>
    </section>
  );
};
