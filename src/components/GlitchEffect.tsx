
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type GlitchType = 'primary' | 'secondary';

export function GlitchEffect() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchType, setGlitchType] = useState<GlitchType>('primary');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const triggerGlitch = (event: Event) => {
      const customEvent = event as CustomEvent<{ type?: GlitchType }>;
      setGlitchType(customEvent.detail?.type || 'primary');
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
      }, 300); // Duration matches CSS animation
    };

    window.addEventListener('trigger-glitch', triggerGlitch);

    return () => {
      window.removeEventListener('trigger-glitch', triggerGlitch);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      id="glitch-overlay"
      className={cn(
        'fixed top-0 left-0 w-full h-full z-[100] pointer-events-none opacity-0 bg-transparent',
        isGlitching && {
            'glitch-active': glitchType === 'primary',
            'glitch-secondary-active': glitchType === 'secondary'
        }
      )}
    />
  );
}
