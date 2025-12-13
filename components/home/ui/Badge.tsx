'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    primary: "bg-primary/10 text-primary hover:bg-primary/20",
    secondary: "bg-secondary text-white",
    danger: "bg-red-500 text-white",
    outline: "border border-slate-200 text-slate-800",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
