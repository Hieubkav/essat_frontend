'use client';

import React, { useState, useEffect } from 'react';
import { Quote, CheckCircle2 } from 'lucide-react';
import { getAboutData, AboutConfig, AboutFeature } from '@/lib/homeApi';

export const About: React.FC = () => {
  const [about, setAbout] = useState<AboutConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAboutData();
        if (data) {
          setAbout(data);
        }
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <section className="relative py-10 md:py-16 overflow-hidden bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-12 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div className="h-24 w-full bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!about) {
    return null;
  }

  return (
    <section className="relative py-10 md:py-16 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-50/50 via-white to-orange-50/30 opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary font-bold text-xs uppercase tracking-wider">
                  {about.badge}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {about.title}
                {about.subtitle && (
                  <>
                    <br />
                    <span className="text-primary">{about.subtitle}</span>
                  </>
                )}
              </h2>

              <div 
                className="text-slate-600 text-base leading-relaxed prose prose-slate prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: about.description }}
              />
            </div>

            {about.quote && (
              <div className="flex gap-4 p-4 bg-slate-50 border-l-4 border-secondary rounded-r-lg">
                <Quote className="text-secondary/60 flex-shrink-0" size={20} />
                <blockquote className="text-sm font-medium text-slate-700 italic">
                  &quot;{about.quote}&quot;
                </blockquote>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {about.features.map((feature: AboutFeature, idx: number) => (
              <div key={idx} className="group bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <CheckCircle2 size={18} />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-slate-500 text-sm leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
