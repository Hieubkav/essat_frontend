'use client';

import { useEffect } from 'react';

export const InitialLoadingScreen = () => {
  useEffect(() => {
    const loadingScreen = document.getElementById('initial-loading-screen');
    if (loadingScreen) {
      // Small delay to ensure smooth transition after hydration
      requestAnimationFrame(() => {
        loadingScreen.classList.add('hidden');
      });
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        loadingScreen.remove();
      }, 350);
    }
  }, []);

  return null;
};
