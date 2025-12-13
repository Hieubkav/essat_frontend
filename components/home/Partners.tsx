'use client';

import React from 'react';
import Image from 'next/image';
import { useHomeData } from './HomeDataProvider';

export const Partners: React.FC = () => {
  const { partners: config, isLoading } = useHomeData();

  if (isLoading) {
    return (
      <section className="py-10 md:py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="relative w-full overflow-hidden border border-slate-100 rounded-2xl bg-slate-50/50">
            <div className="flex py-8 items-center justify-center gap-12">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="w-[140px] md:w-[180px] h-12 md:h-16 bg-slate-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!config || config.partners.length === 0) {
    return null;
  }

  const partners = config.partners;
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-10 md:py-12 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">

        <div className="mb-6 md:mb-8">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                 {config.title}
               </h2>
             </div>
           </div>
        </div>

        <div className="relative w-full overflow-hidden border border-slate-100 rounded-2xl bg-slate-50/50">

          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 z-10 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 z-10 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>

          <div className="flex w-max animate-infinite-scroll group hover:[animation-play-state:paused] py-8 items-center">
             {duplicatedPartners.map((partner, index) => (
               <div
                  key={`${partner.name}-${index}`}
                  className="mx-8 md:mx-12 flex items-center justify-center min-w-[140px] md:min-w-[180px]"
               >
                 <div className="relative group/logo cursor-pointer transition-all duration-300 h-12 md:h-16 w-[140px] md:w-[180px]">
                    <Image
                      src={partner.logo || '/placeholder.png'}
                      alt={partner.name}
                      fill
                      sizes="180px"
                      className="object-contain"
                      draggable={false}
                    />
                 </div>
               </div>
             ))}
          </div>
        </div>

      </div>
    </section>
  );
};
