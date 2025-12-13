'use client';

import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="bg-primary px-6 py-2 rounded-full border-4 border-white ring-4 ring-secondary shadow-lg">
        <span className="text-white font-serif font-bold text-2xl tracking-widest drop-shadow-md">
          ESAT
        </span>
      </div>
    </div>
  );
};
