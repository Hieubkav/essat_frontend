'use client';

import React from 'react';
import { FEATURES } from './constants';
import { Quote, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
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
                  Ve chung toi
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                Doi tac cong nghe <br />
                <span className="text-primary">Chien luoc & Toan dien</span>
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                ESAT khong chi phan phoi thiet bi ma con cung cap he sinh thai giai phap cong nghe, giup doanh nghiep toi uu van hanh va but pha.
              </p>
            </div>

            <div className="flex gap-4 p-4 bg-slate-50 border-l-4 border-secondary rounded-r-lg">
              <Quote className="text-secondary/60 flex-shrink-0" size={20} />
              <blockquote className="text-sm font-medium text-slate-700 italic">
                &quot;Chat luong la nen tang, nhung su hai long cua khach hang moi la dich den cuoi cung.&quot;
              </blockquote>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {FEATURES.map((feature, idx) => (
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
