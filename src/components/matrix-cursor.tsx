"use client";

import React, { useEffect, useRef } from 'react';

type MatrixCursorProps = {
  darkMode: boolean;
};

const MatrixCursor: React.FC<MatrixCursorProps> = ({ darkMode }) => {
  const animationFrameId = useRef<number>();

  useEffect(() => {
    // Logic for Dark Mode (Matrix Trail)
    if (darkMode) {
      const cursorPos = { x: 0, y: 0 };
      const CHARS = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
      let lastTimestamp = 0;
      const throttleInterval = 40; // ~25fps, a good balance between effect and performance

      const createDarkParticle = (x: number, y: number) => {
        if (x === 0 && y === 0) return; // Don't draw particle at initial position
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
      };

      const updateAnimation = (timestamp: number) => {
        if (timestamp - lastTimestamp > throttleInterval) {
          lastTimestamp = timestamp;
          createDarkParticle(cursorPos.x, cursorPos.y);
        }
        animationFrameId.current = requestAnimationFrame(updateAnimation);
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      // Start the animation loop
      animationFrameId.current = requestAnimationFrame(updateAnimation);

      // Cleanup function specifically for dark mode
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
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
