
"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/use-theme';

const NUM_METEORS = 50;
const INTERACTION_RADIUS = 80; // Radius in pixels to react to the mouse
const REPULSION_STRENGTH = 0.5; // How strongly meteors are pushed away
const NUM_SHOOTING_STARS = 2;

type Meteor = {
  id: number;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  size: number;
  initialY: number;
  fallSpeed: number;
};

export function InteractiveMeteors() {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const generateMeteors = () => {
      const newMeteors: Meteor[] = [];
      const { innerWidth, innerHeight } = window;
      const shootingStarIndices = new Set<number>();
      while (shootingStarIndices.size < NUM_SHOOTING_STARS) {
        shootingStarIndices.add(Math.floor(Math.random() * NUM_METEORS));
      }

      for (let i = 0; i < NUM_METEORS; i++) {
        const isShootingStar = shootingStarIndices.has(i);
        const size = Math.random() * 3 + 2; // Increased size
        const x = Math.random() * innerWidth;
        const initialY = Math.random() * -innerHeight;
        newMeteors.push({
          id: i,
          x,
          y: initialY,
          vx: 0,
          vy: 0,
          size,
          initialY,
          fallSpeed: isShootingStar ? Math.random() * 3 + 3 : 0.2 + Math.random() * 0.5,
        });
      }
      setMeteors(newMeteors);
    };
    generateMeteors();
    window.addEventListener('resize', generateMeteors);
    return () => window.removeEventListener('resize', generateMeteors);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setMeteors(prevMeteors =>
        prevMeteors.map(m => {
          let { x, y, vx, vy, fallSpeed, initialY, ...rest } = m;
          const { innerWidth, innerHeight } = window;

          // Mouse interaction
          const dx = x - mousePos.current.x;
          const dy = y - mousePos.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < INTERACTION_RADIUS) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (INTERACTION_RADIUS - distance) / INTERACTION_RADIUS;
            vx += forceDirectionX * force * REPULSION_STRENGTH;
            vy += forceDirectionY * force * REPULSION_STRENGTH;
          }
          
          // Damping / friction
          vx *= 0.95;
          vy *= 0.95;

          // Apply velocity
          x += vx;
          y += vy;

          // Gravity / Falling
          y += fallSpeed;

          // Reset if off-screen
          if (y > innerHeight + 10) {
            y = initialY;
            x = Math.random() * innerWidth;
          }

          return { ...rest, x, y, vx, vy, fallSpeed, initialY };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const meteorColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    >
      {meteors.map(meteor => (
        <div
          key={meteor.id}
          className="rounded-full"
          style={{
            position: 'absolute',
            left: `${meteor.x}px`,
            top: `${meteor.y}px`,
            width: `${meteor.size}px`,
            height: `${meteor.size}px`,
            backgroundColor: meteorColor,
            boxShadow: `0 0 6px ${meteorColor}`,
            transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
          }}
        />
      ))}
    </div>
  );
}
