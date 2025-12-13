'use client';

import React, { useState, useEffect } from 'react';
import { getStatsData, StatItem } from '@/lib/homeApi';

export const Stats: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatsData();
        if (data?.items && data.items.length > 0) {
          setStats(data.items);
        }
      } catch (error) {
        console.error('Failed to fetch stats data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="py-6 md:py-10 bg-white border-y border-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-2 md:gap-8 md:divide-x divide-slate-100">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center px-1 md:px-4">
                <div className="h-8 md:h-12 w-24 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (stats.length === 0) {
    return null;
  }

  return (
    <section className="py-6 md:py-10 bg-white border-y border-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-2 md:gap-8 md:divide-x divide-slate-100">
          {stats.map((stat, idx) => (
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
