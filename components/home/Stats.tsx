'use client';

import React from 'react';
import { STATS } from './constants';

export const Stats: React.FC = () => {
  return (
    <section className="py-6 md:py-10 bg-white border-y border-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-2 md:gap-8 md:divide-x divide-slate-100">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center px-1 md:px-4"
            >
              <span className="text-2xl sm:text-3xl md:text-5xl font-bold text-primary mb-1 md:mb-3 tracking-tight">
                {stat.value}
              </span>

              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
