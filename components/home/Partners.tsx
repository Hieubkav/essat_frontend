'use client';

import React from 'react';
import { PARTNERS } from './constants';

export const Partners: React.FC = () => {
  const duplicatedPartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section className="py-10 md:py-12 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4">

        <div className="mb-6 md:mb-8">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                 Đối tác chiến lược
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
                  key={`${partner.id}-${index}`}
                  className="mx-8 md:mx-12 flex items-center justify-center min-w-[140px] md:min-w-[180px]"
               >
                 <div className="relative group/logo cursor-pointer transition-all duration-300">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-12 md:h-16 w-auto object-contain opacity-50 grayscale transition-all duration-300 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 group-hover/logo:scale-110"
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
