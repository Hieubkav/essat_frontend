'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface ProductGalleryProps {
  thumbnail: string | null;
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  thumbnail,
  images,
  productName,
}) => {
  const allImages = [thumbnail, ...images].filter(Boolean) as string[];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = allImages[selectedIndex] || null;

  if (allImages.length === 0) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:sticky lg:top-24">
        <div className="relative aspect-square flex-1 bg-[#F8FAFC] rounded-xl overflow-hidden flex items-center justify-center p-8">
          <Package size={80} className="text-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:sticky lg:top-24">
      {/* Ảnh chính */}
      <div className="relative aspect-square flex-1 bg-[#F8FAFC] rounded-xl overflow-hidden flex items-center justify-center p-8 group transition-colors duration-500 order-1 lg:order-2">
        <Image
          src={selectedImage!}
          alt={productName}
          fill
          className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out p-6"
          priority
        />
      </div>

      {/* Ảnh phụ */}
      {allImages.length > 1 && (
        <div className="flex lg:flex-col gap-1.5 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto lg:max-h-[400px] hide-scrollbar">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`h-20 w-20 flex-shrink-0 rounded-lg bg-[#F8FAFC] p-2 transition-all duration-300 ${
                idx === selectedIndex
                  ? 'ring-2 ring-slate-900 ring-offset-1'
                  : 'hover:bg-slate-100'
              }`}
            >
              <Image
                src={img}
                alt=""
                width={80}
                height={80}
                className={`w-full h-full object-contain mix-blend-multiply transition-opacity ${
                  idx === selectedIndex ? 'opacity-100' : 'opacity-80 hover:opacity-100'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
