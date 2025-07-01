
"use client";

import React, { useEffect } from 'react';

type MatrixCursorProps = {
  darkMode: boolean;
};

const MatrixCursor: React.FC<MatrixCursorProps> = ({ darkMode }) => {
  useEffect(() => {
    // Logic for Dark Mode (Matrix Trail)
    if (darkMode) {
      const throttleTimeout = { current: null as NodeJS.Timeout | null };
      const cursorPos = { x: 0, y: 0 };
      const CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";

      const createDarkParticle = (x: number, y: number) => {
        const particle = document.createElement('span');
        particle.className = 'matrix-cursor-particle';
        particle.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
      };

      const handleMouseMove = (e: MouseEvent) => {
        cursorPos.x = e.clientX;
        cursorPos.y = e.clientY;
        if (!throttleTimeout.current) {
          createDarkParticle(cursorPos.x, cursorPos.y);
          throttleTimeout.current = setTimeout(() => {
            throttleTimeout.current = null;
          }, 30);
        }
      };
      
      window.addEventListener('mousemove', handleMouseMove);

      // Cleanup function specifically for dark mode
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (throttleTimeout.current) {
          clearTimeout(throttleTimeout.current);
        }
        document.querySelectorAll('.matrix-cursor-particle').forEach(el => el.remove());
      };

    } 
    // Logic for Light Mode (Inverted Orb)
    else {
      const lightModeCursor = document.createElement('div');
      lightModeCursor.className = 'light-cursor';
      document.body.appendChild(lightModeCursor);
      
      const handleMouseMove = (e: MouseEvent) => {
        lightModeCursor.style.left = `${e.clientX}px`;
        lightModeCursor.style.top = `${e.clientY}px`;
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      
      // Cleanup function specifically for light mode
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.querySelectorAll('.light-cursor').forEach(el => el.remove());
      };
    }
  }, [darkMode]); // This effect re-runs when `darkMode` changes, cleaning up the old mode and setting up the new one.

  return null; // This component directly manipulates the DOM and renders nothing itself.
};

export default MatrixCursor;
