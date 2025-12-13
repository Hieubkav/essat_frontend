'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1932&auto=format&fit=crop',
    alt: 'Giai phap hoi nghi truyen hinh toan dien'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1551703599-6b3e8379aa8c?q=80&w=2074&auto=format&fit=crop',
    alt: 'Ha tang may chu manh me'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2000&auto=format&fit=crop',
    alt: 'Ket noi khong gioi han'
  }
];

export const Hero: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const length = BANNERS.length;

  const nextSlide = useCallback(() => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  }, [current, length]);

  const prevSlide = useCallback(() => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  }, [current, length]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsHovered(true);
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-900 group select-none touch-pan-y cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-[250px] sm:h-[400px] lg:h-[600px] w-full">
        {BANNERS.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl scale-110 opacity-50 brightness-50"
              style={{ backgroundImage: `url(${banner.image})` }}
            />

            <div className="relative w-full h-full flex items-center justify-center p-0 md:p-4">
              <img
                src={banner.image}
                alt={banner.alt}
                className="max-w-full max-h-full w-auto h-auto object-contain shadow-2xl rounded-sm pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        ))}

        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-white/10"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-white/10"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {BANNERS.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                idx === current ? 'w-8 bg-primary' : 'w-2 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
