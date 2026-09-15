'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('StudySpot Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('StudySpot Service Worker registration failed:', err);
      });
  }, []);

  return null;
}
