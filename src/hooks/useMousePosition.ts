'use client';

import { useEffect, useRef } from 'react';

export function useMousePosition() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handler(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return mouse;
}
