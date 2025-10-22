
"use client";

import React, { useEffect, useRef } from 'react';

type MatrixCursorProps = {
  darkMode: boolean;
  cursorText: string;
  color: string;
};

const MatrixCursor: React.FC<MatrixCursorProps> = ({ darkMode, cursorText, color }) => {
  const animationFrameId = useRef<number>();
  const lastTimestamp = useRef(0);
  const cursorPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let cleanup = () => {};

    const handleMouseMove = (e: MouseEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Logic for Text Cursor (when cursorText is provided in dark mode)
    if (cursorText && darkMode) {
      const textCursor = document.createElement('span');
      textCursor.className = 'cursor-text-label';
      document.body.appendChild(textCursor);
      
      const updateTextAnimation = () => {
        textCursor.textContent = cursorText;
        textCursor.style.left = `${cursorPos.current.x}px`;
        textCursor.style.top = `${cursorPos.current.y}px`;
        textCursor.style.setProperty('--cursor-glow-color', color);
        animationFrameId.current = requestAnimationFrame(updateTextAnimation);
      };
      animationFrameId.current = requestAnimationFrame(updateTextAnimation);
      
      cleanup = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        document.querySelectorAll('.cursor-text-label').forEach(el => el.remove());
      };
    }
    // Logic for Dark Mode (Matrix Trail)
    else if (darkMode) {
      const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
      "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン" +
      "あいうえおかきくけこさしすせそたちつてとなにぬねの" +
      "ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ" +
      "أبتثجحخدذرزسشصضطظعغفقكلمنهوي" +
      "अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह" +
      "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";
      const throttleInterval = 80;

      const colors = [
        'hsl(260, 60%, 65%)', 'hsl(var(--accent))', '#ff6b6b', '#feca57', 
        'hsl(var(--primary))', '#48dbfb'
      ];
      let colorIndex = 0;

      const createDarkParticle = (x: number, y: number) => {
        if (x === 0 && y === 0) return;
        const particle = document.createElement('span');
        particle.className = 'matrix-cursor-particle';
        particle.textContent = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
        
        const color = colors[colorIndex];
        particle.style.color = color;
        particle.style.textShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        colorIndex = (colorIndex + 1) % colors.length;

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);
        particle.addEventListener('animationend', () => particle.remove());
      };

      const updateAnimation = (timestamp: number) => {
        if (timestamp - lastTimestamp.current > throttleInterval) {
          lastTimestamp.current = timestamp;
          createDarkParticle(cursorPos.current.x, cursorPos.current.y);
        }
        animationFrameId.current = requestAnimationFrame(updateAnimation);
      };
      
      animationFrameId.current = requestAnimationFrame(updateAnimation);

      cleanup = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        document.querySelectorAll('.matrix-cursor-particle').forEach(el => el.remove());
      };
    } 
    // Logic for Light Mode (Inverted Orb)
    else {
      const lightModeCursor = document.createElement('div');
      lightModeCursor.className = 'light-cursor';
      document.body.appendChild(lightModeCursor);
      
      const updateLightAnimation = () => {
        lightModeCursor.style.left = `${cursorPos.current.x}px`;
        lightModeCursor.style.top = `${cursorPos.current.y}px`;
        animationFrameId.current = requestAnimationFrame(updateLightAnimation);
      };
      animationFrameId.current = requestAnimationFrame(updateLightAnimation);
      
      cleanup = () => {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        document.querySelectorAll('.light-cursor').forEach(el => el.remove());
      };
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cleanup();
    };
  }, [darkMode, cursorText, color]);

  return null;
};

export default MatrixCursor;
