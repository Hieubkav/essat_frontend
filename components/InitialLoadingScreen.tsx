'use client';

import { useEffect, useState } from 'react';

export const InitialLoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsFadingOut(true));
    const timeout = setTimeout(() => setIsVisible(false), 350);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="initial-loading-screen"
      className={isFadingOut ? 'fade-out' : ''}
    >
      <div className="initial-spinner" />
    </div>
  );
};
