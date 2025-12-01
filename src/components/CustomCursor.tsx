
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverStart = () => {
      setIsHovering(true);
    };
    
    const handleHoverEnd = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('cursor-hover-start', handleHoverStart);
    document.addEventListener('cursor-hover-end', handleHoverEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('cursor-hover-start', handleHoverStart);
      document.removeEventListener('cursor-hover-end', handleHoverEnd);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="custom-cursor"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className={cn("cursor-galaxy", { hovered: isHovering })}>
        <div className="cursor-orbit"></div>
        <div className="cursor-orbit"></div>
        <div className="cursor-orbit"></div>
      </div>
    </div>
  );
}
